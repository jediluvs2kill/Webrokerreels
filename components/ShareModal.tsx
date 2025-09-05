
import React, { useState } from 'react';
import CloseIcon from './icons/CloseIcon';
import CopyIcon from './icons/CopyIcon';
import TwitterIcon from './icons/TwitterIcon';
import FacebookIcon from './icons/FacebookIcon';
import WhatsappIcon from './icons/WhatsappIcon';

interface ShareModalProps {
    url: string;
    title: string;
    onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ url, title, onClose }) => {
    const [copyButtonText, setCopyButtonText] = useState('Copy');

    const handleCopy = () => {
        navigator.clipboard.writeText(url).then(() => {
            setCopyButtonText('Copied!');
            setTimeout(() => setCopyButtonText('Copy'), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy link.');
        });
    };
    
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-heading"
        >
            <div
                className="bg-gray-800 p-6 rounded-lg shadow-xl w-11/12 max-w-sm text-white"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 id="share-heading" className="text-xl font-bold">Share Property</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close">
                        <CloseIcon />
                    </button>
                </div>

                <p className="text-sm text-gray-400 mb-4">Share this link via</p>
                <div className="flex justify-around items-center mb-6">
                    <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors" aria-label="Share on Twitter">
                        <TwitterIcon />
                    </a>
                     <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-500 transition-colors" aria-label="Share on Facebook">
                        <FacebookIcon />
                    </a>
                     <a href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-green-500 transition-colors" aria-label="Share on WhatsApp">
                        <WhatsappIcon />
                    </a>
                </div>

                <p className="text-sm text-gray-400 mb-2">Or copy link</p>
                <div className="flex gap-2 items-center p-2 bg-gray-900 rounded-md border border-gray-700">
                    <input
                        type="text"
                        value={url}
                        readOnly
                        className="flex-grow bg-transparent text-gray-300 outline-none text-sm"
                        aria-label="Shareable link"
                    />
                    <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition">
                        <CopyIcon />
                        {copyButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
