
import { useState } from "react";
import { X, CalendarDays, Clock, BookOpen } from "lucide-react";

function ScheduleModal({ chatUser, onConfirm, onClose }) {
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !time) return;

    setLoading(true);
    try {
      const scheduledAt = new Date(`${date}T${time}`).toISOString();
      await onConfirm({ scheduledAt, duration: Number(duration), topic });
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">

      {/* Modal */}
      <div className="bg-[#120F17]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] w-full max-w-md mx-4 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600/80 to-indigo-600/80 p-5 text-white border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Schedule a Session</h2>
              <p className="text-indigo-100 text-sm mt-0.5">
                with {chatUser?.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition backdrop-blur-sm"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Topic */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
              <BookOpen size={15} className="text-purple-400" />
              Topic / Skill
            </label>
            <input
              type="text"
              placeholder="e.g. React basics, UI/UX review..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-[#0B090F]/50 border border-[#2F293A] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500 backdrop-blur-sm transition-all"
            />
          </div>

          {/* Date */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
              <CalendarDays size={15} className="text-purple-400" />
              Date
            </label>
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full bg-[#0B090F]/50 border border-[#2F293A] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-white backdrop-blur-sm transition-all"
            />
          </div>

          {/* Time */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
              <Clock size={15} className="text-purple-400" />
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full bg-[#0B090F]/50 border border-[#2F293A] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-white backdrop-blur-sm transition-all"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="text-sm font-semibold text-gray-300 mb-2 block">
              Duration
            </label>
            <div className="flex gap-3">
              {[30, 60, 90].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all backdrop-blur-sm
                    ${duration === d
                      ? "border-purple-500 bg-purple-600/80 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                      : "border-[#2F293A] bg-[#0B090F]/50 text-gray-400 hover:border-purple-500/50 hover:text-purple-300"
                    }`}
                >
                  {d} min
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#2F293A] bg-[#1E1A29]/50 text-gray-300 hover:bg-[#2F293A] text-sm font-medium transition backdrop-blur-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !date || !time}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all backdrop-blur-sm
                ${!loading && date && time
                  ? "bg-purple-600/90 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                  : "bg-[#1E1A29]/50 text-gray-500 cursor-not-allowed border border-[#2F293A]"
                }`}
            >
              {loading ? "Scheduling…" : "Confirm Session"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default ScheduleModal;
