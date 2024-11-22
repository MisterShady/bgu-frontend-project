import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getIphoneById, postCartItem } from "../../Api";
import { CartItemRequestDto, IphoneDto } from "../../types";

interface IphoneState {
  item: IphoneDto | null;
  loading: boolean;
  error: string | null;
  selectedImage: string | null;
  selectedColor: string | null;
  selectedStorage: string | null;
  notifications: { id: number; item: CartItemRequestDto }[];
  isAddingToCart: boolean;
}

const initialState: IphoneState = {
  item: null,
  loading: false,
  error: null,
  selectedImage: null,
  selectedColor: null,
  selectedStorage: null,
  notifications: [],
  isAddingToCart: false,
};

export const fetchIphoneById = createAsyncThunk<IphoneDto, string>("iphone/fetchIphoneById", async (id) => {
  const response = await getIphoneById(id);
  return response;
});

export const addToCart = createAsyncThunk<CartItemRequestDto, CartItemRequestDto>(
  "iphone/addToCart",
  async (cartItem) => {
    await postCartItem(cartItem);
    return cartItem;
  }
);

const iphoneSlice = createSlice({
  name: "iphone",
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
    removeNotification: (state, action: PayloadAction<number>) => {
      state.notifications = state.notifications.filter((notification) => notification.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIphoneById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIphoneById.fulfilled, (state, action: PayloadAction<IphoneDto>) => {
        state.loading = false;
        state.item = action.payload;
      })
      .addCase(fetchIphoneById.rejected, (state, action) => {
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

export const { setSelectedImage, setSelectedColor, setSelectedStorage, removeNotification } = iphoneSlice.actions;

export default iphoneSlice.reducer;
