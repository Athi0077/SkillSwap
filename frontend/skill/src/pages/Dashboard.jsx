
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  MessageCircle,
  CalendarDays,
  Star,
  Coins,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import UserCard from "../components/UserCard";
import { toast } from "react-hot-toast";
import SessionCard from "../components/SessionCard";

import { useAuth } from "../context/AuthContext";
import { getAllUsers } from "../services/userService";
import { getMySchedules } from "../services/scheduleService";
import { getMyRequests, sendRequest } from "../services/requestService";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [usersRes, sessionsRes, requestsRes] =
        await Promise.all([
          getAllUsers(),
          getMySchedules(),
          getMyRequests(),
        ]);

      // Randomize users on fetch so it changes every refresh
      const fetchedUsers = usersRes.users || [];
      const shuffledUsers = [...fetchedUsers].sort(() => 0.5 - Math.random());
      
      setRecommendedUsers(shuffledUsers);
      setSessions(sessionsRes.schedules || []);
      setRequests(requestsRes.requests || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (targetUser) => {
    try {
      await sendRequest({ receiver: targetUser._id });
      toast.success("Swap request sent to " + targetUser.name);
      navigate("/requests");
    } catch (error) {
      toast.error(error.message || "Failed to send request");
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading dashboard..." />;
  }

  const activeSessions = sessions.filter(
    (s) => s.status === "pending" || s.status === "accepted"
  );

  const pendingRequests = requests.filter((r) => r.status === "pending");

  const getRequestStatus = (targetUserId) => {
    const req = requests.find((r) => {
      const senderId = r.sender?._id || r.sender;
      const receiverId = r.receiver?._id || r.receiver;
      return (
        (senderId === targetUserId && receiverId === user?._id) ||
        (receiverId === targetUserId && senderId === user?._id)
      );
    });
    return req ? req.status : null;
  };

  return (
    <>
      <Navbar />

      <div className="flex dark-bento-page min-h-screen">

        <Sidebar />

        <main className="flex-1 p-8">

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 relative z-10">

            {/* Welcome (Spans 4 columns on desktop, 2 on mobile) */}
            <div className="glow-card-wrapper bg-[#120F17]/80 backdrop-blur-xl p-6 md:p-8 col-span-2 xl:col-span-4 flex flex-col justify-center relative overflow-hidden group border border-[#2F293A]">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/20 blur-[80px] rounded-full group-hover:bg-purple-600/30 transition-all duration-700 pointer-events-none"></div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 relative z-10">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 text-transparent bg-clip-text">
                  {user?.name}
                </span>
              </h1>
              <p className="text-gray-400 relative z-10 text-sm md:text-base max-w-md">
                Manage your learning journey, review requests, and discover new skills from here.
              </p>
            </div>

            {/* New Requests */}
            <div className="glow-card-wrapper bg-[#120F17]/80 backdrop-blur-xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 border border-[#2F293A]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-500/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-green-500/20 transition-all duration-500"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <MessageCircle className="text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]" size={28} />
                <div className="mt-3 md:mt-4">
                  <h2 className="text-2xl md:text-4xl font-bold text-white mb-0.5 md:mb-1">
                    {pendingRequests.length}
                  </h2>
                  <p className="text-gray-400 font-medium text-xs md:text-sm">
                    New Requests
                  </p>
                </div>
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="glow-card-wrapper bg-[#120F17]/80 backdrop-blur-xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 border border-[#2F293A]">
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-purple-500/20 transition-all duration-500"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <CalendarDays className="text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]" size={28} />
                <div className="mt-3 md:mt-4">
                  <h2 className="text-2xl md:text-4xl font-bold text-white mb-0.5 md:mb-1">
                    {activeSessions.length}
                  </h2>
                  <p className="text-gray-400 font-medium text-xs md:text-sm leading-tight">
                    Upcoming Sessions
                  </p>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="glow-card-wrapper bg-[#120F17]/80 backdrop-blur-xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 border border-[#2F293A]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[40px] rounded-full pointer-events-none group-hover:bg-yellow-500/20 transition-all duration-500"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <Star className="text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]" size={28} />
                <div className="mt-3 md:mt-4">
                  <h2 className="text-2xl md:text-4xl font-bold text-white mb-0.5 md:mb-1">
                    {user?.rating || "0.0"}
                  </h2>
                  <p className="text-gray-400 font-medium text-xs md:text-sm">
                    Your Rating
                  </p>
                </div>
              </div>
            </div>

            {/* Available Credits */}
            <div className="glow-card-wrapper bg-[#120F17]/80 backdrop-blur-xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 border border-[#2F293A]">
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 blur-[40px] rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-all duration-500"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <Coins className="text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]" size={28} />
                <div className="mt-3 md:mt-4">
                  <h2 className="text-2xl md:text-4xl font-bold text-white mb-0.5 md:mb-1">
                    {user?.credits || 0}
                  </h2>
                  <p className="text-gray-400 font-medium text-xs md:text-sm leading-tight">
                    Available Credits
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Recommended Users */}
          <section className="mt-12 relative z-10">

            <h2 className="text-2xl font-bold mb-6 text-white">
              Recommended Users
            </h2>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

              {recommendedUsers
                .filter((u) => u._id !== user?._id)
                .slice(0, 3)
                .map((item) => (
                  <UserCard
                    key={item._id}
                    user={item}
                    onRequest={handleRequest}
                    requestStatus={getRequestStatus(item._id)}
                  />
                ))}

            </div>

          </section>

          {/* Upcoming Sessions */}
          <section className="mt-12 relative z-10">

            <h2 className="text-2xl font-bold mb-6 text-white">
              Upcoming Sessions
            </h2>

            <div className="space-y-5">

              {activeSessions.length ? (
                activeSessions.map((session) => (
                  <SessionCard
                    key={session._id}
                    session={session}
                    onComplete={() => {}}
                    onCancel={() => {}}
                  />
                ))
              ) : (
                <EmptyState 
                  title="No Upcoming Sessions" 
                  message="You don't have any scheduled sessions right now." 
                  icon={CalendarDays}
                />
              )}

            </div>

          </section>

        </main>

      </div>
    </>
  );
}

export default Dashboard;
