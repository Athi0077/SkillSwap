
import { useEffect, useState, useMemo } from "react";
import { Search, Users, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import UserCard from "../components/UserCard";
import { toast } from "react-hot-toast";

import { skillOptions } from "../constants/skillOptions";
import { getAllUsers } from "../services/userService";
import { sendRequest, getMyRequests } from "../services/requestService";
import { useAuth } from "../context/AuthContext";

function FindSkills() {

  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, requestsRes] = await Promise.all([
        getAllUsers(),
        getMyRequests(),
      ]);
      setAllUsers(usersRes.users || []);
      setRequests(requestsRes.requests || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRequestStatus = (targetUserId) => {
    const req = requests.find((r) => {
      const senderId = r.sender?._id || r.sender;
      const receiverId = r.receiver?._id || r.receiver;
      return (
        (senderId === targetUserId && receiverId === currentUser?._id) ||
        (receiverId === targetUserId && senderId === currentUser?._id)
      );
    });
    return req ? req.status : null;
  };

  const toggleSkill = (name) => {
    setSelectedSkills((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const handleClear = () => setSelectedSkills([]);

  const handleRequest = async (targetUser) => {
    try {
      await sendRequest({ receiver: targetUser._id });
      toast.success("Swap request sent to " + targetUser.name);
      navigate("/requests");
    } catch (error) {
      toast.error(error.message || "Failed to send request");
    }
  };

  // Live filter: users (excluding self) who match selected skills and/or search term
  const filteredUsers = useMemo(() => {
    if (selectedSkills.length === 0 && !searchTerm.trim()) return [];

    return allUsers.filter((u) => {
      // Exclude logged-in user
      if (u._id === currentUser?._id) return false;

      let matchesSkill = true;
      if (selectedSkills.length > 0) {
        matchesSkill = u.skillsOffered?.some((offered) =>
          selectedSkills.some(
            (sel) => sel.trim().toLowerCase() === offered.trim().toLowerCase()
          )
        );
      }

      let matchesSearch = true;
      if (searchTerm.trim()) {
        const term = searchTerm.trim().toLowerCase();
        
        const hasMatchingSkill = u.skillsOffered?.some(skill => 
          skill.toLowerCase().includes(term)
        );

        matchesSearch = hasMatchingSkill;
      }

      return matchesSkill && matchesSearch;
    });
  }, [allUsers, selectedSkills, currentUser, searchTerm]);

  if (loading) return <LoadingSpinner fullScreen message="Loading tutors..." />;

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen dark-bento-page">
        <Sidebar />

        <main className="flex-1 p-8">

          {/* Page Header */}
          <div className="mb-8 relative z-10">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">Find Skills</h1>
            <p className="text-gray-400 mt-1">
              Click a skill to instantly see tutors who offer it
            </p>
          </div>

          {/* searchbar  */}
          <div>
            <div className="relative">
              <Search className="absolute left-4 top-6.5 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search by skill..."
                className="w-full mb-5 pl-10 pr-4 py-3 rounded-lg bg-[#1E1A29] border border-[#2F293A] text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Skill Selector Panel */}
          <div className="glow-card-wrapper bg-[#120F17] p-6 mb-8 relative">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Select Skills
                </h2>
                {selectedSkills.length > 0 && (
                  <button
                    onClick={handleClear}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <RotateCcw size={13} />
                    Clear all
                  </button>
                )}
              </div>

              {/* Skill Pills */}
              <div className="flex flex-wrap gap-3 max-h-[250px] overflow-y-auto">
                {skillOptions.map((name) => {
                  const isChecked = selectedSkills.includes(name);
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => toggleSkill(name)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all duration-200 select-none active:scale-95 hover:-translate-y-0.5
                        ${
                          isChecked
                            ? "border-purple-500 bg-purple-600 text-white shadow-[0_4px_15px_rgba(168,85,247,0.4)] scale-105"
                            : "border-[#2F293A] bg-[#1E1A29] text-gray-400 hover:border-purple-500/50 hover:bg-purple-900/30 hover:text-purple-300 hover:shadow-md"
                        }`}
                    >
                      {isChecked && (
                        <span className="w-4 h-4 flex items-center justify-center bg-white rounded-full text-purple-600 font-bold text-xs flex-shrink-0">
                          ✓
                        </span>
                      )}
                      {name}
                    </button>
                  );
                })}
              </div>

              {/* Active filter chips */}
              {selectedSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-[#2F293A]">
                  <span className="text-xs text-gray-500 self-center mr-1">
                    Filtering by:
                  </span>
                  {selectedSkills.map((s) => (
                    <span
                      key={s}
                      className="flex items-center gap-1 bg-purple-900/50 text-purple-300 border border-purple-500/30 text-xs px-3 py-1.5 rounded-full font-medium"
                    >
                      {s}
                      <button
                        onClick={() => toggleSkill(s)}
                        className="hover:text-purple-100 font-bold leading-none ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          {selectedSkills.length === 0 && !searchTerm.trim() ? (
            <div className="glow-card-wrapper bg-[#120F17] p-16 text-center relative mt-10">
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative w-24 h-24 flex items-center justify-center mb-6">
                  <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse"></div>
                  <div className="w-20 h-20 bg-[#1E1A29] border border-purple-500/20 rounded-full flex items-center justify-center relative z-10 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                    <Search size={36} className="text-purple-400" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text mb-3">
                  Start your search
                </h2>
                <p className="text-gray-400 max-w-md mx-auto">
                  Select skills from the panel above or type in the search bar to instantly find tutors that match your criteria.
                </p>
              </div>
            </div>

          ) : filteredUsers.length > 0 ? (
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-5 text-gray-400 text-sm">
                <Users size={16} />
                <span>
                  <span className="font-semibold text-white">
                    {filteredUsers.length}
                  </span>{" "}
                  {filteredUsers.length === 1 ? "tutor" : "tutors"} found
                  {selectedSkills.length > 0 && (
                    <>
                      {" "}offering{" "}
                      <span className="font-semibold text-purple-400">
                        {selectedSkills.join(", ")}
                      </span>
                    </>
                  )}
                  {searchTerm.trim() && (
                    <>
                      {" "}matching "
                      <span className="font-semibold text-purple-400">
                        {searchTerm.trim()}
                      </span>
                      "
                    </>
                  )}
                </span>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredUsers.map((u) => (
                  <UserCard
                    key={u._id}
                    user={u}
                    onRequest={handleRequest}
                    requestStatus={getRequestStatus(u._id)}
                  />
                ))}
              </div>
            </div>

          ) : (
            <div className="glow-card-wrapper bg-[#120F17] p-16 text-center relative mt-10">
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative w-24 h-24 flex items-center justify-center mb-6">
                  <div className="absolute inset-0 bg-gray-600/10 blur-xl rounded-full"></div>
                  <div className="w-20 h-20 bg-[#1E1A29] border border-gray-700/50 rounded-full flex items-center justify-center relative z-10">
                    <Users size={36} className="text-gray-500 opacity-80" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-300 mb-3">
                  No tutors found
                </h2>
                <p className="text-gray-500 max-w-sm mx-auto">
                  Nobody matches your current filters. Try different skills or expanding your search terms.
                </p>
                <button
                  onClick={() => {
                    handleClear();
                    setSearchTerm("");
                  }}
                  className="mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(168,85,247,0.3)] active:scale-95"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  );
}

export default FindSkills;