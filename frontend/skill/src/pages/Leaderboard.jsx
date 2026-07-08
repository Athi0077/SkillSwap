import { useState, useEffect } from "react";
import { Trophy, Star, TrendingUp, Medal, Award } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import { getLeaderboard } from "../services/userService";
import { useNavigate } from "react-router-dom";

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await getLeaderboard();
      setUsers(res.users || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy className="text-yellow-400" size={32} />;
      case 1:
        return <Medal className="text-gray-300" size={32} />;
      case 2:
        return <Award className="text-amber-600" size={32} />;
      default:
        return <span className="text-2xl font-bold text-gray-500 w-8 text-center">{index + 1}</span>;
    }
  };

  const getRankStyle = (index) => {
    if (index === 0) return "border-yellow-400/50 bg-yellow-400/5 shadow-[0_0_15px_rgba(250,204,21,0.15)]";
    if (index === 1) return "border-gray-300/50 bg-gray-300/5 shadow-[0_0_15px_rgba(209,213,219,0.1)]";
    if (index === 2) return "border-amber-600/50 bg-amber-600/5 shadow-[0_0_15px_rgba(217,119,6,0.1)]";
    return "border-[#2F293A] bg-[#120F17] hover:border-purple-500/30 hover:bg-[#1A1625]";
  };

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen dark-bento-page">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <Trophy className="text-purple-400" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Top Mentors Leaderboard</h1>
              <p className="text-gray-400">The most active and helpful skill swappers this week.</p>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading rankings..." />
          ) : (
            <div className="space-y-4 relative z-10">
              {users.map((user, index) => (
                <div
                  key={user._id}
                  onClick={() => navigate(`/user/${user._id}`)}
                  className={`glow-card-wrapper p-6 flex items-center gap-6 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${getRankStyle(index)}`}
                >
                  <div className="flex-shrink-0 w-12 flex justify-center">
                    {getRankIcon(index)}
                  </div>

                  <img
                    src={
                      user.profileImage ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3B82F6&color=fff`
                    }
                    alt={user.name}
                    className={`w-16 h-16 rounded-full object-cover border-2 ${
                      index === 0 ? "border-yellow-400" : index === 1 ? "border-gray-300" : index === 2 ? "border-amber-600" : "border-[#2F293A]"
                    }`}
                  />

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">{user.name}</h3>
                    <p className="text-purple-400 text-sm mb-1">{user.username ? `@${user.username}` : ''}</p>
                    <div className="flex flex-wrap gap-2">
                      {(user.skillsOffered || []).slice(0, 3).map((skill, i) => (
                        <span key={i} className="text-xs bg-[#2F293A] text-gray-300 px-2 py-1 rounded-md">
                          {skill}
                        </span>
                      ))}
                      {user.skillsOffered?.length > 3 && (
                        <span className="text-xs text-gray-500">+{user.skillsOffered.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 bg-yellow-500/10 px-4 py-2 rounded-xl border border-yellow-500/20">
                      <Star className="text-yellow-500" size={18} fill="currentColor" />
                      <span className="font-bold text-yellow-500">{user.rating?.toFixed(1) || "0.0"}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-500/20">
                      <TrendingUp className="text-indigo-400" size={18} />
                      <span className="font-bold text-indigo-400">{user.credits || 0} Credits</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default Leaderboard;
