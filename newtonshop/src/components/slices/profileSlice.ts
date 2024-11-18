import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProfileDto, OrderResponseDto } from '../../types';

interface ProfileState {
    avatar: string;
    formData: ProfileDto;
    existingProfile: ProfileDto;
    orders: OrderResponseDto[];
    isModalOpen: boolean;
    modalAction: string;
    isChangePassword: boolean;
    passwordData: {
        providedCurrentPassword: string;
        newPassword: string;
        confirmNewPassword: string;
    };
    expandedOrderId: number | null;
    isLogoutModalOpen: boolean;
}

const initialState: ProfileState = {
    avatar: "/image/png/account.png",
    formData: {
        id: 0,
        email: "",
        phoneNumber: "",
        fullName: "",
        dateOfBirth: "",
        username: "",
        avatar: "",
        password: "",
        role: "",
        credentialsNonExpired: true,
        accountNonExpired: true,
        accountNonLocked: true,
        authorities: [],
        enabled: true,
    },
    existingProfile: {
        id: 0,
        email: "",
        phoneNumber: "",
        fullName: "",
        dateOfBirth: "",
        username: "",
        avatar: "",
        password: "",
        role: "",
        credentialsNonExpired: true,
        accountNonExpired: true,
        accountNonLocked: true,
        authorities: [],
        enabled: true,
    },
    orders: [],
    isModalOpen: false,
    modalAction: "",
    isChangePassword: false,
    passwordData: {
        providedCurrentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    },
    expandedOrderId: null,
    isLogoutModalOpen: false,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setAvatar: (state, action: PayloadAction<string>) => {
            state.avatar = action.payload;
        },
        setFormData: (state, action: PayloadAction<ProfileDto>) => {
            state.formData = action.payload;
        },
        setExistingProfile: (state, action: PayloadAction<ProfileDto>) => {
            state.existingProfile = action.payload;
        },
        setOrders: (state, action: PayloadAction<OrderResponseDto[]>) => {
            state.orders = action.payload;
        },
        setIsModalOpen: (state, action: PayloadAction<boolean>) => {
            state.isModalOpen = action.payload;
        },
        setModalAction: (state, action: PayloadAction<string>) => {
            state.modalAction = action.payload;
        },
        setIsChangePassword: (state, action: PayloadAction<boolean>) => {
            state.isChangePassword = action.payload;
        },
        setPasswordData: (state, action: PayloadAction<{
            providedCurrentPassword: string;
            newPassword: string;
            confirmNewPassword: string;
        }>) => {
            state.passwordData = action.payload;
        },
        setExpandedOrderId: (state, action: PayloadAction<number | null>) => {
            state.expandedOrderId = action.payload;
        },
        setIsLogoutModalOpen: (state, action: PayloadAction<boolean>) => {
            state.isLogoutModalOpen = action.payload;
        },
    },
});

export const {
    setAvatar,
    setFormData,
    setExistingProfile,
    setOrders,
    setIsModalOpen,
    setModalAction,
    setIsChangePassword,
    setPasswordData,
    setExpandedOrderId,
    setIsLogoutModalOpen,
} = profileSlice.actions;

export default profileSlice.reducer;
