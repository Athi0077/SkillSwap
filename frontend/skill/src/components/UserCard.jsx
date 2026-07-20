
import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import { FaLinkedin, FaTwitter, FaInstagram, FaYoutube, FaWhatsapp, FaGithub, FaGlobe } from "react-icons/fa";

function UserCard({
  user,
  onRequest,
  requestStatus,
  isFriendMode,
}) {
  const getSocialIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case "linkedin": return <FaLinkedin size={16} />;
      case "twitter": return <FaTwitter size={16} />;
      case "instagram": return <FaInstagram size={16} />;
      case "youtube": return <FaYoutube size={16} />;
      case "whatsapp": return <FaWhatsapp size={16} />;
      case "github": return <FaGithub size={16} />;
      default: return <FaGlobe size={16} />;
    }
  };

  return (
    <div className="glow-card-wrapper bg-[#120F17] hover:shadow-[0_8px_30px_rgb(168,85,247,0.15)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden group">

      {/* Cover */}
      <div className="h-24 bg-gradient-to-r from-purple-600 to-indigo-600"></div>

      {/* Avatar */}
      <div className="flex justify-center -mt-12">
        <img
          src={
            user?.profileImage ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user?.name || "User"
            )}&background=3B82F6&color=fff`
          }
          alt={user?.name}
          className="w-24 h-24 rounded-full border-4 border-[#120F17] object-cover relative z-10"
        />
      </div>

      {/* User Details */}
      <div className="p-6 text-center relative z-10">

        <h2 className="text-xl font-bold text-white">
          {user?.name}
        </h2>

        {user?.username && (
          <p className="text-sm text-indigo-400 font-medium">
            @{user.username}
          </p>
        )}

        <p className="text-gray-400 mt-1">
          {user?.bio || "No bio added yet."}
        </p>

        {user?.location && (
          <div className="flex justify-center items-center gap-2 mt-3 text-gray-400">
            <MapPin size={16} />
            <span>{user.location}</span>
          </div>
        )}

        <div className="flex justify-center items-center gap-2 mt-3">
          <Star
            className="text-yellow-500 fill-yellow-400"
            size={18}
          />

          <span className="font-semibold text-white">
            {user?.rating?.toFixed(1) || "0.0"}
          </span>
        </div>

        {/* Skills Offered */}
        <div className="mt-5 text-left">
          <h3 className="font-semibold mb-2 text-gray-200">
            Skills Offered
          </h3>

          <div className="flex flex-wrap gap-2">
            {user?.skillsOffered?.map((skill) => (
              <span
                key={skill}
                className="bg-indigo-900/50 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="mt-5 text-left">
          <h3 className="font-semibold mb-2 text-gray-200">
            Skills Wanted
          </h3>

          <div className="flex flex-wrap gap-2">
            {user?.skillsWanted?.map((skill) => (
              <span
                key={skill}
                className="bg-purple-900/50 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Social Links */}
        {user?.socialLinks?.length > 0 && (
          <div className="mt-5 flex justify-center gap-3">
            {user.socialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-all bg-[#1E1A29] hover:bg-purple-600 p-2 rounded-full hover:shadow-[0_0_10px_rgba(168,85,247,0.5)] hover:-translate-y-1"
                title={link.platform}
              >
                {getSocialIcon(link.platform)}
              </a>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 flex gap-3">

          <Link
            to={`/user/${user._id}`}
            className="flex-1 text-center bg-[#1E1A29] hover:bg-[#2F293A] text-white py-2 rounded-lg font-medium transition-all duration-200 active:scale-95 hover:-translate-y-0.5 hover:shadow-md"
          >
            View Profile
          </Link>

          <button
            onClick={() => {
              if (isFriendMode || !requestStatus) onRequest(user);
            }}
            disabled={!isFriendMode && !!requestStatus}
            className={`flex-1 text-white py-2 rounded-lg font-medium transition-all duration-200 ${
              isFriendMode
                ? "bg-indigo-600 hover:bg-indigo-700 active:scale-95 hover:-translate-y-0.5 hover:shadow-md"
                : requestStatus === "accepted"
                ? "bg-green-600 cursor-not-allowed opacity-90"
                : requestStatus === "pending"
                ? "bg-amber-600 cursor-not-allowed opacity-90"
                : "bg-purple-600 hover:bg-purple-700 active:scale-95 hover:-translate-y-0.5 hover:shadow-md"
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
