import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    isLogin: boolean;
    backendError: string | null;
    accessToken: string | null;
}

const initialState: AuthState = {
    isLogin: true,
    backendError: null,
    accessToken: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsLogin: (state, action: PayloadAction<boolean>) => {
            state.isLogin = action.payload;
        },
        setBackendError: (state, action: PayloadAction<string | null>) => {
            state.backendError = action.payload;
        },
        setAccessToken: (state, action: PayloadAction<string | null>) => {
            state.accessToken = action.payload;
        },
    },
});

export const { setIsLogin, setBackendError, setAccessToken } = authSlice.actions;

export default authSlice.reducer;
