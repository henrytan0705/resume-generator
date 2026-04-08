'use client';
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const loadingPhrases = [
  "Connecting to Secure Proxy...",
  "Authenticating with Data Provider...",
  "Loading External Assets...",
  "Parsing Profile Data..."
];

export function ScrapingLoader() {
  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPhraseIdx(p => (p + 1) % loadingPhrases.length), 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto bg-white p-10 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center mt-4 h-64 animate-in zoom-in-95 duration-300">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-6" />
      <h3 className="text-xl font-bold text-slate-800 mb-2">Extracting Profile</h3>
      <p className="text-slate-500 font-medium animate-pulse">{loadingPhrases[phraseIdx]}</p>
      <div className="w-64 h-2 bg-slate-100 rounded-full mt-6 overflow-hidden relative">
        <div className="h-full bg-blue-500 rounded-full w-full animate-pulse" />
      </div>
    </div>
  );
}
