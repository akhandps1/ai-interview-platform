/**
 * FILE: frontend/src/pages/Home.jsx
 * PURPOSE: The main landing page for NexHire. It showcases the platform's features,
 * provides navigation to login, and explains the different AI agents available to the user.
 */
import React, { useState } from 'react';
import { motion } from "motion/react";
import { FaArrowRight } from "react-icons/fa6";
import { FiMic, FiFileText, FiBarChart2, FiMap } from "react-icons/fi";
import LoginModel from '../components/LoginModel';
import dashboard from "../assets/image.png";

function Home({ setUser }) {
    const [showLogin, setShowLogin] = useState(false);

    return (
        <div className='bg-[#FAFAFA] text-zinc-900 font-sans min-h-screen overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900'>

            {/* Navbar */}
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className='fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 md:px-8 bg-white/80 backdrop-blur-md border-b border-zinc-200'>
                <div className='flex items-center gap-2.5'>
                    <img src="/logo.png" alt="NexHire Logo" className="w-8 h-8 rounded-lg object-contain shadow-sm border border-zinc-200" />
                    <span className='font-bold text-lg tracking-tight text-zinc-900'>NexHire</span>
                </div>
                <div className='flex items-center gap-3'>
                    <button
                        onClick={() => setShowLogin(true)}
                        className='text-zinc-600 hover:text-zinc-900 font-medium px-2 py-1.5 text-sm cursor-pointer transition-colors hidden md:block'>
                        Log In
                    </button>
                    <button
                        onClick={() => setShowLogin(true)}
                        className='bg-zinc-950 hover:bg-zinc-800 text-white font-medium rounded-md px-4 py-1.5 text-sm cursor-pointer transition-colors shadow-sm flex items-center gap-2'>
                        Get Started <FaArrowRight size={12} />
                    </button>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <section className='relative pt-32 pb-20 overflow-hidden'>
                {/* Clean Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-50" />
                
                <div className='max-w-5xl mx-auto px-6 text-center relative z-10'>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.05 }}
                        className='inline-flex items-center px-3 py-1 rounded-full border border-zinc-200 bg-white text-zinc-600 text-xs font-medium mb-6 shadow-sm'>
                        ✨ The Ultimate Multi-Agent Interview Platform
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className='text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6 text-zinc-900'>
                        Ace your interviews with <br className="hidden md:block"/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500">
                            Intelligent AI Agents.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className='text-zinc-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10'>
                        NexHire equips you with specialized agents to review your resume, conduct mock interviews, and build personalized roadmaps to land your dream job.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col items-center justify-center gap-4">
                        <button
                            onClick={() => setShowLogin(true)}
                            className='inline-flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white font-medium px-8 py-3.5 rounded-lg text-sm transition-all shadow-md hover:shadow-lg active:scale-[0.98]'>
                            Start Interviewing For Free <FaArrowRight size={12} />
                        </button>
                        <p className="text-xs text-zinc-400 font-medium">No credit card required • Instant access</p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className='mt-16 rounded-xl overflow-hidden shadow-2xl shadow-indigo-900/10 border border-zinc-200/60 max-w-5xl mx-auto bg-white ring-1 ring-zinc-900/5'>
                    <div className="bg-zinc-100/50 border-b border-zinc-200/60 p-3 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-amber-400" />
                        <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                    <img src={dashboard} alt='Dashboard interface' className='w-full h-auto object-cover block' />
                </motion.div>
            </section>

            {/* Features / Agents Grid */}
            <section className='py-24 bg-white border-t border-zinc-200'>
                <div className='max-w-5xl mx-auto px-6'>
                    <div className='text-center mb-16'>
                        <h2 className='text-3xl md:text-4xl font-bold tracking-tight text-zinc-900'>
                            Specialized Agents For Every Step
                        </h2>
                        <p className='text-zinc-500 text-base md:text-lg max-w-2xl mx-auto mt-4'>
                            Our platform utilizes a suite of AI agents to handle every phase of your career prep.
                        </p>
                    </div>
                    <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
                        {[
                            { icon: <FiFileText size={20} />, title: "Resume Agent", desc: "Create ATS-friendly resumes and maximize opportunities." },
                            { icon: <FiMic size={20} />, title: "Interview Agent", desc: "Realistic HR and Technical simulations with dynamic AI." },
                            { icon: <FiBarChart2 size={20} />, title: "Feedback Agent", desc: "Detailed analysis, scoring reports and actionable recommendations." },
                            { icon: <FiMap size={20} />, title: "Roadmap Agent", desc: "Personalized learning roadmaps based on your performance." },
                        ].map((agent, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className='group relative p-6 bg-[#FAFAFA] border border-zinc-200 rounded-2xl hover:border-emerald-500 hover:shadow-md hover:bg-white transition-all'>
                                <div className='w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform'>
                                    {agent.icon}
                                </div>
                                <h3 className='text-lg font-semibold mb-2 text-zinc-900'>{agent.title}</h3>
                                <p className='text-zinc-500 text-sm leading-relaxed'>{agent.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className='py-24 bg-zinc-950 text-white relative overflow-hidden'>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/30 via-zinc-950 to-zinc-950 pointer-events-none" />
                <div className='max-w-4xl mx-auto px-6 text-center relative z-10'>
                    <h2 className='text-3xl md:text-5xl font-bold tracking-tight mb-6'>
                        Ready to land your dream job?
                    </h2>
                    <p className='text-zinc-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto'>
                        Join NexHire today and start practicing with AI agents that simulate real-world FAANG interviews.
                    </p>
                    <button
                        onClick={() => setShowLogin(true)}
                        className='inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-8 py-4 rounded-lg text-base transition-all shadow-lg active:scale-[0.98]'>
                        Create Free Account
                    </button>
                </div>
            </section>

            {showLogin && <LoginModel onClose={() => setShowLogin(false)} setUser={setUser} />}

            <footer className='border-t border-zinc-200 py-10 text-center bg-[#FAFAFA] flex flex-col items-center justify-center'>
                <div className='flex items-center justify-center gap-2 mb-3'>
                    <img src="/logo.png" alt="NexHire Logo" className="w-6 h-6 rounded-md object-contain border border-zinc-200" />
                    <span className='font-bold text-sm text-zinc-900'>NexHire</span>
                </div>
                <div className='text-zinc-400 text-xs font-medium'>
                    © {new Date().getFullYear()} NexHire. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

export default Home;
