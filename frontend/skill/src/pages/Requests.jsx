
import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  MessageCircle,
  Trash2,
  StopCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import { toast } from "react-hot-toast";

import {
  getMyRequests,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  deleteRequest,
  completeRequest,
} from "../services/requestService";
import { fireConfetti } from "../utils/confetti";

function Requests() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const res = await getMyRequests();
      setRequests(res.requests || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const confirmAction = (message, action) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-slate-800">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              action();
            }}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const handleAccept = async (id) => {
    try {
      await acceptRequest(id);
      fireConfetti();
      toast.success("Request accepted!");
      fetchRequests();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectRequest(id);
      toast.success("Request rejected.");
      fetchRequests();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelRequest(id);
      toast.success("Request canceled.");
      fetchRequests();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = (id) => {
    confirmAction("Are you sure you want to delete this request?", async () => {
      try {
        await deleteRequest(id);
        toast.success("Request deleted.");
        fetchRequests();
      } catch (error) {
        toast.error(error.message);
      }
    });
  };

  const handleEndSession = (id) => {
    confirmAction("Are you sure you want to end this session? You will not be able to chat anymore.", async () => {
      try {
        await completeRequest(id);
        toast.success("Session ended.");
        fetchRequests();
      } catch (error) {
        toast.error(error.message);
      }
    });
  };

  const filteredRequests = requests.filter((req) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "cancelled") return req.status === "cancelled" || req.status === "rejected";
    return req.status === filterStatus;
  });

  if (loading) return <LoadingSpinner fullScreen message="Loading requests..." />;

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen dark-bento-page">
        {/* <Sidebar /> */}

        <main className="flex-1 p-8">

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4 relative z-10">
            <h1 className="text-3xl font-bold text-white">
              Skill Swap Requests
            </h1>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-[#1E1A29] border border-[#2F293A] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium text-gray-200 max-w-xs cursor-pointer"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="cancelled">Cancelled & Rejected</option>
            </select>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="relative z-10">
              <EmptyState 
                title="No Requests Found" 
                message={requests.length === 0 ? "Your incoming and outgoing requests will appear here." : "No requests match this filter."} 
                icon={Clock} 
              />
            </div>
          ) : (
            <div className="space-y-6 relative z-10">

              {filteredRequests.map((request) => (
                <div
                  key={request._id}
                  className="glow-card-wrapper bg-[#120F17] p-6 relative"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 relative z-10">

                    <div>

                      <h2 className="text-xl font-bold text-white">
                        {request.skill?.title}
                      </h2>

                      <p className="text-gray-400 mt-2">
                        <span className="text-gray-500">From:</span>
                        {" "}
                        {request.sender?.name}
                      </p>

                      <p className="text-gray-400">
                        <span className="text-gray-500">To:</span>
                        {" "}
                        {request.receiver?.name}
                      </p>

                      <span
                        className={`inline-block mt-4 px-4 py-1 rounded-full text-sm font-medium
                          ${
                            request.status === "pending"
                              ? "bg-yellow-900/30 text-yellow-500 border border-yellow-700/50"
                              : request.status === "accepted"
                              ? "bg-green-900/30 text-green-400 border border-green-700/50"
                              : request.status === "rejected" || request.status === "cancelled"
                              ? "bg-red-900/30 text-red-400 border border-red-700/50"
                              : "bg-gray-800 text-gray-400 border border-gray-700"
                          }`}
                      >
                        {request.status}
                      </span>

                    </div>

                    {request.status === "pending" && (
                      <div className="flex flex-wrap gap-2">
                        {request.receiver?._id === user?._id && (
                          <>
                            <button
                              onClick={() => handleAccept(request._id)}
                              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm shadow-sm transition-all active:scale-95"
                            >
                              <CheckCircle size={16} />
                              Accept
                            </button>

                            <button
                              onClick={() => handleReject(request._id)}
                              className="flex items-center gap-1.5 bg-red-600/20 text-red-400 hover:bg-red-600/40 border border-red-500/30 px-4 py-2 rounded-lg text-sm shadow-sm transition-all active:scale-95"
                            >
                              <XCircle size={16} />
                              Reject
                            </button>
                          </>
                        )}

                        {request.sender?._id === user?._id && (
                          <button
                            onClick={() => handleCancel(request._id)}
                            className="bg-[#2F293A] hover:bg-[#3F374A] text-gray-300 px-4 py-2 rounded-lg text-sm shadow-sm transition-all active:scale-95"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    )}

                    {request.status === "accepted" && (
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => navigate(`/chat?userId=${request.sender?._id === user?._id ? request.receiver?._id : request.sender?._id}`)}
                          className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm shadow-sm transition-all active:scale-95"
                        >
                          <MessageCircle size={16} />
                          Start Chat
                        </button>
                        <button
                          onClick={() => handleEndSession(request._id)}
                          className="flex items-center gap-1.5 bg-[#2F293A] hover:bg-[#3F374A] text-orange-400 border border-orange-500/30 px-4 py-2 rounded-lg text-sm shadow-sm transition-all active:scale-95"
                        >
                          <StopCircle size={16} />
                          End Session
                        </button>
                      </div>
                    )}

                    {(request.status === "rejected" || request.status === "cancelled" || request.status === "completed") && (
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleDelete(request._id)}
                          className="flex items-center gap-1.5 bg-red-900/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm shadow-sm transition-all active:scale-95"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    )}

                  </div>

                </div>
              ))}

            </div>
          )}

        </main>
      </div>
    </>
  );
}

export default Requests;
