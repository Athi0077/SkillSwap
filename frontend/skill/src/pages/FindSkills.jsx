
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

  // Live filter: users (excluding self) who offer ANY of the selected skills
  const filteredUsers = useMemo(() => {
    if (selectedSkills.length === 0) return [];

    return allUsers.filter((u) => {
      // Exclude logged-in user
      if (u._id === currentUser?._id) return false;

      // Check if user offers at least one of the selected skills (case-insensitive)
      return u.skillsOffered?.some((offered) =>
        selectedSkills.some(
          (sel) => sel.trim().toLowerCase() === offered.trim().toLowerCase()
        )
      );
    });
  }, [allUsers, selectedSkills, currentUser]);

  if (loading) return <LoadingSpinner fullScreen message="Loading tutors..." />;

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen dark-bento-page">
        <Sidebar />

        <main className="flex-1 p-8">

          {/* Page Header */}
          <div className="mb-8 relative z-10">
            <h1 className="text-3xl font-bold text-white">Find Skills</h1>
            <p className="text-gray-400 mt-1">
              Click a skill to instantly see tutors who offer it
            </p>
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
              <div className="flex flex-wrap gap-3">
                {skillOptions.map((name) => {
                  const isChecked = selectedSkills.includes(name);
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => toggleSkill(name)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all duration-200 select-none
                        ${
                          isChecked
                            ? "border-purple-500 bg-purple-600 text-white shadow-md scale-105"
                            : "border-[#2F293A] bg-[#1E1A29] text-gray-400 hover:border-purple-500/50 hover:bg-purple-900/30 hover:text-purple-300"
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
          {selectedSkills.length === 0 ? (
            <div className="glow-card-wrapper bg-[#120F17] p-14 text-center relative">
              <div className="relative z-10">
                <div className="w-20 h-20 bg-[#1E1A29] rounded-full flex items-center justify-center mx-auto mb-5">
                  <Search size={32} className="text-purple-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  Click a skill above to find tutors
                </h2>
                <p className="text-gray-400 mt-2 text-sm">
                  Results appear instantly as you select skills.
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
                  {filteredUsers.length === 1 ? "tutor" : "tutors"} offering{" "}
                  <span className="font-semibold text-purple-400">
                    {selectedSkills.join(", ")}
                  </span>
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
            <div className="glow-card-wrapper bg-[#120F17] p-14 text-center relative">
              <div className="relative z-10">
                <div className="w-20 h-20 bg-[#1E1A29] rounded-full flex items-center justify-center mx-auto mb-5">
                  <Users size={32} className="text-gray-500" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  No tutors found
                </h2>
                <p className="text-gray-400 mt-2 text-sm">
                  Nobody is currently offering{" "}
                  <span className="font-medium text-gray-200">
                    {selectedSkills.join(", ")}
                  </span>
                  . Try a different skill.
                </p>
                <button
                  onClick={handleClear}
                  className="mt-5 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  Clear Selection
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