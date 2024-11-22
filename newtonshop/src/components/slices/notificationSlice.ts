import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItemDto, CartItemRequestDto } from "../../types";

interface Notification {
  item: CartItemDto | CartItemRequestDto;
  operation: "add" | "remove" | "order-confirmation";
  id: number;
}

interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.push(action.payload);
    },
    removeNotification(state, action: PayloadAction<number>) {
      state.notifications = state.notifications.filter((notification) => notification.id !== action.payload);
    },
  },
});

export const { addNotification, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
