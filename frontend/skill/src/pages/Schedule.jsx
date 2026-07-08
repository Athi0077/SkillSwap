
import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import SessionCard from "../components/SessionCard";
import { toast } from "react-hot-toast";

import {
  getMySchedules,
  acceptSchedule,
  completeSchedule,
  cancelSchedule,
} from "../services/scheduleService";

function Schedule() {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);

      const res = await getMySchedules();
      setSessions(res.schedules || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await acceptSchedule(id);
      toast.success("Session accepted.");
      fetchSchedules();
    } catch (error) {
      toast.error(error.message || "Failed to accept session");
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeSchedule(id);
      toast.success("Session completed.");
      fetchSchedules();
    } catch (error) {
      toast.error(error.message || "Failed to complete session");
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelSchedule(id);
      toast.success("Session cancelled.");
      fetchSchedules();
    } catch (error) {
      toast.error(error.message || "Failed to cancel session");
    }
  };

  const filteredSessions =
    filter === "all"
      ? sessions
      : sessions.filter(
          (session) => session.status === filter
        );

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading sessions..." />;
  }

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen dark-bento-page">
        <Sidebar />

        <main className="flex-1 p-8">

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 relative z-10">

            <div>
              <h1 className="text-3xl font-bold text-white">
                Learning Sessions
              </h1>

              <p className="text-gray-400 mt-2">
                Manage your scheduled skill exchange sessions.
              </p>
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-[#2F293A] rounded-xl px-4 py-3 bg-[#1E1A29] text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Sessions</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

          </div>

          {filteredSessions.length ? (
            <div className="space-y-6 relative z-10">

              {filteredSessions.map((session) => (
                <SessionCard
                  key={session._id}
                  session={session}
                  onAccept={handleAccept}
                  onComplete={handleComplete}
                  onCancel={handleCancel}
                />
              ))}

            </div>
          ) : (
            <div className="relative z-10">
              <EmptyState 
                title="No Sessions Found" 
                message="Your scheduled learning sessions will appear here." 
                icon={CalendarDays} 
              />
            </div>
          )}

        </main>
      </div>
    </>
  );
}

export default Schedule;
