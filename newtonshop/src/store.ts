import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./components/slices/categorySlice";
import airpodsReducer from "./components/slices/airpodsSlice";
import productsReducer from "./components/slices/productsSlice";
import ipadReducer from "./components/slices/ipadSlice";
import iphoneReducer from "./components/slices/iphoneSlice";
import macReducer from "./components/slices/macSlice";
import watchReducer from "./components/slices/watchSlice";
import authSlice from "./components/slices/authSlice";
import cartSlice from "./components/slices/cartSlice";
import profileSlice from "./components/slices/profileSlice";

const store = configureStore({
  reducer: {
    category: categoryReducer,
    airpods: airpodsReducer,
    products: productsReducer,
    ipad: ipadReducer,
    iphone: iphoneReducer,
    mac: macReducer,
    watch: watchReducer,
    auth: authSlice,
    cart: cartSlice,
    profile: profileSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
