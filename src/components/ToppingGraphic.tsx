import React from 'react';

interface ToppingGraphicProps {
    id: string;
    size?: number;
    className?: string;
    isBaked?: boolean;
}

export const ToppingGraphic: React.FC<ToppingGraphicProps> = ({
    id,
    size = 36,
    className = '',
    isBaked = false,
}) => {
    const bakedFilter = isBaked ? 'brightness(0.85) contrast(1.1) saturate(1.1)' : 'none';

    switch (id) {
        case 'sucuk':
            return (
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 40 40"
                    className={className}
                    style={{ filter: bakedFilter }}
                    aria-hidden="true"
                >
                    <circle cx="20" cy="20" r="18" fill="#991B1B" stroke="#5B1111" strokeWidth="1.5" />
                    <circle cx="20" cy="20" r="16.5" fill="#B91C1C" />
                    <circle cx="13" cy="14" r="2" fill="#FED7AA" opacity="0.8" />
                    <circle cx="26" cy="12" r="1.8" fill="#FFE4E6" opacity="0.8" />
                    <circle cx="22" cy="25" r="2.2" fill="#FED7AA" opacity="0.8" />
                    <circle cx="12" cy="24" r="1.5" fill="#FFFFFF" opacity="0.7" />
                    <circle cx="28" cy="22" r="1.6" fill="#FED7AA" opacity="0.8" />
                    <circle cx="18" cy="18" r="1.8" fill="#FFE4E6" opacity="0.7" />
                    <circle cx="16" cy="10" r="1" fill="#450A0A" />
                    <circle cx="24" cy="28" r="1" fill="#450A0A" />
                </svg>
            );

        case 'mushroom':
            return (
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 40 40"
                    className={className}
                    style={{ filter: bakedFilter }}
                    aria-hidden="true"
                >
                    <path
                        d="M 8 22 C 8 10, 32 10, 32 22 C 32 25, 8 25, 8 22 Z"
                        fill="#D97706"
                        stroke="#78350F"
                        strokeWidth="1.5"
                    />
                    <path d="M 10 21 C 12 13, 28 13, 30 21" fill="#FEF3C7" opacity="0.7" />
                    <path
                        d="M 16 22 L 16 32 C 16 34, 24 34, 24 32 L 24 22 Z"
                        fill="#FEF3C7"
                        stroke="#78350F"
                        strokeWidth="1.2"
                    />
                </svg>
            );

        case 'olive':
            return (
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 40 40"
                    className={className}
                    style={{ filter: bakedFilter }}
                    aria-hidden="true"
                >
                    <circle cx="20" cy="20" r="16" fill="#18181B" stroke="#09090B" strokeWidth="1.5" />
                    <circle cx="20" cy="20" r="6.5" fill="#EF4444" opacity="0.2" />
                    <circle cx="20" cy="20" r="6" fill="#18181B" />
                    <ellipse cx="14" cy="14" rx="4" ry="2.5" fill="#71717A" opacity="0.6" transform="rotate(-30 14 14)" />
                </svg>
            );

        case 'pepper':
            return (
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 40 40"
                    className={className}
                    style={{ filter: bakedFilter }}
                    aria-hidden="true"
                >
                    <path
                        d="M 8 20 C 8 8, 32 8, 32 20 C 32 30, 24 34, 18 34 C 12 34, 8 28, 8 20 Z"
                        fill="none"
                        stroke="#15803D"
                        strokeWidth="6"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 8 20 C 8 8, 32 8, 32 20 C 32 30, 24 34, 18 34 C 12 34, 8 28, 8 20 Z"
                        fill="none"
                        stroke="#22C55E"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                </svg>
            );

        case 'corn':
            return (
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 40 40"
                    className={className}
                    style={{ filter: bakedFilter }}
                    aria-hidden="true"
                >
                    <g transform="translate(4,4)">
                        <ellipse cx="12" cy="12" rx="7" ry="9" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.2" transform="rotate(-15 12 12)" />
                        <ellipse cx="10" cy="10" rx="2.5" ry="4" fill="#FEF08A" opacity="0.8" transform="rotate(-15 10 10)" />
                        <ellipse cx="22" cy="20" rx="6" ry="8" fill="#EAB308" stroke="#A16207" strokeWidth="1.2" transform="rotate(20 22 20)" />
                    </g>
                </svg>
            );

        case 'basil':
            return (
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 40 40"
                    className={className}
                    style={{ filter: bakedFilter }}
                    aria-hidden="true"
                >
                    <path
                        d="M 6 34 C 6 16, 20 6, 34 6 C 34 24, 20 34, 6 34 Z"
                        fill="#166534"
                        stroke="#14532D"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M 6 34 C 16 26, 24 16, 34 6"
                        fill="none"
                        stroke="#4ADE80"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                    <path d="M 16 20 L 22 24" stroke="#4ADE80" strokeWidth="1" opacity="0.7" />
                    <path d="M 22 14 L 27 18" stroke="#4ADE80" strokeWidth="1" opacity="0.7" />
                </svg>
            );

        case 'tomato_slice':
            return (
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 40 40"
                    className={className}
                    style={{ filter: bakedFilter }}
                    aria-hidden="true"
                >
                    <circle cx="20" cy="20" r="17" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
                    <circle cx="20" cy="20" r="14" fill="#DC2626" />
                    <path d="M 12 14 C 16 10, 24 10, 28 14 C 24 18, 16 18, 12 14 Z" fill="#7F1D1D" />
                    <circle cx="16" cy="13" r="1.2" fill="#FDE047" />
                    <circle cx="24" cy="13" r="1.2" fill="#FDE047" />
                    <path d="M 12 26 C 16 30, 24 30, 28 26 C 24 22, 16 22, 12 26 Z" fill="#7F1D1D" />
                    <circle cx="16" cy="27" r="1.2" fill="#FDE047" />
                    <circle cx="24" cy="27" r="1.2" fill="#FDE047" />
                </svg>
            );

        case 'jalapeno':
            return (
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 40 40"
                    className={className}
                    style={{ filter: bakedFilter }}
                    aria-hidden="true"
                >
                    <circle cx="20" cy="20" r="16" fill="#047857" stroke="#064E3B" strokeWidth="2" />
                    <circle cx="20" cy="20" r="10" fill="#065F46" />
                    <circle cx="20" cy="20" r="6" fill="#34D399" opacity="0.3" />
                    <circle cx="17" cy="17" r="1.5" fill="#FEF08A" />
                    <circle cx="23" cy="20" r="1.5" fill="#FEF08A" />
                    <circle cx="18" cy="23" r="1.5" fill="#FEF08A" />
                </svg>
            );

        case 'chicken':
            return (
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 40 40"
                    className={className}
                    style={{ filter: bakedFilter }}
                    aria-hidden="true"
                >
                    <path
                        d="M 8 16 C 10 8, 30 10, 34 18 C 36 26, 26 34, 16 32 C 8 30, 6 22, 8 16 Z"
                        fill="#D97706"
                        stroke="#92400E"
                        strokeWidth="1.5"
                    />
                    <path d="M 12 18 C 16 12, 28 14, 30 20" fill="#FEF3C7" opacity="0.6" />
                    <line x1="12" y1="16" x2="22" y2="28" stroke="#78350F" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                    <line x1="20" y1="14" x2="30" y2="26" stroke="#78350F" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                </svg>
            );

        case 'pastirma':
            return (
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 40 40"
                    className={className}
                    style={{ filter: bakedFilter }}
                    aria-hidden="true"
                >
                    <rect x="6" y="10" width="28" height="20" rx="4" fill="#881337" stroke="#9A3412" strokeWidth="2.5" />
                    <path d="M 8 12 Q 20 18 32 12 T 20 28 Z" fill="#9F1239" />
                    <line x1="9" y1="14" x2="31" y2="14" stroke="#FECDD3" strokeWidth="1" opacity="0.5" />
                    <line x1="9" y1="22" x2="31" y2="22" stroke="#FECDD3" strokeWidth="1" opacity="0.5" />
                </svg>
            );

        case 'pineapple':
            return (
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 40 40"
                    className={className}
                    style={{ filter: bakedFilter }}
                    aria-hidden="true"
                >
                    <polygon points="10,8 32,10 28,32 8,26" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
                    <line x1="10" y1="16" x2="30" y2="20" stroke="#EAB308" strokeWidth="1.5" />
                    <line x1="18" y1="9" x2="16" y2="30" stroke="#EAB308" strokeWidth="1.5" />
                    <circle cx="16" cy="18" r="1.5" fill="#FEF08A" />
                    <circle cx="24" cy="24" r="1.5" fill="#FEF08A" />
                </svg>
            );

        case 'red_onion':
            return (
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 40 40"
                    className={className}
                    style={{ filter: bakedFilter }}
                    aria-hidden="true"
                >
                    <path
                        d="M 6 22 C 6 10, 34 10, 34 22"
                        fill="none"
                        stroke="#86198F"
                        strokeWidth="5"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 6 22 C 6 10, 34 10, 34 22"
                        fill="none"
                        stroke="#E879F9"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            );

        default:
            return (
                <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
                    <circle cx={size / 2} cy={size / 2} r={size / 2 - 2} fill="#F59E0B" />
                </svg>
            );
    }
};
