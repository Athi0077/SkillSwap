import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = "Loading...", fullScreen = false }) => {
  const containerClasses = fullScreen 
    ? "flex flex-col items-center justify-center min-h-screen bg-slate-50"
    : "flex flex-col items-center justify-center py-12";

  return (
    <div className={containerClasses}>
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      {message && <p className="mt-4 text-gray-500 font-medium">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
