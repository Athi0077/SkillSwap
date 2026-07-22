import { NavLink } from "react-router-dom";
import { Home, Search, MessageCircle, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function MobileDock() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  const dockLinkClass = ({ isActive }) =>
    `flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
      isActive
        ? "text-white bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)] -translate-y-2 scale-110"
        : "text-gray-400 hover:text-white hover:bg-[#2F293A]"
    }`;

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 bg-[#1A1625]/80 backdrop-blur-xl border border-[#2F293A] p-2 rounded-3xl shadow-2xl">
        
        <NavLink to="/dashboard" className={dockLinkClass}>
          <Home size={22} />
        </NavLink>
        
        <NavLink to="/find-skills" className={dockLinkClass}>
          <Search size={22} />
        </NavLink>

        <NavLink to="/chat" className={dockLinkClass}>
          <MessageCircle size={22} />
        </NavLink>

        <NavLink to="/profile" className={dockLinkClass}>
          {user?.profileImage ? (
            <img 
              src={user.profileImage} 
              alt="Profile" 
              className="w-7 h-7 rounded-full object-cover border border-gray-600"
            />
          ) : (
            <User size={22} />
          )}
        </NavLink>

      </div>
    </div>
  );
}
