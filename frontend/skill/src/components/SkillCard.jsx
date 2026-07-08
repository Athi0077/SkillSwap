
import { Link } from "react-router-dom";
import {
  BookOpen,
  User,
  Star,
  Clock,
  ArrowRight,
} from "lucide-react";

function SkillCard({
  skill,
  onRequest,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-5 text-white">
        <div className="flex items-center gap-2">
          <BookOpen size={22} />
          <h2 className="text-xl font-bold">
            {skill?.name}
          </h2>
        </div>

        <p className="text-sm text-blue-100 mt-2">
          {skill?.type}
        </p>
      </div>

      {/* Body */}
      <div className="p-5">

        <p className="text-gray-600 mb-4">
          {skill?.description}
        </p>

        <div className="space-y-3">

          <div className="flex items-center gap-2 text-gray-700">
            <User size={18} />
            <span>{skill?.user?.name}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <Star
              size={18}
              className="text-yellow-500 fill-yellow-400"
            />
            <span>
              {skill?.user?.rating?.toFixed(1) || "0.0"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <Clock size={18} />
            <span>
              {skill?.user?.availability || "Flexible"}
            </span>
          </div>

        </div>

        {/* Level */}
        <div className="mt-5">
          <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            {skill?.level}
          </span>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-3">

          <Link
            to={`/user/${skill?.user?._id}`}
            className="flex-1 text-center bg-gray-100 hover:bg-gray-200 py-2 rounded-lg transition"
          >
            View Tutor
          </Link>

          <button
            onClick={() => onRequest(skill)}
            className="flex items-center justify-center gap-2 flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
          >
            Request
            <ArrowRight size={18} />
          </button>

        </div>

      </div>
    </div>
  );
}

export default SkillCard;