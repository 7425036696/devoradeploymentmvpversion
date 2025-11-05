import React from 'react';

const DevoraLogo = ({ size = 200, className = '' }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Devora Logo"
        >
            {/* Background circle */}
            <circle cx="100" cy="100" r="90" fill="none" stroke="#4F46E5" strokeWidth="3" opacity="0.3" />

            {/* Lightning bolt with gradient */}
            <path
                d="M 60 140 L 100 60 L 90 80 L 120 120 L 110 100 L 140 140 Z"
                fill="url(#boltGradient)"
                stroke="#6366F1"
                strokeWidth="2"
                transform="rotate(-15 100 100)"
            />

            {/* 'D' monogram */}
            <path
                d="M 75 90 Q 85 90 95 100 Q 85 110 75 110 Q 65 110 65 100 Q 65 90 75 90"
                fill="none"
                stroke="#A78BFA"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.8"
            />

            {/* Devora text */}
            <text
                x="100"
                y="170"
                textAnchor="middle"
                fontFamily="Arial, sans-serif"
                fontSize="24"
                fontWeight="bold"
                fill="#4F46E5"
            >
                Devora
            </text>

            {/* Gradient definition */}
            <defs>
                <linearGradient id="boltGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
                </linearGradient>
            </defs>
        </svg>
    );
};

export default DevoraLogo;