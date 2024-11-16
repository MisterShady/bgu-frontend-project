import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItemDto, OrderRequestDto } from '../../types';

interface CartState {
    items: CartItemDto[];
    customerData: {
        fullName: string;
        phone: string;
        email: string;
    };
    deliveryInfo: string;
    paymentMethod: string;
    currentStep: number;
    notifications: { id: number; item: CartItemDto }[];
}

const initialState: CartState = {
    items: [],
    customerData: {
        fullName: "",
        phone: "",
        email: "",
    },
    deliveryInfo: "",
    paymentMethod: "",
    currentStep: 1,
    notifications: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setItems: (state, action: PayloadAction<CartItemDto[]>) => {
            state.items = action.payload;
        },
        setCustomerData: (state, action: PayloadAction<CartState['customerData']>) => {
            state.customerData = action.payload;
        },
        setDeliveryInfo: (state, action: PayloadAction<string>) => {
            state.deliveryInfo = action.payload;
        },
        setPaymentMethod: (state, action: PayloadAction<string>) => {
            state.paymentMethod = action.payload;
        },
        setCurrentStep: (state, action: PayloadAction<number>) => {
            state.currentStep = action.payload;
        },
        addNotification: (state, action: PayloadAction<{ id: number; item: CartItemDto }>) => {
            state.notifications.push(action.payload);
        },
        removeNotification: (state, action: PayloadAction<number>) => {
            state.notifications = state.notifications.filter((notification) => notification.id !== action.payload);
        },
        updateItem: (state, action: PayloadAction<CartItemDto>) => {
            state.items = state.items.map((item) => (item.id === action.payload.id ? action.payload : item));
        },
        removeItem: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
    },
});

export const {
    setItems,
    setCustomerData,
    setDeliveryInfo,
    setPaymentMethod,
    setCurrentStep,
    addNotification,
    removeNotification,
    updateItem,
    removeItem,
} = cartSlice.actions;

export default cartSlice.reducer;
