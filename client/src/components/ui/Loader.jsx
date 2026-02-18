// client/src/components/ui/Loader.js
import React from 'react';
import { Bus } from 'lucide-react';

const Loader = ({ size = 'md', fullScreen = false, text = 'Loading...' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const spinnerSizes = {
    sm: 'h-3 w-3',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-10 w-10'
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="relative">
            <div className={`${sizes[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto`} />
            <Bus className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 ${spinnerSizes[size]}`} />
          </div>
          <p className="mt-4 text-gray-600 font-medium">{text}</p>
          <p className="text-sm text-gray-400 mt-2">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className={`${sizes[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`} />
        <Bus className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 ${spinnerSizes[size]}`} />
      </div>
      {text && <span className="ml-3 text-gray-600">{text}</span>}
    </div>
  );
};

// Skeleton Loader Component
export const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const skeletons = {
    card: (
      <div className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    ),
    list: (
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    )
  };

  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <div key={index}>
          {skeletons[type] || skeletons.card}
        </div>
      ))}
    </div>
  );
};

// Page Loader Component
export const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="relative">
          <div className="h-24 w-24 border-8 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <Bus className="h-10 w-10 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mt-6">Kolhapur Bus System</h2>
        <p className="text-gray-600 mt-2">Loading amazing features for you...</p>
      </div>
    </div>
  );
};

// Button Loader Component
export const ButtonLoader = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
      <span>Processing...</span>
    </div>
  );
};

export default Loader; 