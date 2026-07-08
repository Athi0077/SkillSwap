
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
import { sendRequest } from "../services/requestService";
import { useAuth } from "../context/AuthContext";

function UserProfile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();

  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

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
                    onClick={handleSwapRequest}
                    disabled={sending}
                    className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl disabled:opacity-60"
                  >
                    {sending
                      ? "Sending..."
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