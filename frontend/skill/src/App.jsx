import { Routes, Route, useLocation } from "react-router-dom"; // trigger HMR
import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/PageTransition";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import FindSkills from "./pages/FindSkills";
import Matches from "./pages/Matches";
import UserProfile from "./pages/UserProfile";
import Requests from "./pages/Requests";
import Chat from "./pages/Chat";
import Schedule from "./pages/Schedule";
import Reviews from "./pages/Reviews";
import SwapFriends from "./pages/SwapFriends";
import SearchUsers from "./pages/SearchUsers";
import VideoCall from "./pages/VideoCall";
import Credits from "./pages/Credits";
import Leaderboard from "./pages/Leaderboard";
import Hubs from "./pages/Hubs";
import HubDetails from "./pages/HubDetails";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ClickSpark from "./components/ClickSpark";
import MouseGlow from "./components/MouseGlow";
import MobileDock from "./components/MobileDock";

import { Toaster } from "react-hot-toast";

function App() {
  const location = useLocation();

  return (
    <>
      <MouseGlow />
      <ClickSpark />
      <Toaster position="top-right" />
      <MobileDock />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageTransition><Dashboard /></PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageTransition><Profile /></PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <PageTransition><EditProfile /></PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/find-skills"
          element={
            <ProtectedRoute>
              <PageTransition><FindSkills /></PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <PageTransition><Matches /></PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/:id"
          element={
            <ProtectedRoute>
              <PageTransition><UserProfile /></PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <PageTransition><Requests /></PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <PageTransition><Chat /></PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/friends"
          element={
            <ProtectedRoute>
              <PageTransition><SwapFriends /></PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <PageTransition><SearchUsers /></PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <PageTransition><Schedule /></PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/credits"
          element={
            <ProtectedRoute>
              <PageTransition><Credits /></PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <PageTransition><Leaderboard /></PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reviews"
          element={
            <ProtectedRoute>
              <PageTransition><Reviews /></PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/hubs"
          element={
            <ProtectedRoute>
              <PageTransition><Hubs /></PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/hubs/:id"
          element={
            <ProtectedRoute>
              <PageTransition><HubDetails /></PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/video-call/:sessionId"
          element={
            <ProtectedRoute>
              <PageTransition><VideoCall /></PageTransition>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
    </>
  );
}

export default App;