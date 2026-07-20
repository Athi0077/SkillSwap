
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace("/api", "") : "https://skillswap-cuf7.onrender.com";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import ChatBox from "../components/ChatBox";

import {
  getChats,
  getMessages,
  sendMessage,
} from "../services/chatService";

import { getUserById } from "../services/userService";
import { useAuth } from "../context/AuthContext";

function Chat() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get("userId");

  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const socketRef = useRef(null);
  const selectedChatRef = useRef(null);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);
    if (user?._id) {
      socketRef.current.emit("join", user._id);
    }

    socketRef.current.on("receiveMessage", (newMessage) => {
      const currentChat = selectedChatRef.current;
      if (currentChat) {
        const otherUser = currentChat.participants.find(p => p._id !== user._id);
        
        const senderId = String(newMessage.sender?._id || newMessage.sender);
        const receiverId = String(newMessage.receiver?._id || newMessage.receiver);
        const currentUserId = String(user._id);
        const otherUserId = String(otherUser._id);

        const isRelated = 
          (senderId === currentUserId && receiverId === otherUserId) ||
          (senderId === otherUserId && receiverId === currentUserId);
          
        if (isRelated) {
          setMessages((prev) => {
            if (prev.find((m) => String(m._id) === String(newMessage._id))) return prev;
            return [...prev, newMessage];
          });

          if (receiverId === currentUserId) {
            socketRef.current.emit("markMessagesAsRead", { senderId: otherUser._id, receiverId: user._id });
          }
        }
      }
      loadChats(false);
    });

    socketRef.current.on("messagesRead", ({ receiverId }) => {
      setMessages((prev) => 
        prev.map(msg => 
          (msg.receiver === receiverId && !msg.read) 
            ? { ...msg, read: true } 
            : msg
        )
      );
    });

    socketRef.current.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socketRef.current.on("messageError", (errorMsg) => {
      import("react-hot-toast").then(({ toast }) => {
        toast.error(errorMsg);
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);

      const res = await getChats();
      let chats = res.chats || [];

      if (targetUserId) {
        let targetChat = chats.find(c => c._id === targetUserId);
        if (!targetChat) {
          try {
            const userRes = await getUserById(targetUserId);
            if (userRes && userRes.user) {
              targetChat = {
                _id: targetUserId,
                participants: [user, userRes.user],
                lastMessage: ""
              };
              chats = [targetChat, ...chats];
            }
          } catch (err) {
            console.error("Error fetching user:", err);
          }
        }
        setConversations(chats);
        if (targetChat) selectChat(targetChat);
      } else {
        setConversations(chats);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const selectChat = async (chat) => {
    try {
      setSelectedChat(chat);

      const res = await getMessages(chat._id);
      setMessages(res.messages || []);

      const otherUser = chat.participants.find(p => p._id !== user._id);
      if (socketRef.current && otherUser) {
        socketRef.current.emit("markMessagesAsRead", { senderId: otherUser._id, receiverId: user._id });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = async (text) => {
    if (!selectedChat) return;

    const otherUser = selectedChat.participants.find(p => p._id !== user._id);

    if (socketRef.current) {
      socketRef.current.emit("sendMessage", {
        sender: user._id,
        receiver: otherUser._id,
        message: text,
      });
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <>
      <Navbar />

      <div className="flex h-[calc(100dvh-64px)] dark-bento-page">
        <Sidebar />

        <main className="flex-1 p-2 sm:p-4 md:p-6 h-full flex flex-col overflow-hidden">

          <div className="glow-card-wrapper bg-[#120F17] rounded-2xl md:rounded-3xl overflow-hidden flex-1 border border-[#2F293A]">

            <div className="grid lg:grid-cols-3 h-full relative z-10">

              {/* Conversation List */}
              <div className={`border-r border-[#2F293A] overflow-y-auto ${selectedChat ? "hidden lg:block" : "block"}`}>

                <div className="p-5 border-b border-[#2F293A]">
                  <h2 className="text-2xl font-bold text-white">
                    Conversations
                  </h2>
                </div>

                {conversations.length ? (
                  conversations.map((chat) => {
                    const otherUser =
                      chat.participants?.find(
                        (p) => p._id !== user._id
                      );
                    
                    const isOnline = onlineUsers.includes(otherUser?._id);

                    return (
                      <button
                        key={chat._id}
                        onClick={() => selectChat(chat)}
                        className={`w-full text-left p-4 border-b border-[#2F293A] hover:bg-[#1E1A29] transition ${
                          selectedChat?._id === chat._id
                            ? "bg-[#1E1A29] border-l-4 border-l-purple-500"
                            : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-white">
                            {otherUser?.name}
                          </div>
                          {isOnline && (
                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-gray-400 truncate">
                            {chat.lastMessage || "No messages yet"}
                          </p>
                          {chat.unreadCount > 0 && selectedChat?._id !== chat._id && (
                            <div className="w-5 h-5 flex items-center justify-center bg-purple-600 text-white text-[10px] font-bold rounded-full ml-2 shrink-0 shadow-[0_0_10px_rgba(147,51,234,0.4)]">
                              {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 text-center">
                    <div className="w-16 h-16 bg-[#1E1A29] rounded-full flex items-center justify-center mb-4 shadow-inner border border-[#2F293A]">
                      <MessageCircle size={24} className="text-gray-500 opacity-60" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-300 mb-2">No conversations</h3>
                    <p className="text-xs text-gray-500">
                      When you connect with someone, your chats will appear here.
                    </p>
                  </div>
                )}

              </div>

              {/* Chat Window */}
              <div className={`lg:col-span-2 h-full min-h-0 ${selectedChat ? "block" : "hidden lg:block"}`}>

                {selectedChat ? (
                  <ChatBox
                    messages={messages}
                    currentUser={user}
                    chatUser={selectedChat.participants.find(
                      (p) => p._id !== user._id
                    )}
                    isOnline={onlineUsers.includes(
                      selectedChat.participants.find((p) => p._id !== user._id)?._id
                    )}
                    onSendMessage={handleSendMessage}
                    onBack={() => setSelectedChat(null)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8 relative overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/5 blur-[100px] rounded-full pointer-events-none"></div>
                    
                    <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                       <div className="absolute inset-0 bg-purple-500/10 blur-xl rounded-full animate-pulse"></div>
                       <MessageCircle size={40} className="text-purple-400/70 relative z-10" />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-200 to-gray-500 text-transparent bg-clip-text mb-3">Your Messages</h2>
                    <p className="text-gray-500 max-w-sm text-sm">Select a conversation from the sidebar to start chatting, or schedule a session with a tutor.</p>
                  </div>
                )}

              </div>

            </div>

          </div>

        </main>
      </div>
    </>
  );
}

export default Chat;
