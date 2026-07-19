import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = "Loading...", fullScreen = false }) => {
  const containerClasses = fullScreen 
    ? "flex flex-col items-center justify-center min-h-screen bg-[#0B090F]"
    : "flex flex-col items-center justify-center py-12";

  return (
    <div className={containerClasses}>
      <img src="/assets/logo.png" alt="SkillSwap Logo" className="w-48 h-48 object-contain animate-pulse mb-4 scale-[1.8]" />
      <Loader2 className="w-10 h-10 text-purple-500 animate-spin mt-4" />
      
      {message && <p className="mt-4 text-gray-400 font-medium text-lg">{message}</p>}
    </div>
  );
}; 

export default LoadingSpinner;
