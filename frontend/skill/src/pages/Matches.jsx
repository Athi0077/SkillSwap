import { useEffect, useState } from "react";
import { Users, Handshake } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import UserCard from "../components/UserCard";
import MatchSwiper from "../components/MatchSwiper";
import { toast } from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import { getAllUsers } from "../services/userService";
import { sendRequest, getMyRequests } from "../services/requestService";

function Matches() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [requests, setRequests] = useState([]);
  const [viewMode, setViewMode] = useState("swipe"); // 'grid' or 'swipe'

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const [usersRes, requestsRes] = await Promise.all([
        getAllUsers(),
        getMyRequests(),
      ]);
      
      const allUsers = usersRes.users || [];
      setRequests(requestsRes.requests || []);
      
      // Filter users who offer what the logged in user wants
      const matchingUsers = allUsers.filter(u => {
        if (u._id === user?._id) return false;
        
        const offersWhatIWant = u.skillsOffered?.some(skill => 
          user?.skillsWanted?.includes(skill)
        );
        
        return offersWhatIWant;
      });

      setMatches(matchingUsers);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
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
  const handleSwapRequest = async (targetUser) => {
    try {
      await sendRequest({ receiver: targetUser._id });
      toast.success("Swap request sent to " + targetUser.name);
      navigate("/requests");
    } catch (error) {
      toast.error(error.message || "Failed to send request");
    }
  };

  if (loading) return <LoadingSpinner fullScreen message="Finding matches..." />;

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen dark-bento-page">
        {/* <Sidebar /> */}

        <main className="flex-1 p-8">
          <div className="mb-8 relative z-10">
            <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
              <Handshake className="text-purple-500" size={32} />
              Your Matches
            </h1>
            <p className="text-gray-400 mt-2">
              Users who offer the skills you want to learn.
            </p>
          </div>

          {matches.length === 0 ? (
            <div className="relative z-10">
              <EmptyState 
                title="No matches found yet" 
                message="We couldn't find anyone currently offering the skills you want to learn. Try updating your 'Skills Wanted' in your profile!" 
                icon={Users} 
              />
            </div>
          ) : (
            <div className="relative z-10">
              {/* View Mode Toggle */}
              <div className="flex justify-end mb-6">
                <div className="flex bg-[#120F17] p-1 rounded-lg border border-[#2F293A]">
                   <button
                     onClick={() => setViewMode('grid')}
                     className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                   >
                      Grid
                   </button>
                   <button
                     onClick={() => setViewMode('swipe')}
                     className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'swipe' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                   >
                      Swipe
                   </button>
                </div>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {matches.map((matchUser) => (
                    <UserCard 
                      key={matchUser._id} 
                      user={matchUser} 
                      onRequest={handleSwapRequest}
                      requestStatus={getRequestStatus(matchUser._id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="pt-4">
                  <MatchSwiper 
                    users={matches} 
                    onRequest={handleSwapRequest} 
                    requestStatusGetter={getRequestStatus} 
                  />
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default Matches;
