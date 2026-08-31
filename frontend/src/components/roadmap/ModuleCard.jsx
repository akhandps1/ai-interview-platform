/**
 * FILE: frontend/src/components/roadmap/ModuleCard.jsx
 * PURPOSE: Core logic and configuration for ModuleCard.jsx.
 */
import React, { useState } from 'react';
import { AnimatePresence, motion } from "motion/react";
import { FiBookOpen, FiChevronDown, FiChevronUp, FiClock, FiYoutube } from 'react-icons/fi';

const difficultyColor = { Easy: "text-emerald-600 bg-emerald-50 border-emerald-100", Medium: "text-amber-600 bg-amber-50 border-amber-100", Hard: "text-rose-600 bg-rose-50 border-rose-100" };

function ModuleCard({ mod, index }) {
    const [open, setOpen] = useState(false);
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.35 }}
            className='bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer select-none'
            onClick={() => setOpen(!open)}
        >
            <div className='flex items-center gap-4 p-4 md:p-5'>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border ${difficultyColor[mod.difficulty]}`}>
                    {index + 1}
                </div>

                <div className='flex-1 min-w-0'>
                    <p className='text-sm md:text-base font-bold text-zinc-900 truncate'>{mod.title}</p>
                    <div className='flex items-center gap-2 mt-1'>
                        <FiClock size={12} className="text-zinc-400"/>
                        <span className='text-xs text-zinc-500 font-medium'>{mod.duration}</span>
                    </div>
                </div>

                <div className='flex items-center gap-3'>
                    <span className={`text-xs font-semibold hidden sm:block px-2 py-1 rounded-md border ${difficultyColor[mod.difficulty]}`}>
                        {mod.difficulty}
                    </span>
                    <div className="text-zinc-400 bg-zinc-50 p-1.5 rounded-md">
                        {open ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className='overflow-hidden'
                    >
                        <div className='px-4 md:px-5 pb-5 pt-1 border-t border-zinc-100 bg-zinc-50/50'>
                            <p className='text-sm text-zinc-600 mt-4 mb-5 leading-relaxed'>{mod.description}</p>
                            <div className='flex gap-3 flex-wrap'>
                                <a href={mod.youtube} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                    <motion.button 
                                        whileHover={{ scale: 1.02 }} 
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors shadow-sm"
                                    >
                                        <FiYoutube size={16} /> Watch Tutorial
                                    </motion.button>
                                </a>

                                <a href={mod.article} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                    <motion.button 
                                        whileHover={{ scale: 1.02 }} 
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-zinc-200 text-zinc-700 bg-white hover:bg-zinc-50 transition-colors shadow-sm"
                                    >
                                        <FiBookOpen size={14} /> Read Article
                                    </motion.button>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default ModuleCard;
