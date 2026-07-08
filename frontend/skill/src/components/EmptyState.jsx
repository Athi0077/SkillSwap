import React from 'react';
import { PackageOpen } from 'lucide-react';

const EmptyState = ({ title = "No Data Found", message = "There is nothing to display here yet.", icon: Icon = PackageOpen }) => {
  return (
    <div className="glow-card-wrapper bg-[#120F17] flex flex-col items-center justify-center p-12 text-center rounded-2xl shadow-sm border border-[#2F293A] relative">
      <div className="p-4 bg-indigo-900/30 rounded-full mb-4 relative z-10">
        <Icon className="w-10 h-10 text-indigo-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2 relative z-10">{title}</h3>
      <p className="text-gray-400 max-w-sm relative z-10">{message}</p>
    </div>
  );
};

export default EmptyState;
