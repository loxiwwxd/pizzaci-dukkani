import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, CreditCard, MapPin, Phone, User, CheckCircle2, ArrowLeft, Truck, Clock, ShieldCheck, Sparkles, Banknote, UtensilsCrossed, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { CrustType, SauceType, CheeseType, PlacedTopping, OrderDetails } from '../types/pizza';
import { CRUST_OPTIONS, SAUCE_OPTIONS, CHEESE_OPTIONS, TOPPING_DEFS } from '../data/pizzaData';
import { PizzaCanvas } from './PizzaCanvas';
import { sound } from '../utils/audio';

interface CheckoutModalProps {
    crust: CrustType;
    sauce: SauceType;
    cheese: CheeseType;
    placedToppings: PlacedTopping[];
    totalPrice: number;
    totalCalories: number;
    onClose: () => void;
    onResetOrder: () => void;
}

const formatCardNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
};

const formatExpiry = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const isExpiryValid = (expiry: string): boolean => {
    const match = expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;
    const month = parseInt(match[1], 10);
    const year = 2000 + parseInt(match[2], 10);
    if (month < 1 || month > 12) return false;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    return year > currentYear || (year === currentYear && month >= currentMonth);
};

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
    crust,
    sauce,
    cheese,
    placedToppings,
    totalPrice,
    totalCalories,
    onClose,
    onResetOrder,
}) => {
    const [step, setStep] = useState<'summary' | 'payment' | 'confirmed'>('summary');
    const [orderDetails, setOrderDetails] = useState<OrderDetails>({
        customerName: 'Ahmet Yılmaz',
        phone: '0532 123 45 67',
        address: 'Atatürk Mah. Karanfil Sok. No:12 D:4, Kadıköy / İstanbul',
        note: 'Zili çalmayın lütfen, bebek uyuyor',
        paymentMethod: 'card',
        deliverySpeed: 'express',
    });

    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvc, setCardCvc] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [orderCode] = useState(() => Math.floor(100000 + Math.random() * 900000));

    useEffect(() => {
        const origBody = document.body.style.overflow;
        const origHtml = document.documentElement.style.overflow;
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = origBody;
            document.documentElement.style.overflow = origHtml;
        };
    }, []);

    const crustData = CRUST_OPTIONS.find((c) => c.id === crust) || CRUST_OPTIONS[0];
    const sauceData = SAUCE_OPTIONS.find((s) => s.id === sauce) || SAUCE_OPTIONS[0];
    const cheeseData = CHEESE_OPTIONS.find((ch) => ch.id === cheese) || CHEESE_OPTIONS[0];

    const toppingCounts: Record<string, number> = {};
    placedToppings.forEach((tp) => {
        toppingCounts[tp.toppingId] = (toppingCounts[tp.toppingId] || 0) + 1;
    });

    const expressFee = orderDetails.deliverySpeed === 'express' ? 25 : 0;
    const finalTotal = totalPrice + expressFee;

    const validateSummary = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!orderDetails.customerName.trim()) {
            newErrors.customerName = 'Ad-Soyad alanı zorunludur';
        }
        if (!orderDetails.phone.trim()) {
            newErrors.phone = 'Telefon numarası zorunludur';
        }
        if (!orderDetails.address.trim()) {
            newErrors.address = 'Teslimat adresi zorunludur';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePayment = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (orderDetails.paymentMethod === 'card') {
            if (cardNumber.replace(/\s/g, '').length !== 16) {
                newErrors.cardNumber = 'Geçerli bir kart numarası girin (16 hane)';
            }
            if (!isExpiryValid(cardExpiry)) {
                newErrors.cardExpiry = 'Geçerli bir son kullanma tarihi girin (AA/YY)';
            }
            if (cardCvc.length < 3) {
                newErrors.cardCvc = 'Geçerli bir güvenlik kodu girin';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSummarySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateSummary()) {
            setStep('payment');
            sound.playClick();
        }
    };

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validatePayment()) {
            handleCompleteOrder();
        }
    };

    const handleCompleteOrder = () => {
        setStep('confirmed');
        sound.playSuccess();

        confetti({
            particleCount: 140,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#E23A73', '#A8E10C', '#18181B', '#38BDF8'],
        });
    };

    const paymentMethods = [
        { id: 'card' as const, label: 'Kredi Kartı', icon: CreditCard, desc: 'Güvenli 3D' },
        { id: 'cash' as const, label: 'Kapıda Nakit', icon: Banknote, desc: 'Kuryeye öde' },
        { id: 'meal_card' as const, label: 'Yemek Kartı', icon: UtensilsCrossed, desc: 'Kurumsal' },
    ];

    return (
        <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-3 sm:p-4 bg-[var(--color-ink)]/80 backdrop-blur-sm overflow-y-auto no-scrollbar">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="diecut w-full max-w-4xl bg-[var(--color-paper)] shadow-2xl overflow-hidden my-auto no-scrollbar border-4 border-[var(--color-ink)]"
            >
                {/* Header */}
                <div className="bg-[var(--color-ink)] text-[var(--color-paper)] px-5 py-4 flex items-center justify-between border-b-4 border-[var(--color-ink)]">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-[var(--radius-card)] bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-paper-3)] transition-colors border-2 border-[var(--color-ink)]"
                        >
                            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <div>
                            <h2 className="font-display text-base uppercase tracking-wide">
                                {step === 'confirmed' ? 'Siparişiniz alındı' : 'Ödeme ve sipariş özeti'}
                            </h2>
                            <p className="text-[11px] text-[var(--color-muted)] flex items-center gap-2 mt-0.5 font-mono">
                                <span>Gurme pizzanız hazır</span>
                                <span className="sticker--lime text-[var(--color-ink)] px-2 py-0.5 rounded-[var(--radius-card)] text-[10px] font-bold">
                                    {totalCalories} kcal
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 sticker--lime px-3 py-1.5 text-xs font-bold text-[var(--color-ink)]">
                        <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                        <span>256-Bit SSL Güvenli</span>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-4 sm:p-6 bg-[var(--color-paper-2)]">
                    {step !== 'confirmed' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                            {/* Left Column: Visual Pizza Summary & Itemized Receipt */}
                            <div className="lg:col-span-5 bg-[var(--color-paper)] p-4 rounded-[var(--radius-card)] border-2 border-[var(--color-ink)] flex flex-col justify-between shadow-xs">
                                <div>
                                    <h3 className="font-display text-xs text-[var(--color-ink)] mb-2 uppercase tracking-wide flex items-center gap-2">
                                        <ShoppingBag className="w-4 h-4 text-[var(--color-accent)]" aria-hidden="true" />
                                        <span>Oluşturduğunuz pizza</span>
                                    </h3>

                                    <div className="w-36 h-36 mx-auto my-2 pointer-events-none">
                                        <PizzaCanvas
                                            crust={crust}
                                            sauce={sauce}
                                            cheese={cheese}
                                            placedToppings={placedToppings}
                                            activeToppingToPlace={null}
                                            onPlaceTopping={() => { }}
                                            onUpdateToppingPos={() => { }}
                                            onRemoveTopping={() => { }}
                                            onClearToppings={() => { }}
                                            isBaking={false}
                                            readOnly={true}
                                        />
                                    </div>

                                    {/* Receipt Breakdown */}
                                    <div className="space-y-1.5 mt-3 text-xs border-t-2 border-dashed border-[var(--color-rule)] pt-3">
                                        <div className="flex justify-between text-[var(--color-ink)] font-bold">
                                            <span>{crustData.name}</span>
                                            <span>{crustData.price} ₺</span>
                                        </div>

                                        {sauce !== 'none' && (
                                            <div className="flex justify-between text-[var(--color-ink)]">
                                                <span>{sauceData.name}</span>
                                                <span className="font-bold">+{sauceData.price} ₺</span>
                                            </div>
                                        )}

                                        {cheese !== 'none' && (
                                            <div className="flex justify-between text-[var(--color-ink)]">
                                                <span>{cheeseData.name}</span>
                                                <span className="font-bold">+{cheeseData.price} ₺</span>
                                            </div>
                                        )}

                                        {Object.entries(toppingCounts).map(([tId, count]) => {
                                            const def = TOPPING_DEFS.find((t) => t.id === tId);
                                            if (!def) return null;
                                            return (
                                                <div key={tId} className="flex justify-between text-[var(--color-muted)]">
                                                    <span>
                                                        {def.name} x{count}
                                                    </span>
                                                    <span className="font-bold text-[var(--color-ink)]">+{def.price * count} ₺</span>
                                                </div>
                                            );
                                        })}

                                        {orderDetails.deliverySpeed === 'express' && (
                                            <div className="flex justify-between text-[var(--color-accent-deep)] font-bold pt-1">
                                                <span>VIP Jet kurye (20 dk)</span>
                                                <span>+25 ₺</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-3.5 border-t-2 border-[var(--color-ink)] mt-4">
                                    <div className="flex items-baseline justify-between">
                                        <span className="text-[var(--color-muted)] font-bold text-xs uppercase">Genel toplam:</span>
                                        <span className="font-display text-3xl text-[var(--color-ink)]">{finalTotal} ₺</span>
                                    </div>
                                    <p className="text-[11px] text-[var(--color-muted)] mt-1 flex items-center gap-1 font-semibold">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-accent)]" aria-hidden="true" /> Sıcak tutma garantisi dahil
                                    </p>
                                </div>
                            </div>

                            {/* Right Column: Checkout Form & Payment */}
                            <div className="lg:col-span-7 flex flex-col justify-between bg-[var(--color-paper)] p-4 rounded-[var(--radius-card)] border-2 border-[var(--color-ink)] shadow-xs">
                                {step === 'summary' ? (
                                    <form onSubmit={handleSummarySubmit} noValidate className="space-y-3.5">
                                        <h3 className="font-display text-xs text-[var(--color-ink)] mb-2 uppercase tracking-wide">
                                            Teslimat bilgileri
                                        </h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label htmlFor="customerName" className="text-xs text-[var(--color-muted)] font-bold block mb-1 uppercase">
                                                    Adınız soyadınız *
                                                </label>
                                                <div className="relative">
                                                    <User className="w-4 h-4 absolute left-3 top-2.5 text-[var(--color-muted)]" aria-hidden="true" />
                                                    <input
                                                        id="customerName"
                                                        type="text"
                                                        value={orderDetails.customerName}
                                                        onChange={(e) => {
                                                            setOrderDetails({ ...orderDetails, customerName: e.target.value });
                                                            if (errors.customerName) setErrors((prev) => ({ ...prev, customerName: '' }));
                                                        }}
                                                        className={`w-full bg-[var(--color-paper)] border-2 rounded-[var(--radius-card)] py-2 pl-9 pr-3 text-xs text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent)] ${errors.customerName ? 'border-red-500' : 'border-[var(--color-ink)]'}`}
                                                        required
                                                    />
                                                </div>
                                                {errors.customerName && (
                                                    <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.customerName}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="phone" className="text-xs text-[var(--color-muted)] font-bold block mb-1 uppercase">
                                                    Telefon numarası *
                                                </label>
                                                <div className="relative">
                                                    <Phone className="w-4 h-4 absolute left-3 top-2.5 text-[var(--color-muted)]" aria-hidden="true" />
                                                    <input
                                                        id="phone"
                                                        type="tel"
                                                        value={orderDetails.phone}
                                                        onChange={(e) => {
                                                            setOrderDetails({ ...orderDetails, phone: e.target.value });
                                                            if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                                                        }}
                                                        className={`w-full bg-[var(--color-paper)] border-2 rounded-[var(--radius-card)] py-2 pl-9 pr-3 text-xs text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent)] ${errors.phone ? 'border-red-500' : 'border-[var(--color-ink)]'}`}
                                                        required
                                                    />
                                                </div>
                                                {errors.phone && (
                                                    <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.phone}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="address" className="text-xs text-[var(--color-muted)] font-bold block mb-1 uppercase">
                                                Teslimat adresi *
                                            </label>
                                            <div className="relative">
                                                <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-[var(--color-muted)]" aria-hidden="true" />
                                                <textarea
                                                    id="address"
                                                    rows={2}
                                                    value={orderDetails.address}
                                                    onChange={(e) => {
                                                        setOrderDetails({ ...orderDetails, address: e.target.value });
                                                        if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
                                                    }}
                                                    className={`w-full bg-[var(--color-paper)] border-2 rounded-[var(--radius-card)] py-2 pl-9 pr-3 text-xs text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent)] resize-none ${errors.address ? 'border-red-500' : 'border-[var(--color-ink)]'}`}
                                                    required
                                                />
                                            </div>
                                            {errors.address && (
                                                <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.address}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="orderNote" className="text-xs text-[var(--color-muted)] font-bold block mb-1 uppercase">
                                                Sipariş notu
                                            </label>
                                            <div className="relative">
                                                <FileText className="w-4 h-4 absolute left-3 top-2.5 text-[var(--color-muted)]" aria-hidden="true" />
                                                <input
                                                    id="orderNote"
                                                    type="text"
                                                    value={orderDetails.note}
                                                    onChange={(e) => {
                                                        setOrderDetails({ ...orderDetails, note: e.target.value });
                                                    }}
                                                    placeholder="Kurye veya sipariş için notunuz (isteğe bağlı)"
                                                    className="w-full bg-[var(--color-paper)] border-2 rounded-[var(--radius-card)] py-2 pl-9 pr-3 text-xs text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent)] border-[var(--color-ink)]"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs text-[var(--color-muted)] font-bold block mb-1.5 uppercase">
                                                Teslimat hızı
                                            </label>
                                            <div className="grid grid-cols-2 gap-2.5">
                                                <button
                                                    type="button"
                                                    onClick={() => setOrderDetails({ ...orderDetails, deliverySpeed: 'express' })}
                                                    className={`p-2.5 rounded-[var(--radius-card)] border-2 text-left flex items-center gap-2.5 transition-all ${orderDetails.deliverySpeed === 'express'
                                                        ? 'sticker--lime border-[var(--color-ink)] shadow-xs'
                                                        : 'bg-[var(--color-paper)] border-[var(--color-ink)] hover:bg-[var(--color-paper-3)]'
                                                        }`}
                                                >
                                                    <Truck className="w-4 h-4 shrink-0" aria-hidden="true" />
                                                    <div className="whitespace-nowrap">
                                                        <div className="font-bold text-xs">VIP Jet</div>
                                                        <div className="text-[10px] opacity-80 font-mono">20 dk</div>
                                                    </div>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setOrderDetails({ ...orderDetails, deliverySpeed: 'standard' })}
                                                    className={`p-2.5 rounded-[var(--radius-card)] border-2 text-left flex items-center gap-2.5 transition-all ${orderDetails.deliverySpeed === 'standard'
                                                        ? 'sticker--lime border-[var(--color-ink)] shadow-xs'
                                                        : 'bg-[var(--color-paper)] border-[var(--color-ink)] hover:bg-[var(--color-paper-3)]'
                                                        }`}
                                                >
                                                    <Clock className="w-4 h-4 shrink-0" aria-hidden="true" />
                                                    <div className="whitespace-nowrap">
                                                        <div className="font-bold text-xs">Standart</div>
                                                        <div className="text-[10px] opacity-80 font-mono">30-40 dk</div>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full mt-3 py-3.5 rounded-[var(--radius-card)] sticker--pink font-display text-xs tracking-wider uppercase shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <span>Ödeme adımına geç</span>
                                            <CreditCard className="w-4 h-4 text-[var(--color-accent-ink)]" aria-hidden="true" />
                                        </button>
                                    </form>
                                ) : (
                                    /* STEP 2: PAYMENT METHOD & CARD */
                                    <form onSubmit={handlePaymentSubmit} noValidate className="space-y-3.5">
                                        <h3 className="font-display text-xs text-[var(--color-ink)] mb-2 uppercase tracking-wide">
                                            Ödeme yöntemi
                                        </h3>

                                        {/* Payment Method Selection */}
                                        <div className="grid grid-cols-3 gap-2">
                                            {paymentMethods.map((pm) => {
                                                const isSelected = orderDetails.paymentMethod === pm.id;
                                                const Icon = pm.icon;
                                                return (
                                                    <button
                                                        key={pm.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setOrderDetails({ ...orderDetails, paymentMethod: pm.id });
                                                            sound.playClick();
                                                        }}
                                                        className={`p-2.5 rounded-[var(--radius-card)] border-2 text-center flex flex-col items-center gap-1 transition-all ${isSelected
                                                            ? 'sticker--lime border-[var(--color-ink)] shadow-xs font-bold'
                                                            : 'bg-[var(--color-paper)] border-[var(--color-ink)] hover:bg-[var(--color-paper-3)] text-[var(--color-muted)]'
                                                            }`}
                                                    >
                                                        <Icon className="w-5 h-5 text-[var(--color-ink)]" aria-hidden="true" />
                                                        <span className="font-bold text-xs text-[var(--color-ink)]">{pm.label}</span>
                                                        <span className="text-[10px] opacity-80 font-mono">{pm.desc}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {orderDetails.paymentMethod === 'card' ? (
                                            <>
                                                {/* Sticker Credit Card Preview */}
                                                <div className="w-full aspect-[1.8/1] max-w-xs mx-auto p-4 rounded-[var(--radius-card)] sticker--ink shadow-md flex flex-col justify-between text-[var(--color-paper)]">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-display text-[11px] text-[var(--color-accent-2)] tracking-widest uppercase">
                                                            PIZZA EXPRESS CARD
                                                        </span>
                                                        <CreditCard className="w-5 h-5 text-[var(--color-accent-2)]" aria-hidden="true" />
                                                    </div>

                                                    <div className="font-mono font-bold text-base tracking-widest my-1">
                                                        {cardNumber || '4532 xxxx xxxx xxxx'}
                                                    </div>

                                                    <div className="flex justify-between text-xs font-mono">
                                                        <div>
                                                            <span className="text-[9px] block uppercase opacity-70">Kart sahibi</span>
                                                            <span className="font-bold uppercase">
                                                                {orderDetails.customerName || 'KART SAHİBİ'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-[9px] block uppercase opacity-70">Son kullanma</span>
                                                            <span className="font-bold">{cardExpiry || 'AA/YY'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-2.5 mt-2">
                                                    <div>
                                                        <label htmlFor="cardNumber" className="text-xs text-[var(--color-muted)] font-bold block mb-1 uppercase">Kart numarası</label>
                                                        <input
                                                            id="cardNumber"
                                                            type="text"
                                                            value={cardNumber}
                                                            onChange={(e) => {
                                                                setCardNumber(formatCardNumber(e.target.value));
                                                                if (errors.cardNumber) setErrors((prev) => ({ ...prev, cardNumber: '' }));
                                                            }}
                                                            placeholder="4543 0000 0000 0000"
                                                            maxLength={19}
                                                            inputMode="numeric"
                                                            autoComplete="cc-number"
                                                            className={`w-full bg-[var(--color-paper)] border-2 rounded-[var(--radius-card)] py-2 px-3 text-xs text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent)] ${errors.cardNumber ? 'border-red-500' : 'border-[var(--color-ink)]'}`}
                                                        />
                                                        {errors.cardNumber && (
                                                            <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.cardNumber}</p>
                                                        )}
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2.5">
                                                        <div>
                                                            <label htmlFor="cardExpiry" className="text-xs text-[var(--color-muted)] font-bold block mb-1 uppercase">Son kullanma (AA/YY)</label>
                                                            <input
                                                                id="cardExpiry"
                                                                type="text"
                                                                value={cardExpiry}
                                                                onChange={(e) => {
                                                                    setCardExpiry(formatExpiry(e.target.value));
                                                                    if (errors.cardExpiry) setErrors((prev) => ({ ...prev, cardExpiry: '' }));
                                                                }}
                                                                placeholder="AA/YY"
                                                                maxLength={5}
                                                                inputMode="numeric"
                                                                autoComplete="cc-exp"
                                                                className={`w-full bg-[var(--color-paper)] border-2 rounded-[var(--radius-card)] py-2 px-3 text-xs text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent)] ${errors.cardExpiry ? 'border-red-500' : 'border-[var(--color-ink)]'}`}
                                                            />
                                                            {errors.cardExpiry && (
                                                                <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.cardExpiry}</p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <label htmlFor="cardCvc" className="text-xs text-[var(--color-muted)] font-bold block mb-1 uppercase">Güvenlik kodu (CVC)</label>
                                                            <input
                                                                id="cardCvc"
                                                                type="text"
                                                                value={cardCvc}
                                                                onChange={(e) => {
                                                                    setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4));
                                                                    if (errors.cardCvc) setErrors((prev) => ({ ...prev, cardCvc: '' }));
                                                                }}
                                                                placeholder="123"
                                                                maxLength={4}
                                                                inputMode="numeric"
                                                                autoComplete="cc-csc"
                                                                className={`w-full bg-[var(--color-paper)] border-2 rounded-[var(--radius-card)] py-2 px-3 text-xs text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent)] ${errors.cardCvc ? 'border-red-500' : 'border-[var(--color-ink)]'}`}
                                                            />
                                                            {errors.cardCvc && (
                                                                <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.cardCvc}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="p-4 rounded-[var(--radius-card)] sticker--lime border-2 border-[var(--color-ink)] text-center my-3">
                                                <div className="w-10 h-10 mx-auto rounded-full bg-[var(--color-ink)] text-[var(--color-paper)] flex items-center justify-center mb-2 shadow-sm">
                                                    {orderDetails.paymentMethod === 'cash' ? (
                                                        <Banknote className="w-5 h-5" aria-hidden="true" />
                                                    ) : (
                                                        <UtensilsCrossed className="w-5 h-5" aria-hidden="true" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-[var(--color-ink)] font-bold">
                                                    {orderDetails.paymentMethod === 'cash'
                                                        ? 'Ödemeyi kuryeye nakit olarak yapabilirsiniz.'
                                                        : 'Ödemeyi kurumsal yemek kartınızla kuryeye yapabilirsiniz.'}
                                                </p>
                                                <p className="text-[11px] text-[var(--color-muted)] mt-1 font-mono">
                                                    Toplam tutar: <strong className="text-[var(--color-ink)]">{finalTotal} ₺</strong>
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex gap-2.5 mt-4">
                                            <button
                                                type="button"
                                                onClick={() => setStep('summary')}
                                                className="py-2.5 px-4 rounded-[var(--radius-card)] bg-[var(--color-paper)] text-[var(--color-ink)] font-bold text-xs border-2 border-[var(--color-ink)] hover:bg-[var(--color-paper-3)] transition-colors"
                                            >
                                                GERİ
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-1 py-3 rounded-[var(--radius-card)] sticker--pink font-display text-xs tracking-wider uppercase shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                            >
                                                <CheckCircle2 className="w-4 h-4 text-[var(--color-accent-ink)]" aria-hidden="true" />
                                                <span>Ödemeyi tamamla ({finalTotal} ₺)</span>
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    )}

                    {/* CONFIRMED STEP */}
                    {step === 'confirmed' && (
                        <div className="py-6 text-center flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full sticker--lime border-2 border-[var(--color-ink)] text-[var(--color-ink)] flex items-center justify-center mb-4 shadow-md">
                                <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
                            </div>

                            <h3 className="font-display text-2xl text-[var(--color-ink)] mb-1 uppercase tracking-wide">
                                Siparişiniz başarıyla alındı
                            </h3>
                            <p className="text-[var(--color-muted)] text-xs max-w-md mb-6 font-semibold">
                                Sipariş kodunuz: <strong className="text-[var(--color-ink)] font-mono">#ROO-{orderCode}</strong>. Pizzanız taş fırında pişti ve kuryemiz yola çıktı.
                            </p>

                            <div className="w-full max-w-md bg-[var(--color-paper)] p-4 rounded-[var(--radius-card)] border-2 border-[var(--color-ink)] mb-6 shadow-xs">
                                <div className="flex items-center justify-between text-xs font-bold text-[var(--color-ink)]">
                                    <span className="flex items-center gap-1">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-accent)]" aria-hidden="true" /> 1. Hazırlandı
                                    </span>
                                    <span className="flex items-center gap-1 text-[var(--color-accent-deep)]">
                                        <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> 2. Kurye yolda
                                    </span>
                                    <span className="text-[var(--color-muted)]">
                                        3. Kapınızda
                                    </span>
                                </div>
                            </div>

                            {orderDetails.note && (
                                <div className="w-full max-w-md bg-[var(--color-paper)] p-3 rounded-[var(--radius-card)] border-2 border-[var(--color-ink)] mb-6 text-left shadow-xs">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--color-muted)] uppercase mb-1">
                                        <FileText className="w-3.5 h-3.5 text-[var(--color-accent)]" aria-hidden="true" />
                                        <span>Sipariş notunuz:</span>
                                    </div>
                                    <p className="text-xs text-[var(--color-ink)] font-medium">
                                        "{orderDetails.note}"
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={onResetOrder}
                                className="px-6 py-3 rounded-[var(--radius-card)] sticker--pink font-display text-xs tracking-wider uppercase shadow-md hover:opacity-95 transition-all cursor-pointer"
                            >
                                Yeni bir pizza tasarla
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
