"use client";

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ScrapingErrorProps {
  apiError: string | null;
  onRetry: () => void;
  onLoadDemo: () => void;
}

export function ScrapingError({ apiError, onRetry, onLoadDemo }: ScrapingErrorProps) {
  return (
    <div className="w-full max-w-xl mx-auto bg-red-50 p-8 rounded-2xl border border-red-100 flex flex-col items-center text-center mt-4 animate-in fade-in duration-300">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-xl font-bold text-red-800 mb-2">Extraction Failed</h3>
      <p className="text-red-600 mb-6 max-w-sm">
        {typeof apiError === 'string' ? apiError : JSON.stringify(apiError)}
      </p>
      <div className="flex gap-4">
        <button 
          onClick={onRetry}
          className="px-6 py-2.5 rounded-lg border border-red-300 text-red-700 font-medium hover:bg-red-100 transition-colors"
        >
          Go Back
        </button>
        <button 
          onClick={onLoadDemo}
          className="px-6 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 shadow-sm transition-colors"
        >
          Try with Demo Data
        </button>
      </div>
    </div>
  );
}
