import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getWatchById, postCartItem } from "../../Api";
import { CartItemRequestDto, WatchDto } from "../../types";

interface WatchState {
  item: WatchDto | null;
  loading: boolean;
  error: string | null;
  selectedImage: string | null;
  selectedBandTypeIndex: number | null;
  selectedBandStyleIndex: number | null;
  selectedCaseIndex: number | null;
  selectedVersionIndex: number | null;
  selectedSizeIndex: number | null;
  notifications: { id: number; item: CartItemRequestDto }[];
  isAddingToCart: boolean;
}

const initialState: WatchState = {
  item: null,
  loading: false,
  error: null,
  selectedImage: null,
  selectedBandTypeIndex: null,
  selectedBandStyleIndex: null,
  selectedCaseIndex: null,
  selectedVersionIndex: null,
  selectedSizeIndex: null,
  notifications: [],
  isAddingToCart: false,
};

export const fetchWatchById = createAsyncThunk<WatchDto, string>("watch/fetchWatchById", async (id) => {
  const response = await getWatchById(id);
  return response;
});

export const addToCart = createAsyncThunk<CartItemRequestDto, CartItemRequestDto>(
  "watch/addToCart",
  async (cartItem) => {
    await postCartItem(cartItem);
    return cartItem;
  }
);

const watchSlice = createSlice({
  name: "watch",
  initialState,
  reducers: {
    setSelectedImage: (state, action: PayloadAction<string | null>) => {
      state.selectedImage = action.payload;
    },
    setSelectedBandTypeIndex: (state, action: PayloadAction<number | null>) => {
      state.selectedBandTypeIndex = action.payload;
    },
    setSelectedBandStyleIndex: (state, action: PayloadAction<number | null>) => {
      state.selectedBandStyleIndex = action.payload;
    },
    setSelectedCaseIndex: (state, action: PayloadAction<number | null>) => {
      state.selectedCaseIndex = action.payload;
    },
    setSelectedVersionIndex: (state, action: PayloadAction<number | null>) => {
      state.selectedVersionIndex = action.payload;
    },
    setSelectedSizeIndex: (state, action: PayloadAction<number | null>) => {
      state.selectedSizeIndex = action.payload;
    },
    removeNotification: (state, action: PayloadAction<number>) => {
      state.notifications = state.notifications.filter((notification) => notification.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWatchById.fulfilled, (state, action: PayloadAction<WatchDto>) => {
        state.loading = false;
        state.item = action.payload;
      })
      .addCase(fetchWatchById.rejected, (state, action) => {
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

export const {
  setSelectedImage,
  setSelectedBandTypeIndex,
  setSelectedBandStyleIndex,
  setSelectedCaseIndex,
  setSelectedVersionIndex,
  setSelectedSizeIndex,
  removeNotification,
} = watchSlice.actions;

export default watchSlice.reducer;
