import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Search, Coins } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  const desktopLinkClass = ({ isActive }) =>
    `transition-colors font-medium hover:text-blue-600 ${isActive ? "text-blue-600" : "text-gray-600"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `flex items-center justify-center p-2 text-sm rounded-xl transition-all font-medium ${isActive
      ? "bg-blue-600 text-white"
      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
    }`;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600"
          >
            SkillSwap
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <NavLink to="/search" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                  <Search size={20} />
                </NavLink>

                <NavLink to="/dashboard" className={desktopLinkClass}>Dashboard</NavLink>

                <NavLink to="/find-skills" className={desktopLinkClass}>Find Skills</NavLink>

                <NavLink to="/requests" className={desktopLinkClass}>Requests</NavLink>

                <NavLink to="/friends" className={desktopLinkClass}>Friends</NavLink>

                <NavLink to="/chat" className={desktopLinkClass}>Chat</NavLink>

                <NavLink to="/schedule" className={desktopLinkClass}>Schedule</NavLink>

                <NavLink to="/reviews" className={desktopLinkClass}>Reviews</NavLink>

                {/* <NavLink to="/search" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                  <Search size={20} />
                </NavLink> */}

                <NavLink to="/profile" className={desktopLinkClass}>
                  {user?.name || "Profile"}
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/" className={desktopLinkClass}>Home</NavLink>

                <NavLink to="/login" className={desktopLinkClass}>Login</NavLink>

                <NavLink
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-[800px] opacity-100 py-4" : "max-h-0 opacity-0 py-0"
            }`}
        >
          <div className="grid grid-cols-3 gap-3 px-2 pb-2 text-center">
            {isAuthenticated ? (
              <>
                {/* search icon only */}
                <NavLink to="/search" className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-gray-700 hover:text-blue-600" onClick={closeMenu}>
                  <Search size={24} />
                </NavLink>

                <NavLink to="/dashboard" className={mobileLinkClass} onClick={closeMenu}>
                  Dashboard
                </NavLink>

                <NavLink to="/find-skills" className={mobileLinkClass} onClick={closeMenu}>
                  Find Skills
                </NavLink>

                <NavLink to="/requests" className={mobileLinkClass} onClick={closeMenu}>
                  Requests
                </NavLink>

                <NavLink to="/friends" className={mobileLinkClass} onClick={closeMenu}>
                  Friends
                </NavLink>

                <NavLink to="/chat" className={mobileLinkClass} onClick={closeMenu}>
                  Chat
                </NavLink>

                <NavLink to="/schedule" className={mobileLinkClass} onClick={closeMenu}>
                  Schedule
                </NavLink>

                <NavLink 
                  to="/credits" 
                  className="col-span-3 bg-yellow-500 hover:bg-yellow-600 text-white py-2 mt-2 rounded-xl transition font-medium flex items-center justify-center gap-2" 
                  onClick={closeMenu}
                >
                  <Coins size={18} /> Get Credits
                </NavLink>

                <NavLink to="/reviews" className={mobileLinkClass} onClick={closeMenu}>
                  Reviews
                </NavLink>

                <NavLink to="/profile" className={mobileLinkClass} onClick={closeMenu}>
                  {user?.name || "Profile"}
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="col-span-3 bg-red-500 hover:bg-red-600 text-white py-2 mt-2 rounded-xl transition font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/" className={mobileLinkClass} onClick={closeMenu}>
                  Home
                </NavLink>

                <NavLink to="/login" className={mobileLinkClass} onClick={closeMenu}>
                  Login
                </NavLink>

                <NavLink to="/register" className={mobileLinkClass} onClick={closeMenu}>
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
