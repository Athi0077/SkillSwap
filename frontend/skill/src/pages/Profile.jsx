
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

      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />

        <main className="flex-1 p-8">

          {/* Profile Header */}
          <div className="bg-white rounded-3xl shadow p-8">

            <div className="flex flex-col md:flex-row items-center gap-8">

              <img
                src={
                  user?.profileImage ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || "User"
                  )}&background=2563eb&color=fff`
                }
                alt={user?.name}
                className="w-36 h-36 rounded-full object-cover border-4 border-blue-600"
              />

              <div className="flex-1">

                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                  <div>
                    <h1 className="text-4xl font-bold">
                      {user?.name}
                    </h1>
                    {user?.username && (
                      <p className="text-gray-500 mt-1 font-semibold text-green-500">
                        @{user.username}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-gray-500 mt-2">
                      <Mail size={18} />
                      {user?.email}
                    </div>

                    {user?.location && (
                      <div className="flex items-center gap-2 text-gray-500 mt-2">
                        <MapPin size={18} />
                        {user.location}
                      </div>
                    )}
                  </div>

                  <Link
                    to="/profile/edit"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
                  >
                    <Edit size={18} />
                    Edit Profile
                  </Link>

                </div>

                <p className="mt-6 text-gray-700">
                  {user?.bio || "No bio available."}
                </p>

              </div>

            </div>

          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">

            <div className="bg-white rounded-2xl shadow p-6 text-center">
              <Star className="mx-auto text-yellow-500" size={34} />
              <h2 className="text-3xl font-bold mt-3">
                {user?.rating || "0.0"}
              </h2>
              <p className="text-gray-500">Rating</p>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 text-center">
              <BookOpen className="mx-auto text-blue-600" size={34} />
              <h2 className="text-3xl font-bold mt-3">
                {user?.skillsOffered?.length || 0}
              </h2>
              <p className="text-gray-500">
                Skills Offered
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 text-center">
              <Award className="mx-auto text-green-600" size={34} />
              <h2 className="text-3xl font-bold mt-3">
                {reviews.length}
              </h2>
              <p className="text-gray-500">
                Reviews
              </p>
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
                    No skills added.
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
                    No skills added.
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
                    currentUser={user}
                  />
                ))
              ) : (
                <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500">
                  No reviews yet.
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
