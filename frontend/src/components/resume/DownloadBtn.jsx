/**
 * FILE: frontend/src/components/resume/DownloadBtn.jsx
 * PURPOSE: Core logic and configuration for DownloadBtn.jsx.
 */
import toast from 'react-hot-toast';
import React from 'react';
import { FiDownload } from 'react-icons/fi';
import { useReactToPrint } from "react-to-print";
import { useCoins } from '../../apis/user.api';

function DownloadBtn({ docRef, user, setUser, className }) {
    const handlePdf = useReactToPrint({
        contentRef: docRef,
        documentTitle: "NexHire_Resume"
    });

    const handleDownload = async () => {
        try {
            const coinResponse = await useCoins({ coins: 10, action: "download-pdf" });
            await handlePdf();
            setUser((prev) => ({
                ...prev, interviewCoin: coinResponse?.interviewCoin,
            }));
        } catch (error) {
            if (error.response?.status === 403) {
                return toast.error("Not enough Interview Coins.");
            }
            toast(
                error.response?.data?.message ||
                "Something went wrong."
            );
        }
    };

    return (
        <button 
            onClick={handleDownload} 
            className={`flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 shadow-sm px-4 py-2 text-sm font-medium text-white transition-all active:scale-95 ${className || ''}`}>
            <FiDownload size={16} />
            <span className="hidden sm:inline">Download PDF</span>
        </button>
    );
}

export default DownloadBtn;
