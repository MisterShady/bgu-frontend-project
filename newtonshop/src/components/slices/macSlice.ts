import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getMacById, postCartItem } from "../../Api";
import { CartItemRequestDto, MacDto } from "../../types";

interface MacState {
  item: MacDto | null;
  loading: boolean;
  error: string | null;
  selectedImage: string | null;
  selectedColor: string | null;
  selectedStorage: string | null;
  selectedRam: string | null;
  notifications: { id: number; item: CartItemRequestDto }[];
  isAddingToCart: boolean;
}

const initialState: MacState = {
  item: null,
  loading: false,
  error: null,
  selectedImage: null,
  selectedColor: null,
  selectedStorage: null,
  selectedRam: null,
  notifications: [],
  isAddingToCart: false,
};

export const fetchMacById = createAsyncThunk<MacDto, string>("mac/fetchMacById", async (id) => {
  return await getMacById(id);
});

export const addToCart = createAsyncThunk<CartItemRequestDto, CartItemRequestDto>("mac/addToCart", async (cartItem) => {
  await postCartItem(cartItem);
  return cartItem;
});

const macSlice = createSlice({
  name: "mac",
  initialState,
  reducers: {
    setSelectedImage: (state, action: PayloadAction<string | null>) => {
      state.selectedImage = action.payload;
    },
    setSelectedColor: (state, action: PayloadAction<string | null>) => {
      state.selectedColor = action.payload;
    },
    setSelectedStorage: (state, action: PayloadAction<string | null>) => {
      state.selectedStorage = action.payload;
    },
    setSelectedRam: (state, action: PayloadAction<string | null>) => {
      state.selectedRam = action.payload;
    },
    removeNotification: (state, action: PayloadAction<number>) => {
      state.notifications = state.notifications.filter((notification) => notification.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMacById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMacById.fulfilled, (state, action: PayloadAction<MacDto>) => {
        state.loading = false;
        state.item = action.payload;
      })
      .addCase(fetchMacById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка загрузки данных";
      })
      .addCase(addToCart.pending, (state) => {
        state.isAddingToCart = true;
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartItemRequestDto>) => {
        state.isAddingToCart = false;
        state.notifications.push({ id: Date.now(), item: action.payload });
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isAddingToCart = false;
        console.error("Ошибка при добавлении товара в корзину:", action.error.message);
      });
  },
});

export const { setSelectedImage, setSelectedColor, setSelectedStorage, setSelectedRam } =
  macSlice.actions;

export default macSlice.reducer;
