
import {
  LayoutDashboard,
  User,
  Search,
  ClipboardList,
  MessageCircle,
  CalendarDays,
  Star,
  LogOut,
  Handshake,
  Users,
  Coins,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-sm font-medium ${isActive
      ? "bg-purple-600 text-white shadow-md"
      : "text-gray-400 hover:bg-[#2F293A] hover:text-white"
    }`;

  return (
    <aside className="hidden md:block w-60 h-[calc(100vh-64px)] sticky top-16 self-start overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] glow-card-wrapper bg-[#120F17] !rounded-none no-top-glow no-left-glow no-bottom-glow border-r border-[#2F293A] shadow-sm">
      <nav className="flex flex-col p-4 space-y-1 relative z-10 h-full">

        <NavLink to="/dashboard" className={linkClass}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/profile" className={linkClass}>
          <User size={20} />
          <span>Profile</span>
        </NavLink>

        <NavLink to="/find-skills" className={linkClass}>
          <Search size={20} />
          <span>Find Skills</span>
        </NavLink>

        <NavLink to="/matches" className={linkClass}>
          <Handshake size={20} />
          <span>Matches</span>
        </NavLink>

        <NavLink to="/friends" className={linkClass}>
          <Users size={20} />
          <span>Swap Friends</span>
        </NavLink>

        <NavLink to="/requests" className={linkClass}>
          <ClipboardList size={20} />
          <span>Requests</span>
        </NavLink>

        <NavLink to="/chat" className={linkClass}>
          <MessageCircle size={20} />
          <span>Chat</span>
        </NavLink>

        <NavLink to="/schedule" className={linkClass}>
          <CalendarDays size={20} />
          <span>Schedule</span>
        </NavLink>

        <NavLink to="/reviews" className={linkClass}>
          <Star size={20} />
          <span>Reviews</span>
        </NavLink>

        <div className="pt-4 mt-2 border-t border-[#2F293A]">
          <NavLink to="/credits" className={linkClass}>
            <Coins size={20} className="text-yellow-500" />
            <span className="flex-1">Credits</span>
            <span className="bg-yellow-900/30 text-yellow-500 border border-yellow-700/50 text-xs font-bold px-2 py-1 rounded-full">
              {user?.credits || 0}
            </span>
          </NavLink>
        </div>



        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;