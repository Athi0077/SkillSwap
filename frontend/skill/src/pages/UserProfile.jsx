
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Mail, Star } from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import ReviewCard from "../components/ReviewCard";
import Lanyard from "../components/Lanyard";
import { toast } from "react-hot-toast";

import { getUserById } from "../services/userService";
import { getUserReviews } from "../services/reviewService";
import { sendRequest, getMyRequests } from "../services/requestService";
import { useAuth } from "../context/AuthContext";

function UserProfile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();

  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null);
  const [isFriendMode, setIsFriendMode] = useState(false);
  const navigate = require("react-router-dom").useNavigate();

  useEffect(() => {
    loadUserProfile();
  }, [id]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);

      const userRes = await getUserById(id);
      setUser(userRes.user);

      const reviewRes = await getUserReviews(id);
      setReviews(reviewRes.reviews || []);

      if (currentUser && currentUser._id !== id) {
        const reqRes = await getMyRequests();
        const existingReq = reqRes.requests.find(
          r => (r.sender?._id === id && r.receiver?._id === currentUser._id) || 
               (r.sender?._id === currentUser._id && r.receiver?._id === id)
        );
        if (existingReq) {
          setRequestStatus(existingReq.status);
          if (existingReq.status === 'accepted') setIsFriendMode(true);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapRequest = async () => {
    try {
      setSending(true);

      await sendRequest({
        receiver: user._id,
      });

      toast.success("Skill swap request sent successfully.");
      setRequestStatus("pending");
    } catch (error) {
      toast.error(error.message || "Unable to send request.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading user profile..." />;
  }

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen dark-bento-page">
        <Sidebar />

        <main className="flex-1 p-8">

          {/* Profile Card */}
          <div className="glow-card-wrapper bg-[#120F17] p-8 relative">

            <div className="flex flex-col lg:flex-row gap-8 items-center relative z-10">

              <img
                src={
                  user?.profileImage ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || "User"
                  )}&background=3B82F6&color=fff`
                }
                alt={user?.name}
                className="w-40 h-40 rounded-full object-cover border-4 border-[#2F293A]"
              />

              <div className="flex-1">

                <h1 className="text-4xl font-bold text-white">
                  {user?.name}
                </h1>

                <div className="mt-4 space-y-2">

                  <div className="flex items-center gap-2 text-gray-400">
                    <Mail size={18} />
                    {user?.email}
                  </div>

                  {user?.location && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin size={18} />
                      {user.location}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-yellow-500">
                    <Star
                      className="fill-yellow-400"
                      size={20}
                    />

                    <span className="font-semibold text-white">
                      {user?.rating || "0.0"}
                    </span>
                  </div>

                </div>

                <p className="mt-6 text-gray-300">
                  {user?.bio || "No bio available."}
                </p>

                {currentUser?._id !== user?._id && (
                  <button
                    onClick={() => {
                      if (isFriendMode) {
                        navigate(`/chat?userId=${user._id}`);
                      } else if (!requestStatus || requestStatus === 'cancelled' || requestStatus === 'rejected') {
                        handleSwapRequest();
                      }
                    }}
                    disabled={sending || requestStatus === 'pending'}
                    className={`mt-8 px-8 py-3 rounded-xl disabled:opacity-60 text-white font-semibold transition-all ${
                       isFriendMode ? "bg-purple-600 hover:bg-purple-700 shadow-md"
                       : requestStatus === "pending" ? "bg-amber-600 cursor-not-allowed opacity-90 shadow-md"
                       : "bg-indigo-600 hover:bg-indigo-700 shadow-md"
                    }`}
                  >
                    {sending
                      ? "Sending..."
                      : isFriendMode
                      ? "Message"
                      : requestStatus === "pending"
                      ? "Request Pending"
                      : "Send Skill Swap Request"}
                  </button>
                )}

              </div>

            </div>

          </div>

          {/* 3D Lanyard ID Card */}
          <div className="mt-8 relative z-10 w-full flex justify-center bg-[#120F17] rounded-3xl overflow-hidden border border-[#2F293A] shadow-lg">
            <Lanyard
              position={[0, 0, 24]}
              gravity={[0, -40, 0]}
              frontImage={user?.profileImage || null}
              imageFit="cover"
            />
          </div>

          {/* Skills */}
          <div className="grid lg:grid-cols-2 gap-8 mt-10 relative z-10">

            <div className="glow-card-wrapper bg-[#120F17] p-6 relative">

              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-5 text-white">
                  Skills Offered
                </h2>

                <div className="flex flex-wrap gap-3">

                  {user?.skillsOffered?.length ? (
                    user.skillsOffered.map((skill) => (
                      <span
                        key={skill}
                        className="bg-indigo-900/50 text-indigo-300 border border-indigo-500/30 px-4 py-2 rounded-full"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      No skills listed.
                    </p>
                  )}

                </div>
              </div>

            </div>

            <div className="glow-card-wrapper bg-[#120F17] p-6 relative">

              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-5 text-white">
                  Skills Wanted
                </h2>

                <div className="flex flex-wrap gap-3">

                  {user?.skillsWanted?.length ? (
                    user.skillsWanted.map((skill) => (
                      <span
                        key={skill}
                        className="bg-purple-900/50 text-purple-300 border border-purple-500/30 px-4 py-2 rounded-full"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      No skills listed.
                    </p>
                  )}

                </div>
              </div>

            </div>

          </div>

          {/* Reviews */}
          <section className="mt-12 relative z-10">

            <h2 className="text-3xl font-bold mb-6 text-white">
              Reviews
            </h2>

            <div className="space-y-6">

              {reviews.length ? (
                reviews.map((review) => (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    currentUser={currentUser}
                  />
                ))
              ) : (
                <div className="relative z-10">
                  <EmptyState 
                    title="No Reviews Yet" 
                    message="This user hasn't received any reviews yet." 
                    icon={Star} 
                  />
                </div>
              )}

            </div>

          </section>

        </main>
      </div>
    </>
  );
}

export default UserProfile;