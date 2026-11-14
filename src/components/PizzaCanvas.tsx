import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Grid } from 'lucide-react';
import type { CrustType, SauceType, CheeseType, PlacedTopping } from '../types/pizza';
import { CRUST_OPTIONS, SAUCE_OPTIONS, CHEESE_OPTIONS } from '../data/pizzaData';
import { ToppingGraphic } from './ToppingGraphic';
import { sound } from '../utils/audio';

const MAX_SAFE_RADIUS = 37;

const clampToCircularBoundary = (x: number, y: number, maxRadius = MAX_SAFE_RADIUS): { x: number; y: number } => {
    const dist = Math.hypot(x, y);
    if (dist <= maxRadius || dist === 0) {
        return { x, y };
    }
    const factor = maxRadius / dist;
    return {
        x: x * factor,
        y: y * factor,
    };
};

interface PizzaCanvasProps {
    crust: CrustType;
    sauce: SauceType;
    cheese: CheeseType;
    placedToppings: PlacedTopping[];
    activeToppingToPlace: string | null;
    onPlaceTopping: (x: number, y: number, toppingId?: string) => void;
    onUpdateToppingPos: (id: string, x: number, y: number) => void;
    onRemoveTopping: (id: string) => void;
    onClearToppings: () => void;
    isBaking?: boolean;
    bakeProgress?: number;
    readOnly?: boolean;
}

