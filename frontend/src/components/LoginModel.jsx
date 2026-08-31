/**
 * FILE: frontend/src/components/LoginModel.jsx
 * PURPOSE: A modal that triggers Firebase Google Authentication. 
 * Receives the Firebase ID token and passes it to the backend to create/authenticate the user.
 */
import React from 'react';
import { FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import api from '../utils/axios';

function LoginModel({ onClose, setUser }) {
    const handleGoogleAuth = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const token = await result.user.getIdToken();
            const response = await api.post("/api/auth/login", { token });
            setUser(response?.data?.user);
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm px-4'>
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 10 }}
                    className='relative w-full max-w-sm bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-2xl'>
                    
                    <div className='relative p-8'>
                        <button
                            onClick={onClose}
                            className='absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 transition-colors p-1 rounded-md hover:bg-zinc-100'>
                            <FiX size={18} />
                        </button>

                        <div className="text-center mb-6">
                            <h2 className='text-2xl font-bold text-zinc-900 mb-1'>
                                Welcome Back
                            </h2>
                            <p className='text-zinc-500 text-sm'>
                                Sign in to continue your journey
                            </p>
                        </div>

                        <div className='mt-6'>
                            <button
                                onClick={handleGoogleAuth}
                                className='w-full flex items-center justify-center gap-3 py-2.5 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700 font-medium text-sm shadow-sm transition-all active:scale-[0.98]'
                            >
                                <FcGoogle size={18} />
                                <span>Continue with Google</span>
                            </button>
                        </div>
                    </div>

                    <div className='border-t border-zinc-100 bg-zinc-50/50 p-4 text-center'>
                        <p className='text-zinc-400 text-xs'>
                            Secure authentication powered by Google
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default LoginModel;
