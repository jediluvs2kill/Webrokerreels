
import React from 'react';

interface HeartIconProps {
  isLiked: boolean;
}

const HeartIcon: React.FC<HeartIconProps> = ({ isLiked }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-8 w-8 drop-shadow-lg transition-all duration-200 ease-in-out transform ${isLiked ? 'scale-110' : 'scale-100'}`}
    fill={isLiked ? 'currentColor' : 'none'}
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
    />
  </svg>
);

export default HeartIcon;