export const PizzaCanvas: React.FC<PizzaCanvasProps> = ({
    crust,
    sauce,
    cheese,
    placedToppings,
    activeToppingToPlace,
    onPlaceTopping,
    onUpdateToppingPos,
    onRemoveTopping,
    onClearToppings,
    isBaking = false,
    bakeProgress = 0,
    readOnly = false,
}) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [showSlices, setShowSlices] = useState(false);
    const [hoveredToppingId, setHoveredToppingId] = useState<string | null>(null);
    const [canvasWidth, setCanvasWidth] = useState(0);
    const isDraggingRef = useRef(false);
    const pointerDownPosRef = useRef<{ x: number; y: number } | null>(null);

    const crustData = CRUST_OPTIONS.find((c) => c.id === crust) || CRUST_OPTIONS[0];
    const sauceData = SAUCE_OPTIONS.find((s) => s.id === sauce) || SAUCE_OPTIONS[0];
    const cheeseData = CHEESE_OPTIONS.find((ch) => ch.id === cheese) || CHEESE_OPTIONS[0];

    useEffect(() => {
        const el = canvasRef.current;
        if (!el) return;
        const update = () => setCanvasWidth(el.offsetWidth);
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const radius = canvasWidth / 2;

    const bakedCrustColor = isBaking
        ? `rgb(${Math.floor(217 - bakeProgress * 60)}, ${Math.floor(119 - bakeProgress * 40)}, ${Math.floor(6 - bakeProgress * 2)})`
        : crustData.color;

    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isBaking || readOnly) return;
        if (!canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const currentRadius = rect.width / 2;
        const dropX = e.clientX - (rect.left + currentRadius);
        const dropY = e.clientY - (rect.top + currentRadius);

        const rawX = (dropX / currentRadius) * 50;
        const rawY = (dropY / currentRadius) * 50;
        const { x: clampedX, y: clampedY } = clampToCircularBoundary(rawX, rawY);

        const toppingIdToUse = activeToppingToPlace;
        if (toppingIdToUse) {
            onPlaceTopping(clampedX, clampedY, toppingIdToUse);
            sound.playPop();
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (isBaking || readOnly) return;
        if (!canvasRef.current) return;

        const toppingId = e.dataTransfer.getData('text/plain');
        if (!toppingId) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const currentRadius = rect.width / 2;
        const dropX = e.clientX - (rect.left + currentRadius);
        const dropY = e.clientY - (rect.top + currentRadius);

        const rawX = (dropX / currentRadius) * 50;
        const rawY = (dropY / currentRadius) * 50;
        const { x: clampedX, y: clampedY } = clampToCircularBoundary(rawX, rawY);

        onPlaceTopping(clampedX, clampedY, toppingId);
        sound.playPop();
    };

    return (
        <div className={`relative flex flex-col items-center justify-center w-full max-w-[540px] mx-auto select-none ${readOnly ? 'p-2' : 'p-3'}`}>
            {/* Sticker Die-cut Board Frame */}
            {!readOnly && (
                <div className="absolute inset-0 diecut bg-[var(--color-paper-2)] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-3 border-2 border-dashed border-[var(--color-ink)] rounded-[var(--radius-card)] bg-[var(--color-paper)] opacity-60" />
                </div>
            )}

            {/* Main Interactive Pizza Area */}
            <div
                ref={canvasRef}
                onClick={handleCanvasClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`${activeToppingToPlace ? 'cursor-crosshair' : 'cursor-pointer'} relative w-[82%] aspect-square rounded-full flex items-center justify-center transition-transform duration-200 z-10`}
                style={{
                    boxShadow: readOnly ? 'none' : '0 8px 0 var(--color-ink)',
                    border: readOnly ? 'none' : '4px solid var(--color-ink)'
                }}
            >
                {/* 1. CRUST BASE LAYER */}
                <motion.div
                    animate={{ scale: isBaking ? [1, 1.02, 1] : 1 }}
                    transition={{ repeat: isBaking ? Infinity : 0, duration: 1.5 }}
                    className="absolute inset-0 rounded-full border-4 border-[var(--color-ink)] overflow-hidden"
                    style={{
                        backgroundColor: bakedCrustColor,
                    }}
                >
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(var(--color-ink)_1.5px,transparent_1.5px)] [background-size:14px_14px]" />
                </motion.div>

                {/* 2. SAUCE LAYER */}
                {sauce !== 'none' && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute rounded-full overflow-hidden"
                        style={{
                            width: '84%',
                            height: '84%',
                            backgroundColor: sauceData.color,
                        }}
                    >
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,var(--color-paper)_0,transparent_70%)]" />
                    </motion.div>
                )}

                {/* 3. CHEESE LAYER */}
                {cheese !== 'none' && (
                    <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{
                            scale: isBaking ? 1.01 : 1,
                            opacity: cheeseData.opacity,
                        }}
                        transition={{ duration: 0.3 }}
                        className="absolute rounded-full overflow-hidden"
                        style={{
                            width: '78%',
                            height: '78%',
                            backgroundColor: cheeseData.color,
                        }}
                    >
                        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(var(--color-ink)_2px,transparent_2px)] [background-size:16px_16px]" />
                    </motion.div>
                )}

                {/* 4. PLACED TOPPINGS LAYER */}
                <div className="absolute inset-0 pointer-events-none">
                    <AnimatePresence>
                        {placedToppings.map((tp) => {
                            const toppingSize = readOnly ? 20 : 38;
                            const halfSize = toppingSize / 2;
                            return (
                                <motion.div
                                    key={tp.id}
                                    initial={{ scale: 0, rotate: tp.rotation - 90, opacity: 0 }}
                                    animate={{
                                        scale: tp.scale,
                                        rotate: tp.rotation,
                                        opacity: 1,
                                        x: (tp.x / 50) * radius,
                                        y: (tp.y / 50) * radius,
                                    }}
                                    exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
                                    drag={!isBaking && !readOnly ? true : false}
                                    dragConstraints={canvasRef}
                                    dragElastic={0}
                                    dragMomentum={false}
                                    onDragStart={() => {
                                        isDraggingRef.current = true;
                                    }}
                                    onDragEnd={(_, info) => {
                                        setTimeout(() => {
                                            isDraggingRef.current = false;
                                        }, 100);

                                        if (!canvasRef.current || readOnly) return;
                                        const rect = canvasRef.current.getBoundingClientRect();
                                        const centerX = rect.left + rect.width / 2;
                                        const centerY = rect.top + rect.height / 2;
                                        const currentRadius = rect.width / 2;

                                        const rawX = ((info.point.x - centerX) / currentRadius) * 50;
                                        const rawY = ((info.point.y - centerY) / currentRadius) * 50;
                                        const { x: clampedX, y: clampedY } = clampToCircularBoundary(rawX, rawY);
                                        onUpdateToppingPos(tp.id, clampedX, clampedY);
                                    }}
                                    onMouseEnter={() => !readOnly && setHoveredToppingId(tp.id)}
                                    onTouchStart={() => !readOnly && setHoveredToppingId(tp.id)}
                                    onTouchEnd={() => !readOnly && setTimeout(() => setHoveredToppingId(null), 1500)}
                                    style={{ left: `calc(50% - ${halfSize}px)`, top: `calc(50% - ${halfSize}px)` }}
                                    className={`absolute ${readOnly ? 'pointer-events-none' : 'pointer-events-auto cursor-grab active:cursor-grabbing'} group hover:z-30`}
                                >
                                    <div className="relative group-hover:scale-110 transition-transform duration-150">
                                        <ToppingGraphic id={tp.toppingId} size={toppingSize} isBaked={isBaking} />

                                        {!isBaking && !readOnly && hoveredToppingId === tp.id && (
                                            <button
                                                type="button"
                                                onPointerDown={(e) => {
                                                    pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (isDraggingRef.current) return;

                                                    if (pointerDownPosRef.current) {
                                                        const moveDist = Math.hypot(
                                                            e.clientX - pointerDownPosRef.current.x,
                                                            e.clientY - pointerDownPosRef.current.y
                                                        );
                                                        if (moveDist > 6) return;
                                                    }

                                                    onRemoveTopping(tp.id);
                                                    sound.playRemove();
                                                }}
                                                className="absolute -top-2 -right-2 w-7 h-7 sticker--pink rounded-full flex items-center justify-center text-sm font-bold shadow-md active:scale-90 transition-transform cursor-pointer select-none"
                                                title="Malzemeyi Çıkar"
                                                aria-label="Malzemeyi çıkar"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* 5. SLICE GUIDELINES OVERLAY */}
                {showSlices && !readOnly && (
                    <div className="absolute inset-0 pointer-events-none opacity-50">
                        <svg viewBox="0 0 100 100" className="w-full h-full stroke-[var(--color-ink)] stroke-[0.75]" aria-hidden="true">
                            <line x1="50" y1="0" x2="50" y2="100" />
                            <line x1="0" y1="50" x2="100" y2="50" />
                            <line x1="14.6" y1="14.6" x2="85.4" y2="85.4" />
                            <line x1="85.4" y1="14.6" x2="14.6" y2="85.4" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Canvas Quick Controls Bar */}
            {!readOnly && !isBaking && (
                <div className="mt-3 flex items-center gap-2.5 sticker--lime px-4 py-2 text-xs font-semibold text-[var(--color-ink)] z-20">
                    <span className="font-body">Pizzaya tıklayarak veya sürükleyerek malzeme ekleyin</span>
                    <div className="h-3 w-px bg-[var(--color-ink)] mx-0.5 opacity-40" />
                    <button
                        onClick={() => setShowSlices(!showSlices)}
                        className={`pill px-2.5 py-1 text-xs font-semibold transition-all ${showSlices ? 'bg-[var(--color-ink)] text-[var(--color-paper)]' : 'bg-[var(--color-paper)] text-[var(--color-ink)] border border-[var(--color-ink)] hover:bg-[var(--color-paper-3)]'
                            }`}
                    >
                        <Grid className="w-3.5 h-3.5 inline mr-1" aria-hidden="true" />
                        <span>Dilimler</span>
                    </button>
                    {placedToppings.length > 0 && (
                        <button
                            onClick={() => {
                                onClearToppings();
                                sound.playRemove();
                            }}
                            className="pill px-2.5 py-1 text-xs font-semibold bg-[var(--color-accent)] text-[var(--color-accent-ink)] hover:opacity-90 transition-opacity"
                        >
                            <RotateCcw className="w-3.5 h-3.5 inline mr-1" aria-hidden="true" />
                            <span>Temizle ({placedToppings.length})</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
