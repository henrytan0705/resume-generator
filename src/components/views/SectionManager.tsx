"use client";

import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

export interface SectionItem {
  id: string;
  label: string;
}

interface SectionManagerProps {
  sections: SectionItem[];
  onOrderChange: (sections: SectionItem[]) => void;
}

export function SectionManager({ sections, onOrderChange }: SectionManagerProps) {
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    onOrderChange(newSections);
  };

  const moveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    [newSections[index + 1], newSections[index]] = [newSections[index], newSections[index + 1]];
    onOrderChange(newSections);
  };

  return (
    <div className="bg-slate-50 p-6 sm:p-8 border border-slate-200 rounded-2xl w-full max-w-3xl mx-auto mb-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-slate-800">Resume Layout Ordering</h3>
        <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-2 py-1 rounded-full">PDF Sync</span>
      </div>
      
      <motion.div layout className="space-y-2.5">
        {sections.map((section, index) => (
          <motion.div 
            key={section.id}
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 35, 
              mass: 1 
            }}
            className="flex items-center justify-between bg-white border border-slate-200 p-3 rounded-xl shadow-sm hover:border-blue-200 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-500">
                {index + 1}
              </div>
              <span className="font-semibold text-sm text-slate-700">{section.label}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => moveUp(index)}
                disabled={index === 0}
                aria-label={`Move ${section.label} up`}
                className={`p-1.5 rounded-lg transition-colors ${
                  index === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600'
                }`}
                title="Move Up"
              >
                <ArrowUp className="w-4 h-4" />
              </motion.button>
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => moveDown(index)}
                disabled={index === sections.length - 1}
                aria-label={`Move ${section.label} down`}
                className={`p-1.5 rounded-lg transition-colors ${
                  index === sections.length - 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 bg-slate-100 hover:bg-blue-50 hover:text-blue-600'
                }`}
                title="Move Down"
              >
                <ArrowDown className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
