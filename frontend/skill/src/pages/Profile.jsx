
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Mail,
  Star,
  BookOpen,
  Award,
  Edit,
  Share2,
  Plus,
  X,
} from "lucide-react";
import { FaLinkedin, FaTwitter, FaInstagram, FaYoutube, FaWhatsapp, FaGithub, FaGlobe } from "react-icons/fa";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import ReviewCard from "../components/ReviewCard";
import Lanyard from "../components/Lanyard";
import AchievementBadge from "../components/AchievementBadge";
import SkillAnalytics from "../components/SkillAnalytics";
import ProjectCard from "../components/ProjectCard";

import { getMyProfile, updateProfile } from "../services/userService";
import { getUserReviews } from "../services/reviewService";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [newAchievement, setNewAchievement] = useState({ title: "", link: "", description: "", techStack: "" });
  const [savingAchievement, setSavingAchievement] = useState(false);
  const [editingProjectIndex, setEditingProjectIndex] = useState(null);

  const getSocialIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case "linkedin": return <FaLinkedin size={18} />;
      case "twitter": return <FaTwitter size={18} />;
      case "instagram": return <FaInstagram size={18} />;
      case "youtube": return <FaYoutube size={18} />;
      case "whatsapp": return <FaWhatsapp size={18} />;
      case "github": return <FaGithub size={18} />;
      default: return <FaGlobe size={18} />;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const profileRes = await getMyProfile();
      setUser(profileRes.user);

      if (profileRes.user?._id) {
        const reviewRes = await getUserReviews(profileRes.user._id);
        setReviews(reviewRes.reviews || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAchievement = async (e) => {
    e.preventDefault();
    if (!newAchievement.title || !newAchievement.link) {
      toast.error("Please fill in all fields");
      return;
    }
    
    try {
      setSavingAchievement(true);
      let updatedAchievements = [...(user.achievements || [])];
      
      const formattedProject = {
        title: newAchievement.title,
        link: newAchievement.link,
        description: newAchievement.description,
        techStack: typeof newAchievement.techStack === 'string' 
          ? newAchievement.techStack.split(",").map(t => t.trim()).filter(t => t) 
          : newAchievement.techStack
      };
      
      if (editingProjectIndex !== null) {
        updatedAchievements[editingProjectIndex] = formattedProject;
      } else {
        updatedAchievements.push(formattedProject);
      }
      
      const res = await updateProfile({ achievements: updatedAchievements });
      if (res.success) {
        setUser(res.user);
        toast.success(editingProjectIndex !== null ? "Project updated!" : "Project added!");
        setShowAchievementModal(false);
        setNewAchievement({ title: "", link: "", description: "", techStack: "" });
        setEditingProjectIndex(null);
      }
    } catch (error) {
      toast.error(error.message || "Failed to save project");
    } finally {
      setSavingAchievement(false);
    }
  };

  const handleEditProject = (index) => {
    const project = user.achievements[index];
    setNewAchievement({
      ...project,
      techStack: Array.isArray(project.techStack) ? project.techStack.join(", ") : project.techStack
    });
    setEditingProjectIndex(index);
    setShowAchievementModal(true);
  };

  const handleDeleteProject = async (index) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const updatedAchievements = user.achievements.filter((_, i) => i !== index);
      const res = await updateProfile({ achievements: updatedAchievements });
      if (res.success) {
        setUser(res.user);
        toast.success("Project deleted!");
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete project");
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen dark-bento-page">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 max-w-full overflow-x-hidden">

          {/* Profile Header */}
          <div className="glow-card-wrapper bg-[#120F17] p-8 relative">

            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">

              <img
                src={
                  user?.profileImage ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || "User"
                  )}&background=3B82F6&color=fff`
                }
                alt={user?.name}
                className="w-36 h-36 rounded-full object-cover border-4 border-[#2F293A]"
              />

              <div className="flex-1">

                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                  <div>
                    <h1 className="text-4xl font-bold text-white">
                      {user?.name}
                    </h1>
                    {user?.username && (
                      <p className="mt-1 font-semibold text-green-400">
                        @{user.username}
                      </p>
                    )}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Mail size={18} />
                        {user?.email}
                      </div>

                      {user?.location && (
                        <div className="flex items-center gap-2 text-gray-400">
                          <MapPin size={18} />
                          {user.location}
                        </div>
                      )}
                    </div>

                    <p className="mt-6 text-gray-300">
                      {user?.bio || "No bio available."}
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-6">
                      <button
                        onClick={() => navigate("/profile/edit")}
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-md"
                      >
                        Edit Profile
                      </button>

                      {user?.socialLinks?.length > 0 && (
                        <div className="flex flex-wrap items-center gap-3">
                          {user.socialLinks.map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-white transition-all bg-[#1A1625] border border-[#2F293A] hover:border-indigo-500 hover:bg-indigo-600 p-2.5 rounded-full hover:shadow-[0_0_15px_rgba(79,70,229,0.5)] hover:-translate-y-1"
                              title={link.platform}
                            >
                              {getSocialIcon(link.platform)}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <AchievementBadge user={user} />
                  </div>
                </div>
              </div>
            </div>

            {/* Portfolio Showcase */}
            <div className="mt-12 relative z-10 w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  Portfolio Showcase
                </h2>
                <button
                  onClick={() => {
                    setEditingProjectIndex(null);
                    setNewAchievement({ title: "", link: "", description: "", techStack: "" });
                    setShowAchievementModal(true);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Add Project
                </button>
              </div>

              {user?.achievements?.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {user.achievements.map((ach, idx) => (
                    <ProjectCard 
                      key={idx} 
                      project={ach} 
                      isOwner={true} 
                      onEdit={() => handleEditProject(idx)}
                      onDelete={() => handleDeleteProject(idx)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-[#1A1625] border border-[#2F293A] rounded-2xl border-dashed">
                  <div className="w-16 h-16 bg-[#2F293A] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
                  <p className="text-gray-400 max-w-sm mx-auto">
                    Showcase your work! Add projects you've built to make your profile stand out.
                  </p>
                </div>
              )}
            </div>

            {/* Share Profile Button */}
            <button
              onClick={async () => {
                const url = window.location.href;
                if (navigator.share) {
                  try {
                    await navigator.share({
                      title: "Skill Swap Profile",
                      text: `Check out ${user?.name}'s profile on Skill Swap!`,
                      url: url,
                    });
                  } catch (error) {
                    console.log("Error sharing", error);
                  }
                } else {
                  navigator.clipboard.writeText(url);
                  toast.success("Profile link copied to clipboard!");
                }
              }}
              className="absolute bottom-6 right-6 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-105 z-20"
              title="Share Profile"
            >
              <Share2 size={20} />
            </button>

          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mt-8 relative z-10">

            <div className="glow-card-wrapper bg-[#120F17] p-6 text-center relative">
              <div className="relative z-10">
                <Star className="mx-auto text-yellow-500" size={34} />
                <h2 className="text-3xl font-bold mt-3 text-white">
                  {user?.rating || "0.0"}
                </h2>
                <p className="text-gray-400">Rating</p>
              </div>
            </div>

            <div className="glow-card-wrapper bg-[#120F17] p-6 text-center relative">
              <div className="relative z-10">
                <BookOpen className="mx-auto text-indigo-400" size={34} />
                <h2 className="text-3xl font-bold mt-3 text-white">
                  {user?.skillsOffered?.length || 0}
                </h2>
                <p className="text-gray-400">
                  Skills Offered
                </p>
              </div>
            </div>

            <div className="glow-card-wrapper bg-[#120F17] p-6 text-center relative">
              <div className="relative z-10">
                <Award className="mx-auto text-green-400" size={34} />
                <h2 className="text-3xl font-bold mt-3 text-white">
                  {reviews.length}
                </h2>
                <p className="text-gray-400">
                  Reviews
                </p>
              </div>
            </div>
          </div>



          {/* 3D Lanyard ID Card */}
          <div className="mt-8 relative z-10 w-full flex justify-center bg-[#120F17] rounded-3xl overflow-hidden border border-[#2F293A] shadow-lg">
            <Lanyard
              position={[0, 0, 24]}
              gravity={[0, -40, 0]}
              frontImage={user?.profileImage || null}
              imageFit="cover"
              userName={user?.name || 'User'}
              userUsername={user?.username ? `@${user.username}` : ''}
            />
          </div>

          {/* Skills */}
          <div className="grid lg:grid-cols-2 gap-8 mt-10 relative z-10">

            <div className="glow-card-wrapper bg-[#120F17] p-6 relative">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-5 text-white">
                  Skills Offered
                </h2>

                <div className="flex flex-wrap gap-3">
                  {user?.skillsOffered?.length ? (
                    user.skillsOffered.map((skill) => (
                      <span
                        key={skill}
                        className="bg-indigo-900/50 text-indigo-300 border border-indigo-500/30 px-4 py-2 rounded-full"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      No skills added.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="glow-card-wrapper bg-[#120F17] p-6 relative">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-5 text-white">
                  Skills Wanted
                </h2>

                <div className="flex flex-wrap gap-3">
                  {user?.skillsWanted?.length ? (
                    user.skillsWanted.map((skill) => (
                      <span
                        key={skill}
                        className="bg-purple-900/50 text-purple-300 border border-purple-500/30 px-4 py-2 rounded-full"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      No skills added.
                    </p>
                  )}
                </div>
              </div>
            </div>

          </div>

          <SkillAnalytics user={user} />

          {/* Reviews */}
          <section className="mt-12 relative z-10">

            <h2 className="text-3xl font-bold mb-6 text-white">
              Reviews
            </h2>

            <div className="space-y-6">

              {reviews.length ? (
                reviews.map((review) => (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    currentUser={user}
                  />
                ))
              ) : (
                <div className="glow-card-wrapper bg-[#120F17] p-8 text-center text-gray-400 relative">
                  <span className="relative z-10">No reviews yet.</span>
                </div>
              )}

            </div>

          </section>

        </main>
      </div>

      {/* Achievement Modal */}
      {showAchievementModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#120F17] border border-[#2F293A] rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button
              type="button"
              onClick={() => setShowAchievementModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-xl font-bold text-white mb-6">Add Project</h2>
            
            <form onSubmit={handleAddAchievement} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  value={newAchievement.title}
                  onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                  className="w-full bg-[#1A1625] border border-[#2F293A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. SkillSwap Platform"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Project URL
                </label>
                <input
                  type="url"
                  value={newAchievement.link}
                  onChange={(e) => setNewAchievement({ ...newAchievement, link: e.target.value })}
                  className="w-full bg-[#1A1625] border border-[#2F293A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. https://github.com/..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Short Description
                </label>
                <textarea
                  value={newAchievement.description}
                  onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                  className="w-full bg-[#1A1625] border border-[#2F293A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none h-24"
                  placeholder="Briefly describe what this project does..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tech Stack (comma-separated)
                </label>
                <input
                  type="text"
                  value={newAchievement.techStack}
                  onChange={(e) => setNewAchievement({ ...newAchievement, techStack: e.target.value })}
                  className="w-full bg-[#1A1625] border border-[#2F293A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. React, Node.js, MongoDB"
                />
              </div>
              
              <button
                type="submit"
                disabled={savingAchievement}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors mt-6 disabled:opacity-50"
              >
                {savingAchievement ? "Saving..." : "Save Project"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
