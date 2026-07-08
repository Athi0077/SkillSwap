
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
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
      ? "bg-blue-600 text-white"
      : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
    }`;

  return (
    <aside className="hidden md:block w-64 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-white border-r shadow-sm">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-blue-600">
          SkillSwap
        </h1>
      </div>

      <nav className="flex flex-col p-4 space-y-2">

        {/* <NavLink to="/search" className={linkClass}>
          <Search size={20} />
          <span>Search Users</span>
        </NavLink> */}

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



        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-100 transition-all"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;