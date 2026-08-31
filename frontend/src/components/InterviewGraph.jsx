/**
 * FILE: frontend/src/components/InterviewGraph.jsx
 * PURPOSE: Core logic and configuration for InterviewGraph.jsx.
 */
import React from 'react';
import { motion } from "motion/react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';

function CustomTooltip({ active, payload }) {
    if (active && payload?.length) {
        return (
            <div className='bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 shadow-lg'>
                <p className="text-zinc-500 mb-1 font-medium">{payload[0]?.payload?.skill}</p>
                <p className="font-bold text-zinc-900">{payload[0]?.value}%</p>
            </div>
        );
    }
    return null;
}

function RadarCard({ title, data, color, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 + index * 0.1 }}
            className='bg-white border border-zinc-200 rounded-xl p-4 md:p-5 flex flex-col shadow-sm hover:shadow-md transition-shadow'
        >
            <div className='relative'>
                <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
                        <PolarGrid stroke="#E4E4E7" gridType="circle" />
                        <PolarAngleAxis dataKey="skill"
                            tick={{ fill: "#71717A", fontSize: 10, fontWeight: 500 }} />
                        <Radar
                            name={title}
                            dataKey="score"
                            stroke={color}
                            fill={color}
                            fillOpacity={0.1}
                            strokeWidth={2}
                            dot={{ r: 3, fill: color, strokeWidth: 0 }} />
                        <Tooltip content={<CustomTooltip/>}/>
                    </RadarChart>
                </ResponsiveContainer>
                <p className='text-zinc-800 font-semibold text-sm text-center mt-3'>
                    {title}
                </p>
            </div>
        </motion.div>
    );
}

function InterviewGraph({ technicalData, hrData, technicalCount, hrCount }) {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5'>
            <RadarCard title={`Technical Interviews (${technicalCount})`}
                data={technicalData} color="#4F46E5" index={0} /* Indigo-600 */
            />
            <RadarCard title={`HR Interviews (${hrCount})`}
                data={hrData} color="#059669" index={1} /* Emerald-600 */
            />
        </div>
    );
}

export default InterviewGraph;
