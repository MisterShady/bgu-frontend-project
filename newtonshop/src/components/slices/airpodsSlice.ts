import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAirpodsById, postCartItem } from "../../Api";
import { AirpodsDto, CartItemRequestDto } from "../../types";

interface AirpodsState {
  item: AirpodsDto | null;
  loading: boolean;
  error: string | null;
  selectedImage: string | null | undefined;
  selectedColor: string | null | undefined;
  notifications: { id: number; item: CartItemRequestDto }[];
  isAddingToCart: boolean;
}

export const fetchAirpodsById = createAsyncThunk<AirpodsDto, string>("airpods/fetchAirpodsById", async (id) => {
  const response = await getAirpodsById(id);
  return response;
});

export const addToCart = createAsyncThunk<CartItemRequestDto, CartItemRequestDto>(
  "airpods/addToCart",
  async (cartItem) => {
    await postCartItem(cartItem);
    return cartItem;
  }
);

const initialState: AirpodsState = {
  item: null,
  loading: false,
  error: null,
  selectedImage: null,
  selectedColor: null,
  notifications: [],
  isAddingToCart: false,
};

const airpodsSlice = createSlice({
  name: "airpods",
  initialState,
  reducers: {
    setSelectedImage: (state, action: PayloadAction<string | null | undefined>) => {
      state.selectedImage = action.payload;
    },
    setSelectedColor: (state, action: PayloadAction<string | null | undefined>) => {
      state.selectedColor = action.payload;
    },
    removeNotification: (state, action: PayloadAction<number>) => {
      state.notifications = state.notifications.filter((notification) => notification.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAirpodsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAirpodsById.fulfilled, (state, action: PayloadAction<AirpodsDto>) => {
        state.loading = false;
        state.item = action.payload;
      })
      .addCase(fetchAirpodsById.rejected, (state, action) => {
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

export const { setSelectedImage, setSelectedColor, removeNotification } = airpodsSlice.actions;

export default airpodsSlice.reducer;
