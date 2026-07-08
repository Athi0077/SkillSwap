
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

          {/* Welcome */}
          <div className="mb-8 relative z-10">
            <h1 className="text-3xl font-bold text-white">
              Welcome,
              <span className="text-indigo-400">
                {" "}
                {user?.name}
              </span>
            </h1>

            <p className="text-gray-400 mt-2">
              Manage your learning journey from here.
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 relative z-10">

            <div className="glow-card-wrapper bg-[#120F17] p-6 relative">
              <div className="relative z-10">
                <MessageCircle
                  className="text-green-500 mb-4"
                  size={32}
                />
                <h2 className="text-3xl font-bold text-white">
                  {pendingRequests.length}
                </h2>
                <p className="text-gray-400">
                  New Requests
                </p>
              </div>
            </div>

            <div className="glow-card-wrapper bg-[#120F17] p-6 relative">
              <div className="relative z-10">
                <CalendarDays
                  className="text-purple-500 mb-4"
                  size={32}
                />
                <h2 className="text-3xl font-bold text-white">
                  {activeSessions.length}
                </h2>
                <p className="text-gray-400">
                  Upcoming Sessions
                </p>
              </div>
            </div>

            <div className="glow-card-wrapper bg-[#120F17] p-6 relative">
              <div className="relative z-10">
                <Star
                  className="text-yellow-500 mb-4"
                  size={32}
                />
                <h2 className="text-3xl font-bold text-white">
                  {user?.rating || "0.0"}
                </h2>
                <p className="text-gray-400">
                  Your Rating
                </p>
              </div>
            </div>

            <div className="glow-card-wrapper bg-[#120F17] p-6 relative">
              <div className="relative z-10">
                <Coins
                  className="text-blue-500 mb-4"
                  size={32}
                />
                <h2 className="text-3xl font-bold text-white">
                  {user?.credits || 0}
                </h2>
                <p className="text-gray-400">
                  Available Credits
                </p>
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
