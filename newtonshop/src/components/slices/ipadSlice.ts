import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getIpadById, postCartItem } from "../../Api";
import { CartItemRequestDto, IpadDto } from "../../types";

interface IpadState {
  item: IpadDto | null;
  loading: boolean;
  error: string | null;
  selectedImage: string | null;
  selectedColor: string | null;
  selectedStorage: string | null;
  selectedConnectivity: string | null;
  selectedApplePencil: string | null;
  selectedSmartKeyboard: string | null;
  notifications: { id: number; item: CartItemRequestDto }[];
  isAddingToCart: boolean;
}

const initialState: IpadState = {
  item: null,
  loading: false,
  error: null,
  selectedImage: null,
  selectedColor: null,
  selectedStorage: null,
  selectedConnectivity: null,
  selectedApplePencil: null,
  selectedSmartKeyboard: null,
  notifications: [],
  isAddingToCart: false,
};

export const fetchIpadById = createAsyncThunk<IpadDto, string>("ipad/fetchIpadById", async (id) => {
  const response = await getIpadById(id);
  return response;
});

export const addToCart = createAsyncThunk<CartItemRequestDto, CartItemRequestDto>(
  "ipad/addToCart",
  async (cartItem) => {
    await postCartItem(cartItem);
    return cartItem;
  }
);

const ipadSlice = createSlice({
  name: "ipad",
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
    setSelectedConnectivity: (state, action: PayloadAction<string | null>) => {
      state.selectedConnectivity = action.payload;
    },
    setSelectedApplePencil: (state, action: PayloadAction<string | null>) => {
      state.selectedApplePencil = action.payload;
    },
    setSelectedSmartKeyboard: (state, action: PayloadAction<string | null>) => {
      state.selectedSmartKeyboard = action.payload;
    },
    removeNotification: (state, action: PayloadAction<number>) => {
      state.notifications = state.notifications.filter((notification) => notification.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIpadById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIpadById.fulfilled, (state, action: PayloadAction<IpadDto>) => {
        state.loading = false;
        state.item = action.payload;
      })
      .addCase(fetchIpadById.rejected, (state, action) => {
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
  setSelectedColor,
  setSelectedStorage,
  setSelectedConnectivity,
  setSelectedApplePencil,
  setSelectedSmartKeyboard,
  removeNotification,
} = ipadSlice.actions;

export default ipadSlice.reducer;
