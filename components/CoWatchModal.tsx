
import React, { useState } from 'react';
import CloseIcon from './icons/CloseIcon';
import CopyIcon from './icons/CopyIcon';

interface CoWatchModalProps {
    shareLink: string;
    onClose: () => void;
}

const CoWatchModal: React.FC<CoWatchModalProps> = ({ shareLink, onClose }) => {
    const [copyButtonText, setCopyButtonText] = useState('Copy');

    const handleCopy = () => {
        navigator.clipboard.writeText(shareLink).then(() => {
            setCopyButtonText('Copied!');
            setTimeout(() => setCopyButtonText('Copy'), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy link.');
        });
    };

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cowatch-heading"
        >
            <div
                className="bg-gray-800 p-6 rounded-lg shadow-xl w-11/12 max-w-sm text-white"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 id="cowatch-heading" className="text-xl font-bold">Watch Together</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close">
                        <CloseIcon />
                    </button>
                </div>
                <p className="text-gray-300 mb-4">
                    Send this link to a friend to watch this reel together and react in real-time.
                </p>

                <div className="flex gap-2 items-center p-2 bg-gray-900 rounded-md border border-gray-700">
                    <input
                        type="text"
                        value={shareLink}
                        readOnly
                        className="flex-grow bg-transparent text-gray-300 outline-none text-sm"
                        aria-label="Co-watching session link"
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

export default CoWatchModal;
