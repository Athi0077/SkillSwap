
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

      {/* Modal */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Schedule a Session</h2>
              <p className="text-indigo-100 text-sm mt-0.5">
                with {chatUser?.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Topic */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-2">
              <BookOpen size={15} className="text-indigo-500" />
              Topic / Skill
            </label>
            <input
              type="text"
              placeholder="e.g. React basics, UI/UX review..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Date */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-2">
              <CalendarDays size={15} className="text-indigo-500" />
              Date
            </label>
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Time */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-2">
              <Clock size={15} className="text-indigo-500" />
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="text-sm font-semibold text-slate-600 mb-2 block">
              Duration
            </label>
            <div className="flex gap-3">
              {[30, 60, 90].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-all
                    ${duration === d
                      ? "border-indigo-500 bg-indigo-600 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300"
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
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !date || !time}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all
                ${!loading && date && time
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
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
