import React from "react";
import { ExternalLink, Edit, Trash2 } from "lucide-react";
import { FaGithub, FaFigma } from "react-icons/fa";
import { SiVercel } from "react-icons/si";

export default function ProjectCard({ project, isOwner, onEdit, onDelete }) {
  const getPlatformIcon = (link) => {
    if (!link) return <ExternalLink size={24} />;
    const lowerLink = link.toLowerCase();
    if (lowerLink.includes("github.com")) return <FaGithub size={24} />;
    if (lowerLink.includes("vercel.app")) return <SiVercel size={24} />;
    if (lowerLink.includes("figma.com")) return <FaFigma size={24} />;
    return <ExternalLink size={24} />;
  };

  return (
    <div className="bg-[#1A1625] border border-[#2F293A] hover:border-indigo-500 rounded-2xl overflow-hidden group transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(79,70,229,0.15)] flex flex-col h-full relative">
      {/* Header Pattern */}
      <div className="h-16 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border-b border-[#2F293A] relative">
        <div className="absolute -bottom-6 left-6 w-12 h-12 bg-[#2F293A] rounded-xl border-4 border-[#1A1625] flex items-center justify-center text-indigo-400">
          {getPlatformIcon(project.link)}
        </div>
      </div>

      <div className="px-6 pt-10 pb-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
          {project.title}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
          {project.description || "No description provided."}
        </p>

        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {project.techStack.map((tech, idx) => (
              <span
                key={idx}
                className="bg-[#2F293A] text-gray-300 px-2 py-1 rounded text-xs"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 font-medium py-2 rounded-xl transition-colors border border-indigo-500/20"
        >
          View Live <ExternalLink size={16} />
        </a>
      </div>

      {isOwner && (
        <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-2 bg-[#1A1625] border border-[#2F293A] rounded-lg text-gray-400 hover:text-blue-400 hover:border-blue-500 transition-all shadow-md"
            title="Edit Project"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-[#1A1625] border border-[#2F293A] rounded-lg text-gray-400 hover:text-red-400 hover:border-red-500 transition-all shadow-md"
            title="Delete Project"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
