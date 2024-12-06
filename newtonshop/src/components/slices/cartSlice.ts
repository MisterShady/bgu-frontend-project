import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItemDto } from "../../types";

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
  removalQueue: CartItemDto[];
  currentRemovalIndex: number;
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
  removalQueue: [],
  currentRemovalIndex: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<CartItemDto[]>) => {
      state.items = action.payload;
    },
    setCustomerData: (state, action: PayloadAction<CartState["customerData"]>) => {
      state.customerData = action.payload;
    },
    setDeliveryInfo: (state, action: PayloadAction<string>) => {
      state.deliveryInfo = action.payload;
    },
    setPaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethod = action.payload;
    },
    updateItem: (state, action: PayloadAction<CartItemDto>) => {
      state.items = state.items.map((item) => (item.id === action.payload.id ? action.payload : item));
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setRemovalQueue: (state, action: PayloadAction<CartItemDto[]>) => {
      state.removalQueue = action.payload;
    },
    clearRemovalQueue: (state) => {
      state.removalQueue = [];
    },
    setCurrentRemovalIndex: (state, action: PayloadAction<number>) => {
      state.currentRemovalIndex = action.payload;
    },
  },
});

export const {
  setItems,
  setCustomerData,
  setDeliveryInfo,
  setPaymentMethod,
  updateItem,
  removeItem,
  setRemovalQueue,
  clearRemovalQueue,
  setCurrentRemovalIndex,
} = cartSlice.actions;

export default cartSlice.reducer;
