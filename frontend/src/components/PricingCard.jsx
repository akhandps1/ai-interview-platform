/**
 * FILE: frontend/src/components/PricingCard.jsx
 * PURPOSE: A reusable UI component for displaying Razorpay subscription and credit packages.
 */
import React from 'react';
import { FiCheck } from 'react-icons/fi';
import { GiTwoCoins } from 'react-icons/gi';
import { motion } from "motion/react";

function PricingCard({
    title, price, coins, button, features, popular, disabled, onBuy
}) {
    return (
        <motion.div 
            whileHover={{ y: -4 }}
            className={`relative w-full max-w-[320px] rounded-2xl overflow-hidden border p-6 transition-all ${
                popular 
                ? "border-indigo-500 bg-white shadow-xl shadow-indigo-100 scale-105 z-10" 
                : "border-zinc-200 bg-white shadow-sm"
            }`}>
            
            {popular && (
                <div className='absolute right-4 top-4 rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-bold text-indigo-700 tracking-wider uppercase'>
                    Most Popular
                </div>
            )}
            
            <h2 className='text-lg font-bold text-zinc-900'>{title}</h2>

            <div className='mt-4 flex items-end gap-1.5'>
                {price !== "Free" && <span className='pb-1 text-lg font-semibold text-zinc-400'>₹</span>}
                <span className='text-4xl font-extrabold text-zinc-900'>{price}</span>
            </div>

            <div className={`mt-5 flex items-center gap-2 rounded-xl p-3 ${popular ? 'bg-indigo-50 border border-indigo-100' : 'bg-zinc-50 border border-zinc-100'}`}>
                <GiTwoCoins className={popular ? "text-indigo-600" : "text-amber-500"} size={18}/>
                <span className={`text-sm font-bold ${popular ? "text-indigo-900" : "text-zinc-700"}`}>
                    {coins} Interview Credits
                </span>
            </div>

            <div className='mt-6 space-y-3 mb-6'>
                {features.map((f)=>(
                    <div key={f} className='flex items-center gap-2 text-sm text-zinc-600'>
                        <FiCheck className="text-emerald-500 shrink-0" size={16} strokeWidth={3} />
                        <span>{f}</span>
                    </div>
                ))}
            </div>

            <button 
                disabled={disabled}
                onClick={onBuy}
                className={`mt-auto w-full rounded-xl py-3 text-sm font-bold transition-all active:scale-[0.98] ${
                    disabled
                        ? "cursor-not-allowed bg-zinc-100 text-zinc-400"
                        : popular
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg"
                        : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 shadow-sm"
                }`}>
                {button}
            </button>
        </motion.div>
    );
}

export default PricingCard;
