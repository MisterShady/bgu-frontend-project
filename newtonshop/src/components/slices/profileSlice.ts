import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderResponseDto, ProfileDto } from '../../types';

interface ProfileState {
    avatar: string;
    isMenuOpen: boolean;
    orders: OrderResponseDto[];
    formData: ProfileDto;
    existingProfile: ProfileDto;
    isModalOpen: boolean;
    modalAction: string;
    isChangePassword: boolean;
    passwordData: {
        providedCurrentPassword: string;
        newPassword: string;
        confirmNewPassword: string;
    };
    expandedOrderId: number | null;
}

const initialState: ProfileState = {
    avatar: "/image/account.png",
    isMenuOpen: false,
    orders: [],
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
    isModalOpen: false,
    modalAction: "",
    isChangePassword: false,
    passwordData: {
        providedCurrentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    },
    expandedOrderId: null,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setAvatar: (state, action: PayloadAction<string>) => {
            state.avatar = action.payload;
        },
        setIsMenuOpen: (state, action: PayloadAction<boolean>) => {
            state.isMenuOpen = action.payload;
        },
        setOrders: (state, action: PayloadAction<OrderResponseDto[]>) => {
            state.orders = action.payload;
        },
        setFormData: (state, action: PayloadAction<ProfileDto>) => {
            state.formData = action.payload;
        },
        setExistingProfile: (state, action: PayloadAction<ProfileDto>) => {
            state.existingProfile = action.payload;
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
    },
});

export const {
    setAvatar,
    setIsMenuOpen,
    setOrders,
    setFormData,
    setExistingProfile,
    setIsModalOpen,
    setModalAction,
    setIsChangePassword,
    setPasswordData,
    setExpandedOrderId,
} = profileSlice.actions;

export default profileSlice.reducer;
