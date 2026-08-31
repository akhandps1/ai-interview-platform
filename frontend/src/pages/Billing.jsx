/**
 * FILE: frontend/src/pages/Billing.jsx
 * PURPOSE: UI for purchasing interview coins. It displays pricing plans and handles 
 * the frontend integration with Razorpay checkout popup.
 */
import { useOutletContext } from 'react-router-dom';
import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { motion } from "motion/react";
import { FiSidebar, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { GiTwoCoins } from 'react-icons/gi';
import PricingCard from '../components/PricingCard';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const plan = [
    {
        title: "Free",
        price: "Free",
        coins: 150,
        button: "Current Plan",
        popular: false,
        disabled: true,
        features: [
            "150 Interview Coins",
            "Resume Builder",
            "Resume Scorer",
            "Roadmap Generator",
        ],
    },
    {
        title: "Starter",
        price: "199",
        coins: 300,
        button: "Upgrade Now",
        popular: true,
        disabled: false,
        features: [
            "300 Interview Coins",
            "Unlimited Resume Score",
            "Unlimited Roadmaps",
            "Priority AI Response",
        ],
    },
];

function Billing() {
  const { user, setUser, sidebarOpen, setSidebarOpen, moblieOpen, setMoblieOpen } = useOutletContext();
    const navigate = useNavigate();

    const handlePayment = async (plan) => {
        if (plan.disabled) return;
        try {
            const result = await api.post("/api/billing/create", { planId: plan.title.toLowerCase() });
            
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: result.data.order.amount,
                currency: result.data.order.currency,
                name: "NexHire",
                description: `${plan.title} - ${plan.coins} Interview Credits`,
                order_id: result.data.order.id,
                handler: async function (response) {
                    try {
                        await api.post("/api/billing/verify", response);
                        const coinRes = await api.post("/api/auth/add-coins", { coins: plan.coins });
                        setUser((prev) => ({
                            ...prev, interviewCoin: coinRes.data.interviewCoin
                        }));
                        toast.success("Payment Successful 🎉");
                        navigate("/dashboard");
                    } catch (error) {
                        console.log(error);
                        toast.error(error?.response?.data?.message || "Payment verification failed");
                    }
                },
                theme: { color: "#4F46E5" }, // Indigo-600
            };
            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='font-sans text-zinc-900 flex flex-col w-full h-full relative z-10'>
            {/* Header */}
            <div className='px-4 sm:px-6 md:px-8 py-6 md:py-8 transition-all duration-300 w-full'>
          <div className='flex items-center justify-between mb-8'>
            <div className='flex items-center gap-3'>
              <button onClick={() => setMoblieOpen(true)} className='md:hidden text-zinc-500 hover:text-zinc-900 bg-white border border-zinc-200 p-1.5 rounded-md transition-colors'>
                <FiSidebar size={18} />
              </button>
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <p className='text-zinc-500 text-xs font-medium mb-1 uppercase tracking-wider'>Account</p>
                <h2 className='text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight'>
                  Billing & Credits
                </h2>
              </motion.div>
            </div>
          </div>
        </div>


            <div className='mx-auto max-w-5xl px-4 py-6 sm:px-6 flex flex-col items-center'>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-center mb-12">
                    <div className='inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-semibold text-xs mb-6'>
                        <GiTwoCoins size={14} /> Current Balance: {user?.interviewCoin || 0} Credits
                    </div>
                    <h1 className='text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-4'>
                        Simple, transparent pricing
                    </h1>
                    <p className='text-zinc-500 text-lg max-w-lg mx-auto'>
                        Top up your credits to continue practicing interviews and generating roadmaps.
                    </p>
                </motion.div>

                <div className='flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 w-full max-w-3xl'>
                    {plan.map((p, index) => (
                        <motion.div 
                            key={p.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex-1 w-full flex justify-center">
                            <PricingCard 
                                {...p} 
                                onBuy={() => handlePayment(p)} 
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Trust Section */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-16 flex items-center justify-center gap-6 text-zinc-400 text-sm">
                    <div className="flex items-center gap-2"><FiCheckCircle size={16} className="text-emerald-500" /> Secure Payment</div>
                    <div className="flex items-center gap-2"><FiCheckCircle size={16} className="text-emerald-500" /> Instant Credits</div>
                </motion.div>

            </div>
        </div>
    );
}
export default Billing;
