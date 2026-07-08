import { useEffect, useState } from "react";
import { Users, Handshake } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import UserCard from "../components/UserCard";

import { getAcceptedSwapUsers } from "../services/reviewService";

function SwapFriends() {
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const res = await getAcceptedSwapUsers();
      setFriends(res.users || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen message="Loading friends..." />;

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Swap Friends</h1>
            <p className="text-slate-500 mt-2">
              Users you have successfully swapped skills with.
            </p>
          </div>

          {friends.length === 0 ? (
            <EmptyState 
              title="No Swap Friends Yet" 
              message="Accept swap requests or have your requests accepted to start building your network!" 
              icon={Handshake} 
            />
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {friends.map((friend) => (
                <UserCard
                  key={friend._id}
                  user={friend}
                  isFriendMode={true}
                  onRequest={(user) => {
                    navigate(`/chat?userId=${user._id}`);
                  }}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default SwapFriends;
