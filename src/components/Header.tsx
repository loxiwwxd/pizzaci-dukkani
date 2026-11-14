import React, { useState } from 'react';
import { Flame, Volume2, VolumeX, Shuffle, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
    onRandomize: () => void;
    onReset: () => void;
    totalToppings: number;
}

export const Header: React.FC<HeaderProps> = ({ onRandomize, onReset, totalToppings }) => {
    const [isMuted, setIsMuted] = useState(sound.getMuted());

    const handleToggleSound = () => {
        const nextState = sound.toggleMute();
        setIsMuted(nextState);
        if (!nextState) {
            sound.playPop();
        }
    };

    return (
        <header className="w-full bg-[var(--color-ink)] px-4 py-0 sticky top-0 z-[var(--z-sticky-nav)]">
            <div className="max-w-[var(--container)] mx-auto flex items-center justify-between h-14">
                {/* Brand Wordmark */}
                <div className="flex items-center gap-3">
                    <div className="sticker--pink w-9 h-9 flex items-center justify-center" style={{ borderRadius: 'var(--radius-card)' }}>
                        <Flame className="w-5 h-5 text-[var(--color-accent-ink)]" aria-hidden="true" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="font-display text-sm leading-none text-[var(--color-paper)] tracking-wide uppercase">
                            Kenar Pizzacısı
                        </h1>
                        <span className="font-body text-[10px] text-[var(--color-muted)] block mt-0.5 tracking-wide">
                            1453'ten beri...
                        </span>
                    </div>
                </div>

                {/* Quick Toolbar Actions */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {totalToppings > 0 && (
                        <div className="hidden sm:flex sticker--lime items-center px-2.5 py-1" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.02em' }}>
                            <span className="font-body">{totalToppings} MALZEME EKLI</span>
                        </div>
                    )}

                    {/* Audio Toggle */}
                    <button
                        onClick={handleToggleSound}
                        className={`pill pill flex items-center gap-1.5 text-xs font-semibold h-8 px-3 transition-all ${isMuted
                            ? 'bg-[var(--color-paper)] text-[var(--color-ink)] border-2 border-[var(--color-ink)]'
                            : 'sticker--pink border-none'
                            }`}
                        title={isMuted ? 'Sesleri Aç' : 'Sesleri Kapat'}
                    >
                        {isMuted ? <VolumeX className="w-4 h-4" aria-hidden="true" /> : <Volume2 className="w-4 h-4" aria-hidden="true" />}
                        <span className="hidden md:inline font-body text-xs">{isMuted ? 'SESSİZ' : 'SES AÇIK'}</span>
                    </button>

                    {/* Randomize Pizza Button */}
                    <button
                        onClick={() => {
                            onRandomize();
                            sound.playPop();
                        }}
                        className="pill pill flex items-center gap-1.5 text-xs font-semibold h-8 px-3 bg-[var(--color-paper)] text-[var(--color-ink)] border-2 border-[var(--color-ink)] hover:bg-[var(--color-paper-3)] transition-colors"
                        title="Şansına Rastgele Pizza Oluştur"
                    >
                        <Shuffle className="w-4 h-4 text-[var(--color-accent)]" aria-hidden="true" />
                        <span className="hidden sm:inline font-body">Rastgele</span>
                    </button>

                    {/* Reset Pizza Button */}
                    <button
                        onClick={() => {
                            onReset();
                            sound.playRemove();
                        }}
                        className="h-8 w-8 flex items-center justify-center rounded-full bg-[var(--color-paper)] text-[var(--color-muted)] hover:text-[var(--color-ink)] border-2 border-[var(--color-ink)] hover:bg-[var(--color-paper-3)] transition-colors"
                        title="Sıfırla"
                    >
                        <RotateCcw className="w-4 h-4" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </header>
    );
};
