import React from 'react';
import { ChevronDown } from 'lucide-react';

export function Select({ 
  value, 
  onChange, 
  children, 
  className = '', 
  ...props 
}) {
  return (
    <div className="relative group">
      <select
        value={value}
        onChange={onChange}
        className={`
          appearance-none pl-4 pr-10 py-3 
          bg-gray-900/50 backdrop-blur-sm 
          border border-gray-800 
          rounded-xl text-white 
          focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 
          transition-all cursor-pointer
          w-full
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
    </div>
  );
}

// Opció per a selects més petits
export function SelectSmall({ 
  value, 
  onChange, 
  children, 
  className = '', 
  ...props 
}) {
  return (
    <div className="relative group">
      <select
        value={value}
        onChange={onChange}
        className={`
          appearance-none pl-3 pr-8 py-2
          bg-gray-900/50 backdrop-blur-sm 
          border border-gray-800 
          rounded-lg text-white text-sm
          focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 
          transition-all cursor-pointer
          w-full
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
    </div>
  );
}
