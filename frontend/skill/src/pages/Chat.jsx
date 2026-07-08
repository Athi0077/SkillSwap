
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
        
        const isRelated = 
          (newMessage.sender === user._id && newMessage.receiver === otherUser._id) ||
          (newMessage.sender === otherUser._id && newMessage.receiver === user._id);
          
        if (isRelated) {
          setMessages((prev) => {
            if (prev.find((m) => m._id === newMessage._id)) return prev;
            return [...prev, newMessage];
          });
        }
      }
      loadChats(false);
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
        else if (chats.length) selectChat(chats[0]);
      } else {
        setConversations(chats);
        if (chats.length) {
          selectChat(chats[0]);
        }
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

      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />

        <main className="flex-1 p-6">

          <div className="bg-white rounded-3xl shadow overflow-hidden h-[85vh]">

            <div className="grid lg:grid-cols-3 h-full">

              {/* Conversation List */}
              <div className={`border-r overflow-y-auto ${selectedChat ? "hidden lg:block" : "block"}`}>

                <div className="p-5 border-b">
                  <h2 className="text-2xl font-bold">
                    Conversations
                  </h2>
                </div>

                {conversations.length ? (
                  conversations.map((chat) => {
                    const otherUser =
                      chat.participants?.find(
                        (p) => p._id !== user._id
                      );

                    return (
                      <button
                        key={chat._id}
                        onClick={() => selectChat(chat)}
                        className={`w-full text-left p-4 border-b hover:bg-slate-50 transition ${
                          selectedChat?._id === chat._id
                            ? "bg-blue-50"
                            : ""
                        }`}
                      >
                        <div className="font-semibold">
                          {otherUser?.name}
                        </div>

                        <p className="text-sm text-gray-500 truncate">
                          {chat.lastMessage || "No messages yet"}
                        </p>
                      </button>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <MessageCircle size={50} />
                    <p className="mt-4">
                      No conversations yet.
                    </p>
                  </div>
                )}

              </div>

              {/* Chat Window */}
              <div className={`lg:col-span-2 ${selectedChat ? "block" : "hidden lg:block"}`}>

                {selectedChat ? (
                  <ChatBox
                    messages={messages}
                    currentUser={user}
                    chatUser={selectedChat.participants.find(
                      (p) => p._id !== user._id
                    )}
                    onSendMessage={handleSendMessage}
                    onBack={() => setSelectedChat(null)}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Select a conversation
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
