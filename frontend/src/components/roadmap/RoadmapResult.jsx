/**
 * FILE: frontend/src/components/roadmap/RoadmapResult.jsx
 * PURPOSE: Renders the generated AI roadmap data as a vertical timeline. 
 * Displays target package, duration, and individual learning modules.
 */
import React from 'react';
import { motion } from "motion/react";
import { FiCheckCircle, FiClock, FiMap, FiTarget, FiX } from 'react-icons/fi';
import ModuleCard from './ModuleCard';

function RoadmapResult({roadmap, onClear}) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}>

        <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
         className='relative bg-white border border-zinc-200 rounded-2xl p-5 mb-5 shadow-sm'>

            <div className='relative flex items-start justify-between mb-4'>
                <div>
                    <p className='text-[10px] text-zinc-400 font-semibold tracking-widest uppercase mb-1'>Your Personalized Roadmap</p>
                    <h2 className='text-xl font-bold text-zinc-900'>{roadmap.title}</h2>
                    <p className='text-sm text-zinc-500 mt-1'>
                      Target Package: <span className="text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md">{roadmap.targetPackage}</span>
                    </p>
                </div>
                <button onClick={onClear} className='text-zinc-400 hover:text-zinc-700 bg-zinc-50 hover:bg-zinc-100 p-1.5 rounded-md transition-colors'>
                  <FiX size={16}/>
                </button>
            </div>

            <div className='relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
                {[
            { icon: FiTarget,      label: "Difficulty", value: roadmap.level },
            { icon: FiClock,       label: "Duration",   value: roadmap.duration },
            { icon: FiCheckCircle, label: "Modules",    value: `${roadmap.modules.length} topics` },
          ].map(({icon:Icon , label , value})=>(
            <div key={label} className='rounded-xl p-3 bg-zinc-50 border border-zinc-100'>
                <div className='flex items-center gap-1.5 mb-1.5'>
                    <Icon size={12} className="text-zinc-400"/>
                    <span className='text-xs font-medium text-zinc-500'>{label}</span>
                </div>
                <p className='text-sm font-bold text-zinc-900'>{value}</p>
            </div>
          ))}
            </div>
        </motion.div>

        {/* Timeline representation of modules */}
        <div className="relative pl-4 mt-8">
            <div className="absolute left-6 top-2 bottom-4 w-0.5 bg-zinc-200" />
            
            <div className='flex flex-col gap-6 relative z-10'>
              {roadmap.modules.map((mod, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-2 w-5 h-5 rounded-full bg-white border-4 border-indigo-500 shadow-sm shrink-0 relative z-10" />
                  <div className="flex-1">
                     <ModuleCard mod={mod} index={i} />
                  </div>
                </div>
              ))}
            </div>
        </div>
    </motion.div>
  );
}

export default RoadmapResult;
