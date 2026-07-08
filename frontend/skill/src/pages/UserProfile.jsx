
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Mail, Star } from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import ReviewCard from "../components/ReviewCard";
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

      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />

        <main className="flex-1 p-8">

          {/* Profile Card */}
          <div className="bg-white rounded-3xl shadow p-8">

            <div className="flex flex-col lg:flex-row gap-8 items-center">

              <img
                src={
                  user?.profileImage ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || "User"
                  )}`
                }
                alt={user?.name}
                className="w-40 h-40 rounded-full object-cover border-4 border-blue-600"
              />

              <div className="flex-1">

                <h1 className="text-4xl font-bold">
                  {user?.name}
                </h1>

                <div className="mt-4 space-y-2">

                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={18} />
                    {user?.email}
                  </div>

                  {user?.location && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={18} />
                      {user.location}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-yellow-500">
                    <Star
                      className="fill-yellow-400"
                      size={20}
                    />

                    <span className="font-semibold">
                      {user?.rating || "0.0"}
                    </span>
                  </div>

                </div>

                <p className="mt-6 text-gray-700">
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
                       isFriendMode ? "bg-indigo-600 hover:bg-indigo-700 shadow-md"
                       : requestStatus === "pending" ? "bg-amber-500 cursor-not-allowed opacity-90 shadow-md"
                       : "bg-blue-600 hover:bg-blue-700 shadow-md"
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

          {/* Skills */}
          <div className="grid lg:grid-cols-2 gap-8 mt-10">

            <div className="bg-white rounded-2xl shadow p-6">

              <h2 className="text-2xl font-bold mb-5">
                Skills Offered
              </h2>

              <div className="flex flex-wrap gap-3">

                {user?.skillsOffered?.length ? (
                  user.skillsOffered.map((skill) => (
                    <span
                      key={skill}
                      className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full"
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

            <div className="bg-white rounded-2xl shadow p-6">

              <h2 className="text-2xl font-bold mb-5">
                Skills Wanted
              </h2>

              <div className="flex flex-wrap gap-3">

                {user?.skillsWanted?.length ? (
                  user.skillsWanted.map((skill) => (
                    <span
                      key={skill}
                      className="bg-green-100 text-green-700 px-4 py-2 rounded-full"
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

          {/* Reviews */}
          <section className="mt-12">

            <h2 className="text-3xl font-bold mb-6">
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
                <EmptyState 
                  title="No Reviews Yet" 
                  message="This user hasn't received any reviews yet." 
                  icon={Star} 
                />
              )}

            </div>

          </section>

        </main>
      </div>
    </>
  );
}

export default UserProfile;