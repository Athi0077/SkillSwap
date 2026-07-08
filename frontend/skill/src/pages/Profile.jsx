
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  Star,
  BookOpen,
  Award,
  Edit,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import ReviewCard from "../components/ReviewCard";
import Lanyard from "../components/Lanyard";

import { getMyProfile } from "../services/userService";
import { getUserReviews } from "../services/reviewService";

function Profile() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const profileRes = await getMyProfile();
      setUser(profileRes.user);

      if (profileRes.user?._id) {
        const reviewRes = await getUserReviews(profileRes.user._id);
        setReviews(reviewRes.reviews || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen dark-bento-page">
        <Sidebar />

        <main className="flex-1 p-8">

          {/* Profile Header */}
          <div className="glow-card-wrapper bg-[#120F17] p-8 relative">

            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">

              <img
                src={
                  user?.profileImage ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || "User"
                  )}&background=3B82F6&color=fff`
                }
                alt={user?.name}
                className="w-36 h-36 rounded-full object-cover border-4 border-[#2F293A]"
              />

              <div className="flex-1">

                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                  <div>
                    <h1 className="text-4xl font-bold text-white">
                      {user?.name}
                    </h1>
                    {user?.username && (
                      <p className="mt-1 font-semibold text-green-400">
                        @{user.username}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-gray-400 mt-2">
                      <Mail size={18} />
                      {user?.email}
                    </div>

                    {user?.location && (
                      <div className="flex items-center gap-2 text-gray-400 mt-2">
                        <MapPin size={18} />
                        {user.location}
                      </div>
                    )}
                  </div>

                  <Link
                    to="/profile/edit"
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition shadow-md"
                  >
                    <Edit size={18} />
                    Edit Profile
                  </Link>

                </div>

                <p className="mt-6 text-gray-300">
                  {user?.bio || "No bio available."}
                </p>

              </div>

            </div>

          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mt-8 relative z-10">

            <div className="glow-card-wrapper bg-[#120F17] p-6 text-center relative">
              <div className="relative z-10">
                <Star className="mx-auto text-yellow-500" size={34} />
                <h2 className="text-3xl font-bold mt-3 text-white">
                  {user?.rating || "0.0"}
                </h2>
                <p className="text-gray-400">Rating</p>
              </div>
            </div>

            <div className="glow-card-wrapper bg-[#120F17] p-6 text-center relative">
              <div className="relative z-10">
                <BookOpen className="mx-auto text-indigo-400" size={34} />
                <h2 className="text-3xl font-bold mt-3 text-white">
                  {user?.skillsOffered?.length || 0}
                </h2>
                <p className="text-gray-400">
                  Skills Offered
                </p>
              </div>
            </div>

            <div className="glow-card-wrapper bg-[#120F17] p-6 text-center relative">
              <div className="relative z-10">
                <Award className="mx-auto text-green-400" size={34} />
                <h2 className="text-3xl font-bold mt-3 text-white">
                  {reviews.length}
                </h2>
                <p className="text-gray-400">
                  Reviews
                </p>
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
                      No skills added.
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
                      No skills added.
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
                    currentUser={user}
                  />
                ))
              ) : (
                <div className="glow-card-wrapper bg-[#120F17] p-8 text-center text-gray-400 relative">
                  <span className="relative z-10">No reviews yet.</span>
                </div>
              )}

            </div>

          </section>

        </main>
      </div>
    </>
  );
}

export default Profile;
