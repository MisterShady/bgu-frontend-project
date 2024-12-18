import React from "react";
import { toast, ToastContainer } from "react-toastify";
import { ReactNode } from "react";
import "react-toastify/dist/ReactToastify.css";

export const showSuccess = (message: ReactNode, options?: object) => {
  toast.success(message, {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    ...options,
  });
};

export const showError = (message: ReactNode, options?: object) => {
  toast.error(message, {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    ...options,
  });
};

export const NotificationContainer = () => (
  <ToastContainer
    position="bottom-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={true}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
  />
);
