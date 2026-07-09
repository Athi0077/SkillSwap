import { useEffect, useRef, useState } from "react";
import { Send, User } from "lucide-react";
import { io } from "socket.io-client";
import { getHubMessages } from "../services/hubService";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "react-hot-toast";

function HubChat({ hubId, isMember }) {
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isMember) {
      setLoading(false);
      return;
    }

    const loadMessages = async () => {
      try {
        const res = await getHubMessages(hubId);
        setMessages(res.messages || []);
      } catch (error) {
        console.error("Failed to load hub messages", error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    // Initialize Socket
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    // Usually socket connects to the root URL (without /api)
    const socketUrl = API_URL.replace("/api", "");
    
    socketRef.current = io(socketUrl);

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-hub-room", hubId);
    });

    socketRef.current.on("receive-hub-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketRef.current.on("messageError", (errorMsg) => {
      toast.error(errorMsg);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leave-hub-room", hubId);
        socketRef.current.disconnect();
      }
    };
  }, [hubId, isMember]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !isMember) return;

    socketRef.current.emit("send-hub-message", {
      hubId,
      sender: currentUser._id,
      message: newMessage.trim(),
    });

    setNewMessage("");
  };

  if (!isMember) {
    return (
      <div className="bg-[#120F17] border border-[#2F293A] rounded-2xl p-8 text-center text-gray-400">
        You must join the Hub to view and participate in the chat.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-[#120F17] border border-[#2F293A] rounded-2xl p-8 min-h-[400px] flex items-center justify-center">
        <LoadingSpinner message="Loading chat..." />
      </div>
    );
  }

  return (
    <div className="bg-[#120F17] border border-[#2F293A] rounded-2xl flex flex-col h-[600px] overflow-hidden relative z-10">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            Welcome to the Hub Chat! Be the first to say hello 👋
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.sender?._id === currentUser?._id;

          return (
            <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                
                {!isMe && (
                  <div className="flex items-center gap-2 mb-1 pl-1">
                    <img 
                      src={msg.sender?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.sender?.name || "User")}&background=3B82F6&color=fff`} 
                      alt={msg.sender?.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-xs text-gray-400 font-medium">{msg.sender?.name}</span>
                  </div>
                )}

                <div
                  className={`px-4 py-3 rounded-2xl ${
                    isMe
                      ? "bg-purple-600 text-white rounded-br-sm shadow-md"
                      : "bg-[#1E1A29] text-gray-200 shadow rounded-bl-sm border border-[#2F293A]"
                  }`}
                >
                  <p className="break-words break-all text-sm md:text-base">{msg.message}</p>
                </div>
                
                <span className={`text-[10px] mt-1 text-gray-500 ${isMe ? "pr-1" : "pl-1"}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="shrink-0 bg-[#0B090F] border-t border-[#2F293A] p-4 flex gap-3">
        <input
          type="text"
          placeholder="Message the hub..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 bg-[#1A1625] border border-[#2F293A] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
          maxLength={500}
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-5 rounded-xl transition flex items-center justify-center"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}

export default HubChat;
