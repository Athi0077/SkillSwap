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
    `transition-colors font-medium hover:text-purple-400 ${isActive ? "text-purple-500" : "text-gray-400"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `flex items-center justify-center p-2 text-sm rounded-xl transition-all font-medium ${isActive
      ? "bg-purple-600 text-white"
      : "text-gray-400 hover:bg-[#2F293A] hover:text-white"
    }`;

  return (
    <nav className="glow-card-wrapper bg-[#120F17] !rounded-none no-top-glow no-left-glow no-right-glow border-b border-[#2F293A] shadow-md sticky top-0 z-50">
      <div className="max-w-[1400px] w-full mx-auto px-3 md:px-4 relative z-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center text-2xl font-bold text-purple-500"
          >
            <img src="/assets/logo.png" alt="SkillSwap Logo" className="w-20 h-20 object-contain scale-[1.3] -ml-4 -mb-4" />
            <span className="-ml-2">SkillSwap</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-3 lg:gap-5 text-sm xl:text-base whitespace-nowrap">
            {isAuthenticated ? (
              <>
                <NavLink to="/search" className="flex items-center text-gray-400 hover:text-purple-400 transition-colors">
                  <Search size={20} />
                </NavLink>

                <NavLink to="/dashboard" className={desktopLinkClass}>Dashboard</NavLink>

                <NavLink to="/find-skills" className={desktopLinkClass}>Find Skills</NavLink>

                <NavLink to="/requests" className={desktopLinkClass}>Requests</NavLink>

                <NavLink to="/friends" className={desktopLinkClass}>Friends</NavLink>

                <NavLink to="/chat" className={desktopLinkClass}>Chat</NavLink>

                <NavLink to="/schedule" className={desktopLinkClass}>Schedule</NavLink>

                <NavLink to="/reviews" className={desktopLinkClass}>Reviews</NavLink>

                <NavLink to="/leaderboard" className={desktopLinkClass}>Leaderboard</NavLink>

                <NavLink to="/matches" className={desktopLinkClass}>Matches</NavLink>
                
                <NavLink to="/hubs" className={desktopLinkClass}>Hubs</NavLink>

                <NavLink to="/credits" className={desktopLinkClass}>Credits</NavLink>

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
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition font-medium"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Buttons */}
          <div className="md:hidden flex items-center gap-4 text-white">
            {isAuthenticated && (
              <NavLink to="/search" className="text-gray-400 hover:text-purple-400 transition-colors" onClick={closeMenu}>
                <Search size={24} />
              </NavLink>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="hover:text-purple-400 transition-colors"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-[800px] opacity-100 py-4" : "max-h-0 opacity-0 py-0"
            }`}
        >
          <div className="grid grid-cols-3 gap-3 px-2 pb-2 text-center relative z-10">
            {isAuthenticated ? (
              <>

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


                <NavLink to="/reviews" className={mobileLinkClass} onClick={closeMenu}>
                  Reviews
                </NavLink>

                <NavLink to="/leaderboard" className={mobileLinkClass} onClick={closeMenu}>
                  Leaderboard
                </NavLink>

                <NavLink to="/matches" className={mobileLinkClass} onClick={closeMenu}>
                  Matches
                </NavLink>

                <NavLink to="/hubs" className={mobileLinkClass} onClick={closeMenu}>
                  Hubs
                </NavLink>

                <NavLink to="/profile" className={mobileLinkClass} onClick={closeMenu}>
                  {user?.name || "Profile"}
                </NavLink>

                <NavLink to="/credits" className={mobileLinkClass} onClick={closeMenu}>
                  Credits
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
