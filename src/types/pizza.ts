export type CrustType = 'thin' | 'traditional' | 'stuffed';
export type SauceType = 'tomato' | 'garlic' | 'bbq' | 'spicy' | 'none';
export type CheeseType = 'mozzarella' | 'cheddar' | 'tulum' | 'none';

export type ToppingCategory = 'meat' | 'veggie' | 'cheese_herb';

export interface ToppingDef {
    id: string;
    name: string;
    category: ToppingCategory;
    price: number;
    calories: number;
    color: string;
    secondaryColor?: string;
    iconName: string;
    description: string;
}

export interface PlacedTopping {
    id: string; // unique ID for instance
    toppingId: string;
    x: number; // percentage offset -50 to 50 from center
    y: number; // percentage offset -50 to 50 from center
    rotation: number; // in degrees 0-360
    scale: number; // 0.8 to 1.2 for natural variation
}

export interface CrustOption {
    id: CrustType;
    name: string;
    price: number;
    calories: number;
    description: string;
    color: string;
    edgeColor: string;
}

export interface SauceOption {
    id: SauceType;
    name: string;
    price: number;
    calories: number;
    color: string;
}

export interface CheeseOption {
    id: CheeseType;
    name: string;
    price: number;
    calories: number;
    color: string;
    opacity: number;
}

export interface PresetPizza {
    id: string;
    name: string;
    description: string;
    badge?: string;
    crust: CrustType;
    sauce: SauceType;
    cheese: CheeseType;
    toppings: string[]; // topping IDs
    imageGradient: string;
}

export interface OrderDetails {
    customerName: string;
    phone: string;
    address: string;
    note: string;
    paymentMethod: 'card' | 'cash' | 'meal_card';
    deliverySpeed: 'express' | 'standard';
}
