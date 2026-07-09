import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Plus, Globe, Search } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import { getHubs, createHub } from "../services/hubService";
import { toast } from "react-hot-toast";

function Hubs() {
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newHubName, setNewHubName] = useState("");
  const [newHubDescription, setNewHubDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    loadHubs();
  }, []);

  const loadHubs = async () => {
    try {
      setLoading(true);
      const res = await getHubs();
      setHubs(res.hubs || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load hubs");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHub = async (e) => {
    e.preventDefault();
    if (!newHubName.trim() || !newHubDescription.trim()) {
      return toast.error("Please fill in all fields");
    }

    try {
      setCreating(true);
      await createHub({
        name: newHubName.trim(),
        description: newHubDescription.trim(),
      });
      toast.success("Hub created successfully!");
      setShowCreateModal(false);
      setNewHubName("");
      setNewHubDescription("");
      loadHubs(); // Reload the list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create hub");
    } finally {
      setCreating(false);
    }
  };

  const filteredHubs = hubs.filter((hub) =>
    hub.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen dark-bento-page">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <Globe className="text-purple-400" size={28} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Skill Hubs</h1>
                <p className="text-gray-400 text-sm md:text-base">Join communities to connect with like-minded individuals.</p>
              </div>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl transition shadow-md font-medium whitespace-nowrap"
            >
              <Plus size={18} />
              Create Hub
            </button>
          </div>

          <div className="mb-8 relative z-10 max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search hubs by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#120F17] border border-[#2F293A] text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading hubs..." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              {filteredHubs.length === 0 ? (
                <div className="col-span-full text-center text-gray-400 py-12">
                  No Hubs found matching your search.
                </div>
              ) : (
                filteredHubs.map((hub) => (
                  <div
                    key={hub._id}
                    onClick={() => navigate(`/hubs/${hub._id}`)}
                    className="glow-card-wrapper bg-[#120F17] border border-[#2F293A] p-6 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:border-purple-500/30 group flex flex-col h-full"
                  >
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{hub.name}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{hub.description}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#2F293A]">
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Users size={16} />
                        <span>{hub.members?.length || 0} Members</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Created by {hub.creator?.name || "Unknown"}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#120F17] border border-[#2F293A] rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Create a New Hub</h2>
            <form onSubmit={handleCreateHub} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Hub Name</label>
                <input
                  type="text"
                  value={newHubName}
                  onChange={(e) => setNewHubName(e.target.value)}
                  placeholder="e.g., Frontend Developers"
                  className="w-full bg-[#1A1625] border border-[#2F293A] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                  maxLength={50}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={newHubDescription}
                  onChange={(e) => setNewHubDescription(e.target.value)}
                  placeholder="What is this hub about?"
                  rows="3"
                  className="w-full bg-[#1A1625] border border-[#2F293A] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                  maxLength={200}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-[#1E1A29] hover:bg-[#2F293A] text-white py-2.5 rounded-xl transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-xl transition font-medium disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create Hub"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Hubs;
