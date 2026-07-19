import { useState, useEffect } from "react";
import { Search, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-hot-toast";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import UserCard from "../components/UserCard";

import { searchUsers, getAllUsers } from "../services/userService";
import { sendRequest } from "../services/requestService";
import { getAcceptedSwapUsers } from "../services/reviewService";
import { useAuth } from "../context/AuthContext";

function SearchUsers() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { user: currentUser } = useAuth();
  
  // Track requests sent during this session
  const [requestedUsers, setRequestedUsers] = useState(new Set());
  const [friendsSet, setFriendsSet] = useState(new Set());

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const res = await getAcceptedSwapUsers();
      if (res.users) {
        setFriendsSet(new Set(res.users.map((u) => u._id)));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (keyword.trim()) {
        performSearch(keyword);
      } else {
        fetchAllUsers();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword]);

  const performSearch = async (query) => {
    try {
      setLoading(true);
      const res = await searchUsers(query);
      setUsers(res.users || []);
      setHasSearched(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      let allUsers = res.users || [];
      if (currentUser) {
        allUsers = allUsers.filter(u => u._id !== currentUser._id);
      }
      setUsers(allUsers);
      setHasSearched(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (targetUser) => {
    if (friendsSet.has(targetUser._id)) {
      navigate(`/chat?userId=${targetUser._id}`);
      return;
    }

    try {
      if (!currentUser) {
        toast.error("Please login first.");
        return;
      }
      
      await sendRequest({ receiver: targetUser._id });
      setRequestedUsers(new Set(requestedUsers).add(targetUser._id));
      toast.success("Swap request sent!");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to send request.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen dark-bento-page">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="mb-8 relative z-10">
            <h1 className="text-3xl font-bold text-white">Search Friends</h1>
            <p className="text-gray-400 mt-2">
              Find users by name or @username to make skill swaps.
            </p>
          </div>

          <div className="glow-card-wrapper bg-[#120F17] p-6 mb-8 border border-[#2F293A] relative z-10">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder="Search by name or username (e.g. authour)..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#0B090F] border border-[#2F293A] text-white rounded-xl focus:ring-2 focus:ring-purple-500 transition-all placeholder-gray-500 outline-none"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner message="Searching users..." />
          ) : (
            <>
              {hasSearched && users.length === 0 ? (
                <EmptyState 
                  title="No Users Found" 
                  message="Try searching with a different name or username." 
                />
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {users.map((user) => (
                    <UserCard
                      key={user._id}
                      user={user}
                      isFriendMode={friendsSet.has(user._id)}
                      requestStatus={requestedUsers.has(user._id) ? "pending" : null}
                      onRequest={handleRequest}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}

export default SearchUsers;
