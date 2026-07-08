
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  MapPin,
  Clock,
  BookOpen,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const levelColors = {
  Beginner: "bg-emerald-100 text-emerald-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-rose-100 text-rose-700",
};

const typeColors = {
  teach: "bg-indigo-100 text-indigo-700",
  learn: "bg-purple-100 text-purple-700",
};

function UserSkillCard({ user, skills, onRequest }) {
  const [expanded, setExpanded] = useState(false);

  const visibleSkills = expanded ? skills : skills.slice(0, 3);
  const hasMore = skills.length > 3;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">

      {/* User Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 p-5">
        <div className="flex items-center gap-4">

          {/* Avatar */}
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-white/40"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white font-bold text-lg">
              {initials}
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-white truncate">
              {user?.name || "Unknown User"}
            </h2>

            <div className="flex flex-wrap gap-3 mt-1">
              {user?.location && (
                <span className="flex items-center gap-1 text-blue-100 text-xs">
                  <MapPin size={12} />
                  {user.location}
                </span>
              )}
              <span className="flex items-center gap-1 text-blue-100 text-xs">
                <Clock size={12} />
                {user?.availability || "Flexible"}
              </span>
            </div>
          </div>

          {/* Skill count badge */}
          <div className="flex-shrink-0 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-1 text-center">
            <div className="text-white font-bold text-lg leading-none">
              {skills.length}
            </div>
            <div className="text-blue-100 text-xs">
              {skills.length === 1 ? "skill" : "skills"}
            </div>
          </div>

        </div>
      </div>

      {/* Skills List */}
      <div className="p-4 space-y-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Skills Offered
        </p>

        {visibleSkills.map((skill) => (
          <div
            key={skill._id}
            className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 transition-colors group"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <BookOpen size={15} className="text-indigo-400 flex-shrink-0" />
              <span className="font-medium text-slate-700 text-sm truncate">
                {skill.name}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  levelColors[skill.level] || "bg-slate-100 text-slate-600"
                }`}
              >
                {skill.level}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  typeColors[skill.type] || "bg-slate-100 text-slate-600"
                }`}
              >
                {skill.type}
              </span>

              <button
                onClick={() => onRequest(skill)}
                className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0"
              >
                Request
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}

        {/* Show more / less toggle */}
        {hasMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium pt-1 transition-colors"
          >
            {expanded ? (
              <>Show less <ChevronUp size={15} /></>
            ) : (
              <>+{skills.length - 3} more skills <ChevronDown size={15} /></>
            )}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4">
        <Link
          to={`/user/${user?._id}`}
          className="flex items-center justify-center gap-2 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-xl transition-colors text-sm"
        >
          <User size={15} />
          View Profile
        </Link>
      </div>

    </div>
  );
}

export default UserSkillCard;
