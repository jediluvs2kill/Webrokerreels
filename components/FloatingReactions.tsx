
import React, { useEffect, useState } from 'react';
import type { Reaction } from '../types';

interface FloatingReactionsProps {
    reactions: Reaction[];
    onAnimationEnd: (id: string) => void;
}

const FloatingReaction: React.FC<{ reaction: Reaction, onAnimationEnd: (id: string) => void }> = ({ reaction, onAnimationEnd }) => {
    const [position, setPosition] = useState({ bottom: 20, right: 20, opacity: 1 });
    
    useEffect(() => {
        // Randomize horizontal position
        const right = Math.random() * 80 + 10; // 10% to 90% from the right
        setPosition(prev => ({ ...prev, right }));

        const timeout1 = setTimeout(() => {
            setPosition(prev => ({ ...prev, bottom: window.innerHeight * 0.7, opacity: 0 }));
        }, 100);

        const timeout2 = setTimeout(() => {
            onAnimationEnd(reaction.id);
        }, 3000); // Remove after 3 seconds

        return () => {
            clearTimeout(timeout1);
            clearTimeout(timeout2);
        };
    }, [reaction.id, onAnimationEnd]);
    
    return (
        <span
            className="absolute text-5xl transition-all duration-[3000ms] ease-out"
            style={{
                bottom: `${position.bottom}px`,
                right: `${position.right}%`,
                opacity: position.opacity,
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            }}
        >
            {reaction.emoji}
        </span>
    );
};


const FloatingReactions: React.FC<FloatingReactionsProps> = ({ reactions, onAnimationEnd }) => {
    return (
        <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
            {reactions.map(reaction => (
                <FloatingReaction key={reaction.id} reaction={reaction} onAnimationEnd={onAnimationEnd} />
            ))}
        </div>
    );
};

export default FloatingReactions;
