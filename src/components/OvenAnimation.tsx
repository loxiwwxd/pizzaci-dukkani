import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Sparkles, SkipForward } from 'lucide-react';
import { sound } from '../utils/audio';

interface OvenAnimationProps {
    bakeProgress: number; // 0 to 1
    onSkip?: () => void;
}

export const OvenAnimation: React.FC<OvenAnimationProps> = ({ bakeProgress, onSkip }) => {
    const [stageText, setStageText] = useState('Fırın ısıtılıyor...');
    const hasPlayedSizzleRef = useRef(false);
    const hasPlayedDoneRef = useRef(false);
    const prevBakeProgressRef = useRef(0);

    useEffect(() => {
        if (!hasPlayedSizzleRef.current && bakeProgress > 0) {
            hasPlayedSizzleRef.current = true;
            sound.playSizzle();
        }

        if (bakeProgress >= 0.95 && prevBakeProgressRef.current < 0.95) {
            setStageText('Pizzanız fırından çıktı!');
            if (!hasPlayedDoneRef.current) {
                hasPlayedDoneRef.current = true;
                sound.playOvenDone();
            }
        } else if (bakeProgress >= 0.7 && bakeProgress < 0.95 && prevBakeProgressRef.current < 0.7) {
            setStageText('Baharatlar ve malzemeler harmanlanıyor...');
        } else if (bakeProgress >= 0.3 && bakeProgress < 0.7 && prevBakeProgressRef.current < 0.3) {
            setStageText('Peynirler eriyor ve hamur kızarıyor...');
        } else if (bakeProgress < 0.3 && prevBakeProgressRef.current >= 0.3) {
            setStageText('Taş fırın derecesi 450°C ayarlanıyor...');
        }
        prevBakeProgressRef.current = bakeProgress;
    }, [bakeProgress]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4 bg-[var(--color-ink)]/80 backdrop-blur-sm"
        >
            {/* Skip Button */}
            {onSkip && (
                <button
                    onClick={onSkip}
                    className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 pill sticker--lime text-xs font-bold text-[var(--color-ink)] hover:opacity-90 transition-opacity shadow-md"
                    aria-label="Animasyonu geç"
                >
                    <SkipForward className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>ANİMASYONU GEÇ</span>
                </button>
            )}

            <div className="diecut max-w-md w-full mx-4 p-6 bg-[var(--color-paper)] text-center flex flex-col items-center shadow-2xl">
                <div className="w-16 h-16 rounded-full sticker--pink flex items-center justify-center mb-4">
                    <Flame className="w-8 h-8 text-[var(--color-accent-ink)]" aria-hidden="true" />
                </div>

                <h2 className="font-display text-xl text-[var(--color-ink)] mb-1 uppercase tracking-wide">
                    Pizzanız taş fırında pişiriliyor
                </h2>
                <p className="text-[var(--color-accent)] font-bold text-xs mb-6 uppercase tracking-wider">
                    {stageText}
                </p>

                {/* Progress Bar Container */}
                <div className="w-full bg-[var(--color-paper-2)] rounded-full h-4 p-1 border-2 border-[var(--color-ink)] mb-6 overflow-hidden">
                    <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: `${Math.min(100, bakeProgress * 100)}%` }}
                        transition={{ ease: 'easeOut' }}
                        className="h-full rounded-full sticker--pink border-none"
                    />
                </div>

                <div className="flex items-center gap-3 text-xs font-bold sticker--lime px-4 py-2 border-2 border-[var(--color-ink)]">
                    <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5" aria-hidden="true" /> 450°C Taş Fırın
                    </span>
                    <div className="w-px h-3 bg-[var(--color-ink)] opacity-40" />
                    <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> %{Math.floor(bakeProgress * 100)}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};
