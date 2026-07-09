import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, UserPlus, UserMinus, Globe, MessageSquare } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import { getHubById, joinHub, leaveHub } from "../services/hubService";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import HubChat from "../components/HubChat";

function HubDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [hub, setHub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("members"); // "members" | "chat"

  useEffect(() => {
    loadHub();
  }, [id]);

  const loadHub = async () => {
    try {
      setLoading(true);
      const res = await getHubById(id);
      setHub(res.hub);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load hub details");
      navigate("/hubs");
    } finally {
      setLoading(false);
    }
  };

  const isMember = hub?.members?.some((member) => member._id === user?._id);

  const handleJoin = async () => {
    try {
      setActionLoading(true);
      await joinHub(id);
      toast.success(`Joined ${hub.name}!`);
      loadHub();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to join hub");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    try {
      setActionLoading(true);
      await leaveHub(id);
      toast.success(`Left ${hub.name}`);
      loadHub();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to leave hub");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading hub..." />;
  }

  if (!hub) {
    return null; // Handled by loadHub error catch
  }

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen dark-bento-page">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8">
          <button
            onClick={() => navigate("/hubs")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 relative z-10"
          >
            <ArrowLeft size={20} />
            Back to Hubs
          </button>

          {/* Hub Header Card */}
          <div className="glow-card-wrapper bg-[#120F17] border border-[#2F293A] rounded-3xl p-6 md:p-8 mb-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex gap-4">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center shrink-0">
                  <Globe className="text-purple-400" size={32} />
                </div>
                
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{hub.name}</h1>
                  <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
                    <span className="flex items-center gap-1 bg-[#1A1625] px-3 py-1 rounded-full border border-[#2F293A]">
                      <Users size={14} />
                      {hub.members?.length || 0} Members
                    </span>
                    <span>Created by {hub.creator?.name || "Unknown"}</span>
                  </div>
                  <p className="text-gray-300 max-w-2xl md:text-lg">{hub.description}</p>
                </div>
              </div>

              <div className="shrink-0 flex self-start w-full md:w-auto">
                {isMember ? (
                  <button
                    onClick={handleLeave}
                    disabled={actionLoading}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#1A1625] hover:bg-red-500/10 hover:text-red-400 text-gray-300 border border-[#2F293A] hover:border-red-500/30 px-6 py-3 rounded-xl transition font-medium"
                  >
                    <UserMinus size={18} />
                    {actionLoading ? "Leaving..." : "Leave Hub"}
                  </button>
                ) : (
                  <button
                    onClick={handleJoin}
                    disabled={actionLoading}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition shadow-[0_0_15px_rgba(147,51,234,0.3)] font-medium"
                  >
                    <UserPlus size={18} />
                    {actionLoading ? "Joining..." : "Join Hub"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tabs UI */}
          <div className="flex items-center gap-4 mb-6 relative z-10 border-b border-[#2F293A] pb-4">
            <button
              onClick={() => setActiveTab("members")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                activeTab === "members"
                  ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                  : "text-gray-400 hover:text-white hover:bg-[#1A1625]"
              }`}
            >
              <Users size={18} />
              Members
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                activeTab === "chat"
                  ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                  : "text-gray-400 hover:text-white hover:bg-[#1A1625]"
              }`}
            >
              <MessageSquare size={18} />
              Chat Room
            </button>
          </div>

          {/* Conditional Rendering based on Tab */}
          <div className="relative z-10">
            {activeTab === "members" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {hub.members?.length === 0 ? (
                  <div className="col-span-full text-center text-gray-500 py-10 bg-[#120F17] rounded-2xl border border-[#2F293A]">
                    No members have joined yet. Be the first!
                  </div>
                ) : (
                  hub.members?.map((member) => (
                    <div
                      key={member._id}
                      onClick={() => navigate(`/user/${member._id}`)}
                      className="bg-[#120F17] border border-[#2F293A] rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-[#1A1625] hover:border-purple-500/30 transition-all duration-300 group"
                    >
                      <img
                        src={
                          member.profileImage ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=3B82F6&color=fff`
                        }
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover border border-[#2F293A] group-hover:border-purple-500/50 transition-colors"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate group-hover:text-purple-400 transition-colors">{member.name}</h3>
                        <p className="text-xs text-gray-500 truncate">{member.username ? `@${member.username}` : "Member"}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <HubChat hubId={hub._id} isMember={isMember} />
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default HubDetails;
