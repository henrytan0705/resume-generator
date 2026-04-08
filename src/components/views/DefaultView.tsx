"use client";

import React from 'react';
import { Search, AlertCircle } from 'lucide-react';

interface DefaultViewProps {
  url: string;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validationError: string | null;
  onScrape: (e: React.FormEvent) => void;
  onLoadDemo: () => void;
}

export function DefaultView({ url, onUrlChange, validationError, onScrape, onLoadDemo }: DefaultViewProps) {
  return (
    <form className="w-full max-w-xl mx-auto animate-in fade-in duration-500" onSubmit={onScrape}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input 
          type="text" 
          value={url}
          onChange={onUrlChange}
          placeholder="https://www.linkedin.com/in/username" 
          className={`block w-full p-4 pl-12 pr-32 text-sm text-slate-900 bg-white border ${validationError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'} rounded-xl shadow-sm focus:outline-none focus:ring-2`} 
        />
        <button 
          type="submit" 
          disabled={!!validationError || !url}
          className="text-white absolute right-2.5 bottom-2.5 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate
        </button>
      </div>
      {validationError && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" /> {validationError}
        </p>
      )}
      
      <div className="mt-8 text-center text-sm text-slate-500">
        <button type="button" onClick={onLoadDemo} className="mt-2 text-blue-600 hover:text-blue-800 underline font-medium">
          Try with Demo Data
        </button>
      </div>
    </form>
  );
}
