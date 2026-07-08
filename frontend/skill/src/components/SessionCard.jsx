
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Video,
  CheckCircle,
  XCircle,
  BookOpen,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function SessionCard({ session, onAccept, onComplete, onCancel }) {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const statusStyles = {
    pending:   "bg-yellow-100 text-yellow-700",
    accepted:  "bg-blue-100   text-blue-700",
    completed: "bg-green-100  text-green-700",
    cancelled: "bg-red-100    text-red-700",
  };

  const scheduledDate = session.scheduledAt
    ? new Date(session.scheduledAt)
    : null;

  // Is the current user the guest (receiver) of this session?
  const isGuest =
    session.guest?._id === currentUser?._id ||
    session.guest === currentUser?._id;

  return (
    <div className="glow-card-wrapper bg-[#120F17] hover:shadow-lg transition p-6 relative">

      {/* Header */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          {session.topic ? (
            <div className="flex items-center gap-2 mb-1">
              <BookOpen size={16} className="text-indigo-400" />
              <h2 className="text-lg font-bold text-white">
                {session.topic}
              </h2>
            </div>
          ) : (
            <h2 className="text-lg font-bold text-white">
              Skill Exchange Session
            </h2>
          )}
          <p className="text-sm text-gray-400">Learning session</p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
            statusStyles[session.status] || "bg-gray-800 text-gray-300"
          }`}
        >
          {session.status}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-3 relative z-10">

        <div className="flex items-center gap-3 text-gray-300">
          <User size={16} className="text-indigo-400 flex-shrink-0" />
          <span className="text-sm">
            <span className="font-medium text-gray-100">Host:</span>{" "}
            {session.host?.name || "Unknown"}
          </span>
        </div>

        <div className="flex items-center gap-3 text-gray-300">
          <User size={16} className="text-violet-400 flex-shrink-0" />
          <span className="text-sm">
            <span className="font-medium text-gray-100">Guest:</span>{" "}
            {session.guest?.name || "Unknown"}
          </span>
        </div>

        {scheduledDate && (
          <>
            <div className="flex items-center gap-3 text-gray-300">
              <Calendar size={16} className="text-purple-400 flex-shrink-0" />
              <span className="text-sm">
                {scheduledDate.toLocaleDateString([], {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center gap-3 text-gray-300">
              <Clock size={16} className="text-orange-400 flex-shrink-0" />
              <span className="text-sm">
                {scheduledDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {session.duration ? ` · ${session.duration} min` : ""}
              </span>
            </div>
          </>
        )}

      </div>

      {/* Action Buttons */}
      <div className="mt-6 space-y-3 relative z-10">

        {/* Pending — guest sees Accept + both see Cancel */}
        {session.status === "pending" && (
          <div className="flex gap-3">
            {isGuest && onAccept && (
              <button
                onClick={() => onAccept(session._id)}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-semibold transition"
              >
                <CheckCircle size={16} />
                Accept
              </button>
            )}
            {onCancel && (
              <button
                onClick={() => onCancel(session._id)}
                className="flex-1 flex items-center justify-center gap-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 py-2.5 rounded-xl text-sm font-semibold transition"
              >
                <XCircle size={16} />
                Decline
              </button>
            )}
          </div>
        )}

        {/* Accepted — Join Session button for both */}
        {session.status === "accepted" && (
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/video-call/${session._id}`)}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-semibold transition shadow-md"
            >
              <Video size={16} />
              Join Session
            </button>
            {onComplete && (
              <button
                onClick={() => onComplete(session._id)}
                className="flex items-center justify-center gap-2 border border-[#2F293A] text-gray-400 hover:bg-[#1E1A29] hover:text-white px-4 py-2.5 rounded-xl text-sm transition"
              >
                <CheckCircle size={16} />
                Done
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default SessionCard;
