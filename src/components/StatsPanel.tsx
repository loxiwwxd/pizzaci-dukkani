import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Clock, PieChart } from 'lucide-react';
import { sound } from '../utils/audio';

interface StatsPanelProps {
    totalPrice: number;
    totalCalories: number;
    toppingCount: number;
    onBakePizza: () => void;
    isBaking?: boolean;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
    totalPrice,
    totalCalories,
    toppingCount,
    onBakePizza,
    isBaking = false,
}) => {
    const carbs = Math.round((totalCalories * 0.45) / 4);
    const protein = Math.round((totalCalories * 0.2) / 4);
    const fat = Math.round((totalCalories * 0.35) / 9);

    return (
        <div className="diecut w-full bg-[var(--color-paper-2)] p-4 shadow-sm flex flex-col justify-between">
            <div>
                {/* Price & Calories Header Banner */}
                <div className="flex items-center justify-between pb-3.5 border-b-2 border-dashed border-[var(--color-rule)]">
                    <div>
                        <span className="text-xs text-[var(--color-muted)] font-semibold block uppercase tracking-wide">Toplam tutar</span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                            <motion.span
                                key={totalPrice}
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                className="font-display text-3xl text-[var(--color-ink)]"
                            >
                                {totalPrice}
                            </motion.span>
                            <span className="font-display text-lg text-[var(--color-accent)]">₺</span>
                        </div>
                    </div>

                    <div className="text-right">
                        <span className="text-xs text-[var(--color-muted)] font-semibold block uppercase tracking-wide">Enerji değeri</span>
                        <div className="flex items-center justify-end gap-1.5 mt-0.5 text-[var(--color-ink)]">
                            <Flame className="w-4 h-4 text-[var(--color-accent)]" aria-hidden="true" />
                            <motion.span
                                key={totalCalories}
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                className="font-display text-2xl font-mono"
                            >
                                {totalCalories}
                            </motion.span>
                            <span className="text-xs text-[var(--color-muted)]">kcal</span>
                        </div>
                    </div>
                </div>

                {/* Nutritional & Preparation Specs Grid */}
                <div className="grid grid-cols-3 gap-2 my-3.5">
                    <div className="bg-[var(--color-paper)] p-2 rounded-[var(--radius-card)] border-2 border-[var(--color-ink)] text-center shadow-xs">
                        <span className="text-[10px] text-[var(--color-muted)] font-bold block uppercase">Karbonhidrat</span>
                        <span className="font-bold text-xs text-[var(--color-ink)] font-mono">{carbs}g</span>
                    </div>
                    <div className="bg-[var(--color-paper)] p-2 rounded-[var(--radius-card)] border-2 border-[var(--color-ink)] text-center shadow-xs">
                        <span className="text-[10px] text-[var(--color-muted)] font-bold block uppercase">Protein</span>
                        <span className="font-bold text-xs text-[var(--color-ink)] font-mono">{protein}g</span>
                    </div>
                    <div className="bg-[var(--color-paper)] p-2 rounded-[var(--radius-card)] border-2 border-[var(--color-ink)] text-center shadow-xs">
                        <span className="text-[10px] text-[var(--color-muted)] font-bold block uppercase">Yağ</span>
                        <span className="font-bold text-xs text-[var(--color-ink)] font-mono">{fat}g</span>
                    </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[var(--color-ink)] sticker--lime px-3 py-2 border-2 border-[var(--color-ink)] mb-4">
                    <span className="flex items-center gap-1.5 font-bold">
                        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                        Hazırlama: <strong>12-15 dk</strong>
                    </span>
                    <span className="flex items-center gap-1.5 font-bold">
                        <PieChart className="w-3.5 h-3.5" aria-hidden="true" />
                        Malzeme: <strong>{toppingCount} parça</strong>
                    </span>
                </div>
            </div>

            {/* Main Bake Pizza Action Button */}
            <button
                disabled={isBaking}
                onClick={() => {
                    onBakePizza();
                    sound.playSizzle();
                }}
                className="w-full py-4 rounded-[var(--radius-card)] sticker--pink font-display text-sm tracking-wider uppercase shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
                <Flame className="w-5 h-5 text-[var(--color-accent-ink)]" aria-hidden="true" />
                <span>Fırına ver & Sipariş et</span>
            </button>
        </div>
    );
};
