import React, { useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { CrustType, SauceType, CheeseType, PlacedTopping } from './types/pizza';
import { CRUST_OPTIONS, SAUCE_OPTIONS, CHEESE_OPTIONS, TOPPING_DEFS, PRESET_PIZZAS } from './data/pizzaData';
import { Header } from './components/Header';
import { PizzaCanvas } from './components/PizzaCanvas';
import { ToppingSelector } from './components/ToppingSelector';
import { StatsPanel } from './components/StatsPanel';
import { OvenAnimation } from './components/OvenAnimation';
import { CheckoutModal } from './components/CheckoutModal';

export const App: React.FC = () => {
  const [crust, setCrust] = useState<CrustType>('traditional');
  const [sauce, setSauce] = useState<SauceType>('tomato');
  const [cheese, setCheese] = useState<CheeseType>('mozzarella');
  const [placedToppings, setPlacedToppings] = useState<PlacedTopping[]>([
    { id: 'init-1', toppingId: 'sucuk', x: -14, y: -12, rotation: 15, scale: 1 },
    { id: 'init-2', toppingId: 'sucuk', x: 18, y: -8, rotation: 45, scale: 1.05 },
    { id: 'init-3', toppingId: 'sucuk', x: 2, y: 16, rotation: 110, scale: 0.95 },
    { id: 'init-4', toppingId: 'basil', x: -8, y: 10, rotation: 80, scale: 1 },
    { id: 'init-5', toppingId: 'basil', x: 12, y: -20, rotation: 200, scale: 0.9 },
    { id: 'init-6', toppingId: 'tomato_slice', x: -20, y: -5, rotation: 30, scale: 1 },
  ]);

  const [activeToppingToPlace, setActiveToppingToPlace] = useState<string | null>(null);

  const [isBaking, setIsBaking] = useState<boolean>(false);
  const [bakeProgress, setBakeProgress] = useState<number>(0);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const bakeIntervalRef = useRef<number | null>(null);

  const crustData = CRUST_OPTIONS.find((c) => c.id === crust) || CRUST_OPTIONS[0];
  const sauceData = SAUCE_OPTIONS.find((s) => s.id === sauce) || SAUCE_OPTIONS[0];
  const cheeseData = CHEESE_OPTIONS.find((ch) => ch.id === cheese) || CHEESE_OPTIONS[0];

  const toppingsPrice = placedToppings.reduce((acc, tp) => {
    const def = TOPPING_DEFS.find((t) => t.id === tp.toppingId);
    return acc + (def ? def.price : 0);
  }, 0);

  const toppingsCalories = placedToppings.reduce((acc, tp) => {
    const def = TOPPING_DEFS.find((t) => t.id === tp.toppingId);
    return acc + (def ? def.calories : 0);
  }, 0);

  const totalPrice = crustData.price + sauceData.price + cheeseData.price + toppingsPrice;
  const totalCalories = crustData.calories + sauceData.calories + cheeseData.calories + toppingsCalories;

  const placedToppingsCount: Record<string, number> = {};
  placedToppings.forEach((tp) => {
    placedToppingsCount[tp.toppingId] = (placedToppingsCount[tp.toppingId] || 0) + 1;
  });

  const handlePlaceTopping = (x: number, y: number, toppingId?: string) => {
    // Prefer explicit toppingId from drag-and-drop fallback to activeToppingToPlace for click
    const selectedToppingId = toppingId ?? activeToppingToPlace;
    if (!selectedToppingId) return;

    const newPlaced: PlacedTopping = {
      id: `${selectedToppingId}-${Date.now()}-${Math.random()}`,
      toppingId: selectedToppingId,
      x,
      y,
      rotation: Math.floor(Math.random() * 360),
      scale: 0.85 + Math.random() * 0.3,
    };

    setPlacedToppings((prev) => [...prev, newPlaced]);
  };

  const handleUpdateToppingPos = (id: string, x: number, y: number) => {
    setPlacedToppings((prev) =>
      prev.map((tp) => (tp.id === id ? { ...tp, x, y } : tp))
    );
  };

  const handleRemoveTopping = (id: string) => {
    setPlacedToppings((prev) => prev.filter((tp) => tp.id !== id));
  };

  const handleRemoveAllToppingsOfId = (toppingId: string) => {
    setPlacedToppings((prev) => prev.filter((tp) => tp.toppingId !== toppingId));
  };

  const handleAutoScatterTopping = (toppingId: string, count = 4) => {
    const newItems: PlacedTopping[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 6 + Math.random() * 18;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      newItems.push({
        id: `${toppingId}-${Date.now()}-${i}`,
        toppingId,
        x,
        y,
        rotation: Math.floor(Math.random() * 360),
        scale: 0.85 + Math.random() * 0.3,
      });
    }
    setPlacedToppings((prev) => [...prev, ...newItems]);
  };

  const handleLoadPreset = (presetId: string) => {
    const preset = PRESET_PIZZAS.find((p) => p.id === presetId);
    if (!preset) return;

    setCrust(preset.crust);
    setSauce(preset.sauce);
    setCheese(preset.cheese);
    setPlacedToppings([]);

    const presetItems: PlacedTopping[] = [];
    preset.toppings.forEach((toppingId) => {
      const count = 4;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 6 + Math.random() * 18;
        presetItems.push({
          id: `${toppingId}-preset-${i}-${Math.random()}`,
          toppingId,
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          rotation: Math.floor(Math.random() * 360),
          scale: 0.85 + Math.random() * 0.3,
        });
      }
    });

    setPlacedToppings(presetItems);
    setActiveToppingToPlace(null);
  };

  const handleRandomize = () => {
    const randomCrust = CRUST_OPTIONS[Math.floor(Math.random() * CRUST_OPTIONS.length)].id;
    const randomSauce = SAUCE_OPTIONS[Math.floor(Math.random() * SAUCE_OPTIONS.length)].id;
    const randomCheese = CHEESE_OPTIONS[Math.floor(Math.random() * CHEESE_OPTIONS.length)].id;

    setCrust(randomCrust);
    setSauce(randomSauce);
    setCheese(randomCheese);

    const shuffledToppings = [...TOPPING_DEFS].sort(() => 0.5 - Math.random());
    const selectedToppings = shuffledToppings.slice(0, 3 + Math.floor(Math.random() * 3));

    const randomItems: PlacedTopping[] = [];
    selectedToppings.forEach((def) => {
      const count = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 6 + Math.random() * 18;
        randomItems.push({
          id: `${def.id}-rand-${i}-${Math.random()}`,
          toppingId: def.id,
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          rotation: Math.floor(Math.random() * 360),
          scale: 0.85 + Math.random() * 0.3,
        });
      }
    });

    setPlacedToppings(randomItems);
  };

  const handleStartBaking = () => {
    if (bakeIntervalRef.current) {
      clearInterval(bakeIntervalRef.current);
    }
    setIsBaking(true);
    setBakeProgress(0);

    const startTime = Date.now();
    const duration = 2800;

    bakeIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      setBakeProgress(progress);

      if (progress >= 1) {
        if (bakeIntervalRef.current) {
          clearInterval(bakeIntervalRef.current);
          bakeIntervalRef.current = null;
        }
        setTimeout(() => {
          setIsBaking(false);
          setShowCheckout(true);
        }, 300);
      }
    }, 40);
  };

  const handleSkipBaking = () => {
    if (bakeIntervalRef.current) {
      clearInterval(bakeIntervalRef.current);
      bakeIntervalRef.current = null;
    }
    setBakeProgress(1);
    setIsBaking(false);
    setShowCheckout(true);
  };

  const handleResetOrder = () => {
    setShowCheckout(false);
    setPlacedToppings([]);
    setCrust('traditional');
    setSauce('tomato');
    setCheese('mozzarella');
    setActiveToppingToPlace(null);
  };

  return (
    <div className="min-h-screen fibre bg-[var(--color-paper)] text-[var(--color-ink)] flex flex-col font-body">
      <Header
        onRandomize={handleRandomize}
        onReset={() => setPlacedToppings([])}
        totalToppings={placedToppings.length}
      />

      <main className="flex-1 max-w-[var(--container)] w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <PizzaCanvas
            crust={crust}
            sauce={sauce}
            cheese={cheese}
            placedToppings={placedToppings}
            activeToppingToPlace={activeToppingToPlace}
            onPlaceTopping={handlePlaceTopping}
            onUpdateToppingPos={handleUpdateToppingPos}
            onRemoveTopping={handleRemoveTopping}
            onClearToppings={() => setPlacedToppings([])}
            isBaking={isBaking}
            bakeProgress={bakeProgress}
          />
        </div>

        <div className="lg:col-span-5 flex flex-col gap-5 h-full max-h-[750px]">
          <div className="flex-1 min-h-[420px]">
            <ToppingSelector
              crust={crust}
              sauce={sauce}
              cheese={cheese}
              activeToppingToPlace={activeToppingToPlace}
              placedToppingsCount={placedToppingsCount}
              onSelectCrust={setCrust}
              onSelectSauce={setSauce}
              onSelectCheese={setCheese}
              onSelectActiveTopping={setActiveToppingToPlace}
              onAutoScatterTopping={handleAutoScatterTopping}
              onRemoveAllToppingsOfId={handleRemoveAllToppingsOfId}
              onLoadPreset={handleLoadPreset}
            />
          </div>

          <StatsPanel
            totalPrice={totalPrice}
            totalCalories={totalCalories}
            toppingCount={placedToppings.length}
            onBakePizza={handleStartBaking}
            isBaking={isBaking}
          />
        </div>
      </main>

      <AnimatePresence>
        {isBaking && (
          <OvenAnimation
            bakeProgress={bakeProgress}
            onSkip={handleSkipBaking}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCheckout && (
          <CheckoutModal
            crust={crust}
            sauce={sauce}
            cheese={cheese}
            placedToppings={placedToppings}
            totalPrice={totalPrice}
            totalCalories={totalCalories}
            onClose={() => setShowCheckout(false)}
            onResetOrder={handleResetOrder}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
