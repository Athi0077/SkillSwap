import { useEffect, useRef, useState } from "react";
import { Send, User, CalendarDays, CheckCircle, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

import ScheduleModal from "./ScheduleModal";
import { createSchedule } from "../services/scheduleService";

function ChatBox({
  messages = [],
  onSendMessage,
  currentUser,
  chatUser,
  onBack,
}) {
  const [message, setMessage] = useState("");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendMessage(message.trim());
    setMessage("");
  };

  const handleScheduleConfirm = async ({ scheduledAt, duration, topic }) => {
    try {
      await createSchedule({
        guest: chatUser._id,
        scheduledAt,
        duration,
        topic,
      });

      setShowScheduleModal(false);

      // Show success toast inside chat
      const dateLabel = new Date(scheduledAt).toLocaleString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      setScheduleSuccess(`Session scheduled for ${dateLabel} (${duration} min)`);
      setTimeout(() => setScheduleSuccess(null), 5000);
    } catch (error) {
      toast.error(error.message || "Failed to create schedule");
    } finally {
      setIsCreatingSchedule(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent relative z-10 min-h-0">

      {/* Header */}
      <div className="sticky top-0 z-20 shrink-0 bg-[#120F17] flex items-center justify-between gap-4 p-4 border-b border-[#2F293A]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-[#1E1A29] text-gray-400 transition"
          >
            <ArrowLeft size={22} />
          </button>

          <div className="w-12 h-12 rounded-full bg-indigo-900/50 flex items-center justify-center overflow-hidden border border-indigo-500/30">
            {chatUser?.profileImage ? (
              <img
                src={chatUser.profileImage}
                alt={chatUser.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="text-indigo-400" />
            )}
          </div>

          <div>
            <h2 className="font-semibold text-lg text-white">{chatUser?.name}</h2>
            <p className="text-sm text-green-400">Online</p>
          </div>
        </div>

        {/* Schedule button */}
        <button
          onClick={() => setShowScheduleModal(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md"
        >
          <CalendarDays size={16} />
          Schedule
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-transparent">

        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            Start your conversation 👋
          </div>
        )}

        {messages.map((msg) => {
          const isMe =
            msg.sender === currentUser?._id ||
            msg.sender?._id === currentUser?._id;

          return (
            <div
              key={msg._id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                  isMe
                    ? "bg-purple-600 text-white rounded-br-md shadow-md"
                    : "bg-[#1E1A29] text-gray-200 shadow rounded-bl-md border border-[#2F293A]"
                }`}
              >
                <p className="break-words break-all">{msg.message}</p>
                <p
                  className={`text-xs mt-2 ${
                    isMe ? "text-purple-200" : "text-gray-400"
                  }`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}

        {/* Schedule success toast inside chat */}
        {scheduleSuccess && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2 bg-green-900/30 border border-green-700/50 text-green-400 px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm">
              <CheckCircle size={16} className="text-green-400" />
              {scheduleSuccess} — check Schedule page
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="sticky bottom-0 z-20 shrink-0 bg-[#120F17] border-t border-[#2F293A] p-4 flex gap-3">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border border-[#2F293A] bg-[#0B090F] text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 rounded-xl transition"
        >
          <Send size={20} />
        </button>
      </form>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <ScheduleModal
          chatUser={chatUser}
          onConfirm={handleScheduleConfirm}
          onClose={() => setShowScheduleModal(false)}
        />
      )}

    </div>
  );
}

export default ChatBox;
