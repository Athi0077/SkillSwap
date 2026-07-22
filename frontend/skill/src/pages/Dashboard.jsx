
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
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

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

  // Mock radar data based on user's skills or a default pro setup if empty
  const skillData = [
    { subject: 'Frontend', A: 120, fullMark: 150 },
    { subject: 'Backend', A: 98, fullMark: 150 },
    { subject: 'Design', A: 86, fullMark: 150 },
    { subject: 'DevOps', A: 99, fullMark: 150 },
    { subject: 'Soft Skills', A: 130, fullMark: 150 },
    { subject: 'Management', A: 85, fullMark: 150 },
  ];

  return (
    <>
      <Navbar />

      <div className="flex dark-bento-page min-h-screen">

        {/* <Sidebar /> */}

        <main className="flex-1 p-4 md:p-8 max-h-screen overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">

            {/* LEFT/CENTER COLUMN (Takes up 2/3 space on large screens) */}
            <div className="lg:col-span-2 space-y-6">

              {/* 1. Welcome Card + Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* Welcome Card */}
                <div className="col-span-2 md:col-span-4 glow-card-wrapper bg-[#120F17]/80 backdrop-blur-xl p-6 relative overflow-hidden group border border-[#2F293A]">
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

                {/* Stat 1: New Requests */}
                <div className="glow-card-wrapper bg-[#120F17]/80 backdrop-blur-xl p-4 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 border border-[#2F293A] flex flex-col justify-between min-h-[120px]">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-green-500/10 blur-[40px] rounded-full pointer-events-none group-hover:bg-green-500/20 transition-all duration-500"></div>
                  <MessageCircle className="text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.4)] relative z-10" size={24} />
                  <div className="relative z-10 mt-2">
                    <h2 className="text-2xl font-bold text-white mb-0.5">{pendingRequests.length}</h2>
                    <p className="text-gray-400 font-medium text-xs">New Requests</p>
                  </div>
                </div>

                {/* Stat 2: Upcoming Sessions */}
                <div className="glow-card-wrapper bg-[#120F17]/80 backdrop-blur-xl p-4 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 border border-[#2F293A] flex flex-col justify-between min-h-[120px]">
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-purple-500/10 blur-[40px] rounded-full pointer-events-none group-hover:bg-purple-500/20 transition-all duration-500"></div>
                  <CalendarDays className="text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.4)] relative z-10" size={24} />
                  <div className="relative z-10 mt-2">
                    <h2 className="text-2xl font-bold text-white mb-0.5">{activeSessions.length}</h2>
                    <p className="text-gray-400 font-medium text-xs">Sessions</p>
                  </div>
                </div>

                {/* Stat 3: Rating */}
                <div className="glow-card-wrapper bg-[#120F17]/80 backdrop-blur-xl p-4 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 border border-[#2F293A] flex flex-col justify-between min-h-[120px]">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 blur-[30px] rounded-full pointer-events-none group-hover:bg-yellow-500/20 transition-all duration-500"></div>
                  <Star className="text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.4)] relative z-10" size={24} />
                  <div className="relative z-10 mt-2">
                    <h2 className="text-2xl font-bold text-white mb-0.5">{user?.rating || "0.0"}</h2>
                    <p className="text-gray-400 font-medium text-xs">Your Rating</p>
                  </div>
                </div>

                {/* Stat 4: Credits */}
                <div className="glow-card-wrapper bg-[#120F17]/80 backdrop-blur-xl p-4 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 border border-[#2F293A] flex flex-col justify-between min-h-[120px]">
                  <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-500/10 blur-[30px] rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-all duration-500"></div>
                  <Coins className="text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.4)] relative z-10" size={24} />
                  <div className="relative z-10 mt-2">
                    <h2 className="text-2xl font-bold text-white mb-0.5">{user?.credits || 0}</h2>
                    <p className="text-gray-400 font-medium text-xs">Credits</p>
                  </div>
                </div>

              </div>

              {/* 2. Pro Radar Chart + Activity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Radar Chart */}
                <div className="glow-card-wrapper bg-[#120F17]/80 backdrop-blur-xl p-6 border border-[#2F293A] flex flex-col relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl pointer-events-none"></div>
                  <h3 className="text-xl font-bold text-white mb-4 relative z-10">Skill Balance</h3>
                  <div className="w-full h-[250px] relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={skillData}>
                        <PolarGrid stroke="#2F293A" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1A1625', borderColor: '#2F293A', borderRadius: '12px', color: '#fff' }} itemStyle={{ color: '#a855f7' }} />
                        <Radar name="Proficiency" dataKey="A" stroke="#a855f7" fill="#a855f7" fillOpacity={0.4} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="glow-card-wrapper bg-[#120F17]/80 backdrop-blur-xl p-6 border border-[#2F293A] relative">
                  <h3 className="text-xl font-bold text-white mb-6 relative z-10">Recent Activity</h3>
                  
                  <div className="space-y-5 relative z-10">
                    <div className="flex items-start gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 mt-1.5 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                      <div>
                        <p className="text-sm text-gray-300">You earned <span className="text-purple-400 font-semibold">1 credit</span></p>
                        <span className="text-xs text-gray-500">2 hours ago</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-500 mt-1.5 shadow-[0_0_8px_rgba(168,85,247,0.6)]"></div>
                      <div>
                        <p className="text-sm text-gray-300">Swap with <span className="text-purple-400 font-semibold">Alex</span> completed</p>
                        <span className="text-xs text-gray-500">1 day ago</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 mt-1.5 shadow-[0_0_8px_rgba(234,179,8,0.6)]"></div>
                      <div>
                        <p className="text-sm text-gray-300">Received a <span className="text-yellow-400 font-semibold">5-star review</span></p>
                        <span className="text-xs text-gray-500">3 days ago</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                      <div>
                        <p className="text-sm text-gray-300">Updated profile <span className="text-blue-400 font-semibold">skills</span></p>
                        <span className="text-xs text-gray-500">1 week ago</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* 3. Upcoming Sessions */}
              <section className="relative z-10 pt-4">
                <h2 className="text-2xl font-bold mb-4 text-white">
                  Upcoming Sessions
                </h2>
                <div className="space-y-4">
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

            </div>

            {/* RIGHT COLUMN (Takes up 1/3 space on large screens) */}
            <div className="space-y-6">
              
              {/* Recommended Users Panel */}
              <section className="glow-card-wrapper bg-[#120F17]/80 backdrop-blur-xl p-6 border border-[#2F293A] sticky top-6">
                <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                  <Users className="text-pink-400" size={22} />
                  Recommended for You
                </h2>

                <div className="flex flex-col gap-5">
                  {recommendedUsers
                    .filter((u) => u._id !== user?._id)
                    .slice(0, 4)
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

            </div>

          </div>
        </main>

      </div>
    </>
  );
}

export default Dashboard;
