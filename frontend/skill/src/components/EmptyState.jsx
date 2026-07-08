import React from 'react';
import { PackageOpen } from 'lucide-react';

const EmptyState = ({ title = "No Data Found", message = "There is nothing to display here yet.", icon: Icon = PackageOpen }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="p-4 bg-blue-50 rounded-full mb-4">
        <Icon className="w-10 h-10 text-blue-500" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm">{message}</p>
    </div>
  );
};

export default EmptyState;
