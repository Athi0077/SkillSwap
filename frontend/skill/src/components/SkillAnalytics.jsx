import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";

export default function SkillAnalytics({ user }) {
  if (!user || (!user.skillsOffered?.length && !user.skillsWanted?.length)) {
    return null;
  }

  // Generate a mock proficiency score based on the string length to keep it consistent
  const getProficiency = (skill) => {
    let hash = 0;
    for (let i = 0; i < skill.length; i++) {
      hash = skill.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Return a consistent score between 60 and 98
    return 60 + (Math.abs(hash) % 38);
  };

  const data = user.skillsOffered?.slice(0, 6).map((skill) => ({
    subject: skill.length > 12 ? skill.substring(0, 10) + ".." : skill,
    A: getProficiency(skill),
    fullMark: 100,
  }));

  if (!data || data.length < 3) {
    // Radar charts need at least 3 points to look like a polygon
    return null;
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1A1625] border border-[#2F293A] p-3 rounded-lg shadow-xl">
          <p className="text-white font-bold">{payload[0].payload.subject}</p>
          <p className="text-purple-400">Proficiency: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glow-card-wrapper bg-[#120F17] p-6 relative mt-8">
      <div className="relative z-10 w-full">
        <h3 className="text-2xl font-bold text-white mb-6">Skill Analytics</h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
              <PolarGrid stroke="#2F293A" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Radar
                name={user.name}
                dataKey="A"
                stroke="#A78BFA"
                strokeWidth={2}
                fill="#8B5CF6"
                fillOpacity={0.4}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
