import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store";
import {
  setAvatar,
  setExistingProfile,
  setExpandedOrderId,
  setFormData,
  setIsChangePassword,
  setIsLogoutModalOpen,
  setIsModalOpen,
  setModalAction,
  setOrders,
  setPasswordData,
} from "../slices/profileSlice";
import { deleteProfile, getCurrentProfile, getOrders, updateAvatar, updatePassword, updateProfile } from "../../Api";
import { OrderResponseDto, ProfileDto } from "../../types";
import ProfileForm from "./ProfileForm";
import Orders from "./Orders";
import Modals from "./Modals";
import "./Profile.css";
import { base64ToBlob } from "../../utils";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    avatar,
    formData,
    existingProfile,
    orders,
    isModalOpen,
    modalAction,
    isChangePassword,
    passwordData,
    expandedOrderId,
    isLogoutModalOpen,
  } = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getCurrentProfile();
      dispatch(setFormData(data));
      dispatch(setExistingProfile(data));
      dispatch(setAvatar(data.avatar ? `data:image/jpeg;base64,${data.avatar}` : "/image/png/account.png"));
    };

    const fetchOrders = async () => {
      const data: OrderResponseDto[] = await getOrders();
      dispatch(setOrders(data));
    };

    fetchUserData();
    fetchOrders();
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/auth");
    const event = new Event("logout");
    window.dispatchEvent(event);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64String = reader.result?.toString().split(",")[1];
        if (base64String) {
          dispatch(setAvatar(`data:image/jpeg;base64,${base64String}`));
          dispatch(setFormData({ ...formData, avatar: base64String }));
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    document.getElementById("avatar-upload")?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(setFormData({ ...formData, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(setPasswordData({ ...passwordData, [name]: value }));
  };

  const handleDeleteProfile = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      await deleteProfile(accessToken);
      handleLogout();
    }
  };

  const handleUpdateProfile = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const updatedData: Partial<ProfileDto> = {};

      if (formData.email && formData.email !== existingProfile.email) updatedData.email = formData.email;
      if (formData.phoneNumber && formData.phoneNumber !== existingProfile.phoneNumber)
        updatedData.phoneNumber = formData.phoneNumber;
      if (formData.fullName && formData.fullName !== existingProfile.fullName) updatedData.fullName = formData.fullName;
      if (formData.dateOfBirth && formData.dateOfBirth !== existingProfile.dateOfBirth)
        updatedData.dateOfBirth = formData.dateOfBirth;
      if (formData.avatar && formData.avatar !== existingProfile.avatar) updatedData.avatar = formData.avatar;

      Object.keys(updatedData).forEach((key) => {
        if (!updatedData[key as keyof Partial<ProfileDto>]) {
          delete updatedData[key as keyof Partial<ProfileDto>];
        }
      });

      const updatedProfile = await updateProfile(accessToken, updatedData);
      dispatch(setFormData(updatedProfile));
      dispatch(setExistingProfile(updatedProfile));

      if (formData.avatar && formData.avatar !== existingProfile.avatar) {
        const file = new File([base64ToBlob(formData.avatar)], "avatar.jpg", { type: "image/jpeg" });
        await updateAvatar(accessToken, file);
      }

      window.location.reload();
    }
  };

  const handleUpdatePassword = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      if (passwordData.newPassword !== passwordData.confirmNewPassword) {
        alert("Новый пароль и подтверждение нового пароля не совпадают");
        return;
      }

      const updatedProfile = await updatePassword(accessToken, {
        providedCurrentPassword: passwordData.providedCurrentPassword,
        newPassword: passwordData.newPassword,
      });
      dispatch(setFormData(updatedProfile));
      dispatch(setExistingProfile(updatedProfile));
      dispatch(setIsChangePassword(false));
    }
  };

  const openModal = (action: string) => {
    dispatch(setModalAction(action));
    dispatch(setIsModalOpen(true));
  };

  const closeModal = () => {
    dispatch(setIsModalOpen(false));
  };

  const openLogoutModal = () => {
    dispatch(setIsLogoutModalOpen(true));
  };

  const closeLogoutModal = () => {
    dispatch(setIsLogoutModalOpen(false));
  };

  const handleModalConfirm = () => {
    if (modalAction === "delete") {
      handleDeleteProfile();
    } else if (modalAction === "update") {
      handleUpdateProfile();
    }
    closeModal();
  };

  const handleLogoutConfirm = () => {
    handleLogout();
    closeLogoutModal();
  };

  const toggleOrderDetails = (orderId: number) => {
    dispatch(setExpandedOrderId(expandedOrderId === orderId ? null : orderId));
  };

  const formatCardNumber = (cardNumber: string) => {
    const lastTwoDigits = cardNumber.slice(-2);
    return "*".repeat(cardNumber.length - 2) + lastTwoDigits;
  };

  return (
    <div className="profile-wrapper">
      <ProfileForm
        avatar={avatar}
        formData={formData}
        isChangePassword={isChangePassword}
        passwordData={passwordData}
        handleAvatarChange={handleAvatarChange}
        handleAvatarClick={handleAvatarClick}
        handleChange={handleChange}
        handlePasswordChange={handlePasswordChange}
        handleUpdatePassword={handleUpdatePassword}
        openModal={openModal}
        openLogoutModal={openLogoutModal}
      />
      <Orders
        orders={orders}
        expandedOrderId={expandedOrderId}
        toggleOrderDetails={toggleOrderDetails}
        formatCardNumber={formatCardNumber}
      />
      <Modals
        isModalOpen={isModalOpen}
        modalAction={modalAction}
        isLogoutModalOpen={isLogoutModalOpen}
        closeModal={closeModal}
        closeLogoutModal={closeLogoutModal}
        handleModalConfirm={handleModalConfirm}
        handleLogoutConfirm={handleLogoutConfirm}
      />
    </div>
  );
};

export default Profile;
