import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getProductsByCategory, ProductDto } from "../../Api";

interface ProductsState {
  items: ProductDto[];
  loading: boolean;
  error: string | null;
}

export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchProductsByCategory",
  async (category: string) => {
    return await getProductsByCategory(category);
  }
);

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action: PayloadAction<ProductDto[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка загрузки данных";
      });
  },
});

export default categorySlice.reducer;
