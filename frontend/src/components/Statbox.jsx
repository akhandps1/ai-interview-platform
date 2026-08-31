/**
 * FILE: frontend/src/components/Statbox.jsx
 * PURPOSE: Core logic and configuration for Statbox.jsx.
 */
import React from 'react';
import { motion } from "motion/react";

function Statbox({ label, value, sub, subHighlight, index = 0 }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className='relative bg-white border border-zinc-200 rounded-xl p-4 md:p-5 flex flex-col gap-1 shadow-sm hover:shadow-md transition-shadow'
    >
        <p className='text-zinc-500 text-xs font-medium uppercase tracking-wider'>{label}</p>
        <p className='text-zinc-900 text-2xl font-bold tracking-tight'>{value}</p>

        {sub && (
            <div className='flex items-center gap-1.5 mt-1 flex-wrap'>
                {subHighlight && (
                    <div className='text-[10px] font-semibold bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded'>
                      {subHighlight}
                    </div>
                )}
                <span className='text-zinc-400 text-xs'>{sub}</span>
            </div>
        )}
    </motion.div>
  );
}

export default Statbox;
