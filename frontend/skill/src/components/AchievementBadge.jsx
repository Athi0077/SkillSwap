import { Trophy, Star, Medal, Zap, Flame, Award } from "lucide-react";

const badges = [
  {
    id: "top-mentor",
    name: "Top Mentor",
    description: "Ranked in the top 10% of users by rating.",
    icon: <Trophy size={24} className="text-yellow-400" />,
    style: "bg-yellow-400/10 border-yellow-400/30 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.15)]",
    condition: (user) => user?.rating >= 4.5,
  },
  {
    id: "active-swapper",
    name: "Active Swapper",
    description: "Earned more than 100 credits from sessions.",
    icon: <Zap size={24} className="text-indigo-400" />,
    style: "bg-indigo-400/10 border-indigo-400/30 text-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.15)]",
    condition: (user) => user?.credits > 100,
  },
  {
    id: "hot-streak",
    name: "On Fire",
    description: "Currently has an active skill swapping streak.",
    icon: <Flame size={24} className="text-orange-500" />,
    style: "bg-orange-500/10 border-orange-500/30 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.15)]",
    condition: (user) => user?.credits > 50 && user?.rating >= 4.0,
  },
  {
    id: "rising-star",
    name: "Rising Star",
    description: "Joined recently and already highly rated.",
    icon: <Star size={24} className="text-pink-400" />,
    style: "bg-pink-400/10 border-pink-400/30 text-pink-400 shadow-[0_0_15px_rgba(244,114,182,0.15)]",
    condition: (user) => user?.rating > 4.8 && user?.credits < 100,
  },
  {
    id: "veteran",
    name: "Veteran",
    description: "Has been using SkillSwap extensively.",
    icon: <Medal size={24} className="text-emerald-400" />,
    style: "bg-emerald-400/10 border-emerald-400/30 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.15)]",
    condition: (user) => user?.credits > 300,
  },
];

export default function AchievementBadge({ user }) {
  if (!user) return null;

  const earnedBadges = badges.filter((badge) => badge.condition(user));

  if (earnedBadges.length === 0) {
    return (
      <div className="flex items-center gap-3 text-gray-500 mt-6 bg-[#120F17] border border-[#2F293A] p-4 rounded-xl">
        <Award size={20} />
        <span className="text-sm">Complete more sessions to earn achievements!</span>
      </div>
    );
  }

  return (
    <div className="mt-8 relative z-10 w-full">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Trophy className="text-yellow-500" size={20} />
        Achievements
      </h3>
      
      <div className="flex flex-wrap gap-4">
        {earnedBadges.map((badge) => (
          <div
            key={badge.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${badge.style} group relative cursor-help transition-all duration-300 hover:-translate-y-1`}
          >
            {badge.icon}
            <span className="font-bold">{badge.name}</span>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#1A1625] text-gray-300 text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-[#2F293A] text-center shadow-xl z-20">
              {badge.description}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
