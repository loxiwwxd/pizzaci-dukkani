import React, { useState } from 'react';
import { ChefHat, Sparkles, Plus, Minus, Check, Flame } from 'lucide-react';
import type { CrustType, SauceType, CheeseType, ToppingCategory } from '../types/pizza';
import { CRUST_OPTIONS, SAUCE_OPTIONS, CHEESE_OPTIONS, TOPPING_DEFS, PRESET_PIZZAS } from '../data/pizzaData';
import { ToppingGraphic } from './ToppingGraphic';
import { sound } from '../utils/audio';
import { renderToStaticMarkup } from 'react-dom/server';

interface ToppingSelectorProps {
    crust: CrustType;
    sauce: SauceType;
    cheese: CheeseType;
    activeToppingToPlace: string | null;
    placedToppingsCount: Record<string, number>;
    onSelectCrust: (crust: CrustType) => void;
    onSelectSauce: (sauce: SauceType) => void;
    onSelectCheese: (cheese: CheeseType) => void;
    onSelectActiveTopping: (toppingId: string | null) => void;
    onAutoScatterTopping: (toppingId: string, count?: number) => void;
    onRemoveAllToppingsOfId: (toppingId: string) => void;
    onLoadPreset: (presetId: string) => void;
}

export const ToppingSelector: React.FC<ToppingSelectorProps> = ({
    crust,
    sauce,
    cheese,
    activeToppingToPlace,
    placedToppingsCount,
    onSelectCrust,
    onSelectSauce,
    onSelectCheese,
    onSelectActiveTopping,
    onAutoScatterTopping,
    onRemoveAllToppingsOfId,
    onLoadPreset,
}) => {
    const [activeTab, setActiveTab] = useState<'base' | 'toppings' | 'presets'>('toppings');
    const [toppingCategory, setToppingCategory] = useState<'all' | ToppingCategory>('all');
    const [draggingToppingId, setDraggingToppingId] = useState<string | null>(null);

    const filteredToppings = TOPPING_DEFS.filter(
        (t) => toppingCategory === 'all' || t.category === toppingCategory
    );

    return (
        <div className="diecut flex flex-col h-full bg-[var(--color-paper-2)] p-4 shadow-sm">
            {/* Top Navigation Tabs - Sticker Pill Buttons */}
            <div className="grid grid-cols-3 gap-2 bg-[var(--color-paper)] p-1.5 rounded-[var(--radius-card)] border-2 border-[var(--color-ink)] mb-4">
                <button
                    onClick={() => {
                        setActiveTab('base');
                        sound.playClick();
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-[var(--radius-card)] text-xs font-bold transition-all ${activeTab === 'base'
                        ? 'sticker--pink'
                        : 'text-[var(--color-ink)] hover:bg-[var(--color-paper-3)]'
                        }`}
                >
                    <ChefHat className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Taban & Sos</span>
                </button>

                <button
                    onClick={() => {
                        setActiveTab('toppings');
                        sound.playClick();
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-[var(--radius-card)] text-xs font-bold transition-all ${activeTab === 'toppings'
                        ? 'sticker--pink'
                        : 'text-[var(--color-ink)] hover:bg-[var(--color-paper-3)]'
                        }`}
                >
                    <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Malzemeler</span>
                </button>

                <button
                    onClick={() => {
                        setActiveTab('presets');
                        sound.playClick();
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-[var(--radius-card)] text-xs font-bold transition-all ${activeTab === 'presets'
                        ? 'sticker--pink'
                        : 'text-[var(--color-ink)] hover:bg-[var(--color-paper-3)]'
                        }`}
                >
                    <Flame className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Tarifler</span>
                </button>
            </div>

            {/* TAB 1: BASE & SAUCE & CHEESE */}
            {activeTab === 'base' && (
                <div className="flex-1 overflow-y-auto space-y-5 pr-1">
                    {/* Crust Selection */}
                    <div>
                        <h3 className="font-display text-xs text-[var(--color-ink)] mb-2.5 uppercase tracking-wide">
                            1. Hamur tipi seçimi
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {CRUST_OPTIONS.map((c) => {
                                const isSelected = crust === c.id;
                                return (
                                    <button
                                        key={c.id}
                                        onClick={() => {
                                            onSelectCrust(c.id);
                                            sound.playPop();
                                        }}
                                        className={`relative p-3 rounded-[var(--radius-card)] text-left border-2 transition-all flex flex-col justify-between ${isSelected
                                            ? 'sticker--lime border-[var(--color-ink)] shadow-md'
                                            : 'bg-[var(--color-paper)] border-[var(--color-ink)] hover:bg-[var(--color-paper-3)]'
                                            }`}
                                    >
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 w-5 h-5 bg-[var(--color-ink)] text-[var(--color-paper)] rounded-full flex items-center justify-center font-bold text-[10px]">
                                                ✓
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-bold text-xs text-[var(--color-ink)] uppercase">{c.name}</h4>
                                            <p className="text-[11px] text-[var(--color-muted)] mt-1 line-clamp-2">{c.description}</p>
                                        </div>
                                        <div className="mt-3 flex items-center justify-between text-xs font-bold">
                                            <span className="text-[var(--color-accent-deep)] font-display">+{c.price} ₺</span>
                                            <span className="text-[var(--color-muted)] font-mono">{c.calories} kcal</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sauce Selection */}
                    <div>
                        <h3 className="font-display text-xs text-[var(--color-ink)] mb-2.5 uppercase tracking-wide">
                            2. Sos katmanı
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {SAUCE_OPTIONS.map((s) => {
                                const isSelected = sauce === s.id;
                                return (
                                    <button
                                        key={s.id}
                                        onClick={() => {
                                            onSelectSauce(s.id);
                                            sound.playPop();
                                        }}
                                        className={`p-2.5 rounded-[var(--radius-card)] border-2 border-[var(--color-ink)] transition-all flex items-center gap-2.5 ${isSelected
                                            ? 'sticker--lime shadow-md'
                                            : 'bg-[var(--color-paper)] hover:bg-[var(--color-paper-3)] text-[var(--color-ink)]'
                                            }`}
                                    >
                                        <div
                                            className="w-6 h-6 rounded-full border-2 border-[var(--color-ink)] shrink-0 shadow-sm"
                                            style={{ backgroundColor: s.color }}
                                        />
                                        <div className="flex-1 text-left">
                                            <h4 className="font-bold text-xs">{s.name}</h4>
                                            <span className="text-[11px] opacity-80 font-mono">
                                                {s.price > 0 ? `+${s.price} ₺` : 'Ücretsiz'}
                                            </span>
                                        </div>
                                        {isSelected && <Check className="w-4 h-4 text-[var(--color-ink)] shrink-0" aria-hidden="true" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Cheese Selection */}
                    <div>
                        <h3 className="font-display text-xs text-[var(--color-ink)] mb-2.5 uppercase tracking-wide">
                            3. Peynir katmanı
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {CHEESE_OPTIONS.map((ch) => {
                                const isSelected = cheese === ch.id;
                                return (
                                    <button
                                        key={ch.id}
                                        onClick={() => {
                                            onSelectCheese(ch.id);
                                            sound.playPop();
                                        }}
                                        className={`p-2.5 rounded-[var(--radius-card)] border-2 border-[var(--color-ink)] transition-all flex items-center gap-2.5 ${isSelected
                                            ? 'sticker--lime shadow-md'
                                            : 'bg-[var(--color-paper)] hover:bg-[var(--color-paper-3)] text-[var(--color-ink)]'
                                            }`}
                                    >
                                        <div
                                            className="w-6 h-6 rounded-full border-2 border-[var(--color-ink)] shrink-0 shadow-sm"
                                            style={{ backgroundColor: ch.color }}
                                        />
                                        <div className="flex-1 text-left">
                                            <h4 className="font-bold text-xs">{ch.name}</h4>
                                            <span className="text-[11px] opacity-80 font-mono">
                                                {ch.price > 0 ? `+${ch.price} ₺` : 'Ücretsiz'}
                                            </span>
                                        </div>
                                        {isSelected && <Check className="w-4 h-4 text-[var(--color-ink)] shrink-0" aria-hidden="true" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: INTERACTIVE TOPPINGS */}
            {activeTab === 'toppings' && (
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3">
                        {[
                            { id: 'all', label: 'TÜMÜ' },
                            { id: 'meat', label: 'ETLER' },
                            { id: 'veggie', label: 'SEBZELER' },
                            { id: 'cheese_herb', label: 'PEYNİR & OTLAR' },
                        ].map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setToppingCategory(cat.id as any);
                                    sound.playClick();
                                }}
                                className={`pill px-3 py-1 text-xs font-bold whitespace-nowrap transition-all border-2 border-[var(--color-ink)] ${toppingCategory === cat.id
                                    ? 'sticker--pink border-[var(--color-ink)]'
                                    : 'bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-paper-3)]'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {activeToppingToPlace && (
                        <div className="mb-3 p-2.5 sticker--lime border-2 border-[var(--color-ink)] flex items-center justify-between text-xs font-bold">
                            <span>Pizzaya tıklayarak yerleştirin</span>
                            <button
                                onClick={() => onSelectActiveTopping(null)}
                                className="pill px-2 py-0.5 bg-[var(--color-ink)] text-[var(--color-paper)] hover:opacity-90 font-bold text-[10px]"
                            >
                                İPTAL
                            </button>
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2.5 pr-1">
                        {filteredToppings.map((tp) => {
                            const count = placedToppingsCount[tp.id] || 0;
                            const isActivePlacement = activeToppingToPlace === tp.id;
                            const isDragging = draggingToppingId === tp.id;

                            return (
                                <div
                                    key={tp.id}
                                    draggable
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData('text/plain', tp.id);
                                        e.dataTransfer.effectAllowed = 'copy';
                                        setDraggingToppingId(tp.id);

                                        const previewEl = document.createElement('div');
                                        previewEl.style.width = '36px';
                                        previewEl.style.height = '36px';
                                        previewEl.style.display = 'flex';
                                        previewEl.style.alignItems = 'center';
                                        previewEl.style.justifyContent = 'center';
                                        previewEl.style.position = 'absolute';
                                        previewEl.style.top = '-9999px';
                                        previewEl.style.left = '-9999px';

                                        const svgContainer = document.createElement('div');
                                        svgContainer.innerHTML = renderToStaticMarkup(<ToppingGraphic id={tp.id} size={36} />);
                                        previewEl.appendChild(svgContainer);
                                        document.body.appendChild(previewEl);

                                        e.dataTransfer.setDragImage(previewEl, 18, 18);
                                        setTimeout(() => {
                                            document.body.removeChild(previewEl);
                                        }, 0);
                                    }}
                                    onDragEnd={() => {
                                        setDraggingToppingId(null);
                                    }}
                                    className={`relative p-2.5 rounded-[var(--radius-card)] border-2 border-[var(--color-ink)] transition-all flex flex-col justify-between cursor-grab active:cursor-grabbing ${isDragging
                                        ? 'opacity-50 scale-95 bg-[var(--color-accent-2)]'
                                        : isActivePlacement
                                            ? 'sticker--lime shadow-md'
                                            : count > 0
                                                ? 'bg-[var(--color-paper-3)] shadow-sm'
                                                : 'bg-[var(--color-paper)] hover:bg-[var(--color-paper-3)]'
                                        }`}
                                >
                                    {count > 0 && (
                                        <div className="absolute top-2 right-2 bg-[var(--color-ink)] text-[var(--color-paper)] font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow">
                                            {count}
                                        </div>
                                    )}

                                    <div
                                        onClick={() => {
                                            if (isActivePlacement) {
                                                onSelectActiveTopping(null);
                                            } else {
                                                onSelectActiveTopping(tp.id);
                                                sound.playPop();
                                            }
                                        }}
                                        className="flex flex-col items-center text-center cursor-pointer"
                                    >
                                        <div className="w-10 h-10 flex items-center justify-center mb-1">
                                            <ToppingGraphic id={tp.id} size={32} />
                                        </div>
                                        <h4 className="font-bold text-[var(--color-ink)] text-xs line-clamp-1">{tp.name}</h4>
                                        <span className="text-[11px] text-[var(--color-accent-deep)] font-mono font-bold mt-0.5">
                                            +{tp.price} ₺
                                        </span>
                                    </div>

                                    <div className="mt-2.5 flex items-center justify-between gap-1 pt-2 border-t-2 border-dashed border-[var(--color-rule)]">
                                        <button
                                            disabled={count === 0}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onRemoveAllToppingsOfId(tp.id);
                                            }}
                                            className="p-1 rounded-[var(--radius-card)] bg-[var(--color-paper)] border border-[var(--color-ink)] text-[var(--color-ink)] disabled:opacity-30 transition-colors"
                                            title="Tümünü kaldır"
                                        >
                                            <Minus className="w-3 h-3" aria-hidden="true" />
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onAutoScatterTopping(tp.id, 4);
                                                sound.playPop();
                                            }}
                                            className="px-2 py-0.5 sticker--pink text-[10px] font-bold transition-transform active:scale-95 flex items-center gap-1"
                                            title="4 adet ekle"
                                        >
                                            <Plus className="w-3 h-3" aria-hidden="true" />
                                            <span>4 EKLE</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* TAB 3: PRESET SPECIALTY PIZZAS */}
            {activeTab === 'presets' && (
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                    <p className="text-xs text-[var(--color-muted)] font-semibold mb-2">
                        Şeflerimizin hazırladığı favori pizza tarifleri:
                    </p>

                    {PRESET_PIZZAS.map((preset) => (
                        <div
                            key={preset.id}
                            onClick={() => {
                                onLoadPreset(preset.id);
                                sound.playOvenDone();
                            }}
                            className="p-3.5 rounded-[var(--radius-card)] bg-[var(--color-paper)] border-2 border-[var(--color-ink)] hover:bg-[var(--color-paper-3)] cursor-pointer transition-all shadow-sm group"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    {preset.badge && (
                                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold sticker--lime mb-1 border border-[var(--color-ink)]">
                                            {preset.badge}
                                        </span>
                                    )}
                                    <h4 className="font-display text-sm text-[var(--color-ink)] uppercase">
                                        {preset.name}
                                    </h4>
                                    <p className="text-xs text-[var(--color-muted)] mt-1">{preset.description}</p>
                                </div>
                                <button className="px-3 py-1.5 rounded-full sticker--pink font-bold text-xs shadow">
                                    YÜKLE
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
