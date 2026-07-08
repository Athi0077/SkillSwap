
import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";

function UserCard({
  user,
  onRequest,
  requestStatus,
  isFriendMode,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">

      {/* Cover */}
      <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

      {/* Avatar */}
      <div className="flex justify-center -mt-12">
        <img
          src={
            user?.profileImage ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user?.name || "User"
            )}&background=2563eb&color=fff`
          }
          alt={user?.name}
          className="w-24 h-24 rounded-full border-4 border-white object-cover"
        />
      </div>

      {/* User Details */}
      <div className="p-6 text-center">

        <h2 className="text-xl font-bold">
          {user?.name}
        </h2>

        {user?.username && (
          <p className="text-sm text-indigo-600 font-medium">
            @{user.username}
          </p>
        )}

        <p className="text-gray-500 mt-1">
          {user?.bio || "No bio added yet."}
        </p>

        {user?.location && (
          <div className="flex justify-center items-center gap-2 mt-3 text-gray-600">
            <MapPin size={16} />
            <span>{user.location}</span>
          </div>
        )}

        <div className="flex justify-center items-center gap-2 mt-3">
          <Star
            className="text-yellow-500 fill-yellow-400"
            size={18}
          />

          <span className="font-semibold">
            {user?.rating?.toFixed(1) || "0.0"}
          </span>
        </div>

        {/* Skills Offered */}
        <div className="mt-5 text-left">
          <h3 className="font-semibold mb-2">
            Skills Offered
          </h3>

          <div className="flex flex-wrap gap-2">
            {user?.skillsOffered?.map((skill) => (
              <span
                key={skill}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="mt-5 text-left">
          <h3 className="font-semibold mb-2">
            Skills Wanted
          </h3>

          <div className="flex flex-wrap gap-2">
            {user?.skillsWanted?.map((skill) => (
              <span
                key={skill}
                className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-3">

          <Link
            to={`/user/${user._id}`}
            className="flex-1 text-center bg-gray-100 hover:bg-gray-200 py-2 rounded-lg font-medium transition"
          >
            View Profile
          </Link>

          <button
            onClick={() => {
              if (isFriendMode || !requestStatus) onRequest(user);
            }}
            disabled={!isFriendMode && !!requestStatus}
            className={`flex-1 text-white py-2 rounded-lg font-medium transition ${
              isFriendMode
                ? "bg-indigo-600 hover:bg-indigo-700"
                : requestStatus === "accepted"
                ? "bg-green-500 cursor-not-allowed opacity-90"
                : requestStatus === "pending"
                ? "bg-amber-500 cursor-not-allowed opacity-90"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isFriendMode
              ? "Message"
              : requestStatus === "accepted"
              ? "Friends"
              : requestStatus === "pending"
              ? "Pending"
              : "Swap Request"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default UserCard;
