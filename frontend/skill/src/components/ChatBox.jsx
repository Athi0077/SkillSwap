import { useEffect, useRef, useState } from "react";
import { Send, User, CalendarDays, CheckCircle, ArrowLeft, Check, CheckCheck } from "lucide-react";
import { toast } from "react-hot-toast";

import ScheduleModal from "./ScheduleModal";
import { createSchedule } from "../services/scheduleService";

function ChatBox({
  messages = [],
  onSendMessage,
  currentUser,
  chatUser,
  isOnline = false,
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

  const formatDateLabel = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

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

      // Show success toast inside chat locally
      const dateLabel = new Date(scheduledAt).toLocaleString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      setScheduleSuccess(`Session scheduled for ${dateLabel} (${duration} min)`);
      setTimeout(() => setScheduleSuccess(null), 5000);

      // Send a permanent message to the chat so the other person sees it
      onSendMessage(`📅 I scheduled a session for ${dateLabel} (${duration} min). Check the Schedule page!`);
    } catch (error) {
      toast.error(error.message || "Failed to create schedule");
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
            <p className={`text-sm ${isOnline ? "text-green-400" : "text-gray-400"}`}>
              {isOnline ? "Online" : "Offline"}
            </p>
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
          <div className="flex flex-col items-center justify-center h-full text-center p-8 mt-10">
            <div className="w-16 h-16 bg-[#1E1A29]/80 rounded-full flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(168,85,247,0.15)] border border-[#2F293A]">
              <span className="text-3xl">👋</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-1">Start the conversation</h3>
            <p className="text-sm text-gray-500 max-w-xs">
              Say hi to {chatUser?.name || "your new friend"} and see where the skills take you!
            </p>
          </div>
        )}

        {messages.map((msg, index) => {
          const isMe =
            msg.sender === currentUser?._id ||
            msg.sender?._id === currentUser?._id;

          const currentMsgDate = new Date(msg.createdAt).toDateString();
          const prevMsgDate = index > 0 ? new Date(messages[index - 1].createdAt).toDateString() : null;
          const showDateDivider = currentMsgDate !== prevMsgDate;

          return (
            <div key={msg._id} className="flex flex-col">
              {showDateDivider && (
                <div className="flex justify-center my-4">
                  <div className="bg-[#1E1A29]/80 backdrop-blur-md border border-[#2F293A] text-gray-300 text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm">
                    {formatDateLabel(msg.createdAt)}
                  </div>
                </div>
              )}
              
              <div
                className={`flex ${isMe ? "justify-end" : "justify-start"} mb-1`}
              >
                <div
                  className={`max-w-[75%] px-4 py-3 shadow-md ${
                    isMe
                      ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl rounded-tr-sm"
                      : "bg-[#1E1A29]/80 backdrop-blur-md text-gray-200 rounded-2xl rounded-tl-sm border border-[#2F293A]"
                  }`}
                >
                  <p className="break-words break-all">{msg.message}</p>
                  <div className={`flex items-center gap-1 mt-1.5 ${isMe ? "justify-end text-purple-200" : "text-gray-400"}`}>
                    <p className="text-[10px]">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {isMe && (
                      msg.read ? (
                        <CheckCheck size={14} className="text-blue-300" />
                      ) : (
                        <Check size={14} className="text-purple-300/70" />
                      )
                    )}
                  </div>
                </div>
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
      <form onSubmit={handleSubmit} className="sticky bottom-0 z-20 shrink-0 bg-[#120F17]/90 backdrop-blur-xl border-t border-[#2F293A] p-4 flex gap-3">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border border-[#2F293A] bg-[#0B090F]/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 transition-all shadow-inner"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 rounded-xl transition-all duration-200 active:scale-95 hover:shadow-[0_4px_15px_rgba(168,85,247,0.4)]"
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
