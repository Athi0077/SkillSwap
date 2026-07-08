
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white">
              SkillSwap
            </h2>

            <p className="mt-3 text-sm leading-6">
              Learn new skills by teaching what you already know.
              Connect with people around the world and grow together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h3>

            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="hover:text-blue-400 transition"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/find-skills"
                  className="hover:text-blue-400 transition"
                >
                  Find Skills
                </Link>
              </li>

              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-blue-400 transition"
                >
                  Dashboard
                </Link>
              </li>

              <li>
                <Link
                  to="/reviews"
                  className="hover:text-blue-400 transition"
                >
                  Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Contact
            </h3>

            <p>Email: support@skillswap.com</p>
            <p className="mt-2">Phone: +91 98765 43210</p>

            <div className="flex gap-4 mt-5">
              <a href="#" className="hover:text-blue-400">
                Facebook
              </a>

              <a href="#" className="hover:text-blue-400">
                LinkedIn
              </a>

              <a href="#" className="hover:text-blue-400">
                GitHub
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-700 mt-8 pt-6 text-center text-sm">
          © {new Date().getFullYear()} SkillSwap Platform. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;