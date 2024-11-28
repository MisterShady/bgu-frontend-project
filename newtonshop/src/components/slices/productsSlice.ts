import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getProductsByPage, ProductDto } from "../../Api";

interface ProductsState {
  products: ProductDto[];
  loading: boolean;
  error: string | null;
  page: number;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
  page: 0,
};

export const fetchProductsByPage = createAsyncThunk<ProductDto[], number>(
  "products/fetchProductsByPage",
  async (page) => {
    return await getProductsByPage(page, 8, "id,DESC");
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByPage.fulfilled, (state, action: PayloadAction<ProductDto[]>) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsByPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка загрузки данных";
      });
  },
});

export const { setPage } = productsSlice.actions;

export default productsSlice.reducer;
