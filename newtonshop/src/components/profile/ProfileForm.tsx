import React from "react";
import { useDispatch } from "react-redux";
import { setIsChangePassword } from "../slices/profileSlice";

interface FormData {
  username: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  dateOfBirth: string;
}

interface PasswordData {
  providedCurrentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface ProfileFormProps {
  avatar: string;
  formData: FormData;
  isChangePassword: boolean;
  passwordData: PasswordData;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAvatarClick: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpdatePassword: () => void;
  openModal: (action: string) => void;
  openLogoutModal: () => void;
}

const ProfileForm = ({
  avatar,
  formData,
  isChangePassword,
  passwordData,
  handleAvatarChange,
  handleAvatarClick,
  handleChange,
  handlePasswordChange,
  handleUpdatePassword,
  openModal,
  openLogoutModal,
}: ProfileFormProps) => {
  const dispatch = useDispatch();

  return (
    <div className="profile-form-container">
      {isChangePassword ? (
        <>
          <h2 className="change-password-title">Смена пароля</h2>
          <form className="password-form">
            <div className="password-input-container">
              <label htmlFor="providedCurrentPassword">Старый пароль:</label>
              <input
                type="password"
                id="providedCurrentPassword"
                name="providedCurrentPassword"
                value={passwordData.providedCurrentPassword}
                onChange={handlePasswordChange}
                required
                className="password-input"
              />
            </div>
            <div className="password-input-container">
              <label htmlFor="newPassword">Новый пароль:</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                className="password-input"
              />
            </div>
            <div className="password-input-container">
              <label htmlFor="confirmNewPassword">Подтверждение нового пароля:</label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={passwordData.confirmNewPassword}
                onChange={handlePasswordChange}
                required
                className="password-input"
              />
            </div>
            <div className="button-container">
              <button type="button" className="rounded-button" onClick={handleUpdatePassword}>
                Сохранить пароль
              </button>
              <button type="button" className="rounded-button" onClick={() => dispatch(setIsChangePassword(false))}>
                Отмена
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          <div className="avatar-container">
            <div onClick={handleAvatarClick} className="avatar-circle">
              <img src={avatar} alt="Avatar" className="avatar" />
            </div>
            <p className="username">{formData.username}</p>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="file-input"
              style={{ display: "none" }}
            />
          </div>
          <form className="profile-form">
            <div className="input-row">
              <div className="profile-input-container">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  required
                  className="profile-input"
                />
              </div>
              <div className="profile-input-container">
                <label htmlFor="phone">Номер телефона:</label>
                <input
                  type="tel"
                  id="phone"
                  name="phoneNumber"
                  value={formData.phoneNumber || ""}
                  onChange={handleChange}
                  required
                  className="profile-input"
                />
              </div>
            </div>
            <div className="input-row">
              <div className="profile-input-container">
                <label htmlFor="fullName">ФИО:</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName || ""}
                  onChange={handleChange}
                  required
                  className="profile-input"
                />
              </div>
              <div className="profile-input-container">
                <label htmlFor="birthdate">Дата рождения:</label>
                <input
                  type="date"
                  id="birthdate"
                  name="dateOfBirth"
                  value={formData.dateOfBirth || ""}
                  onChange={handleChange}
                  required
                  className="profile-input"
                />
              </div>
            </div>
            <div className="button-container">
              <button type="button" className="rounded-button" onClick={() => dispatch(setIsChangePassword(true))}>
                Сменить пароль
              </button>
              <button type="button" className="rounded-button" onClick={() => openModal("update")}>
                Сохранить профиль
              </button>
              <button type="button" className="rounded-button" onClick={openLogoutModal}>
                Выход
              </button>
              <button
                type="button"
                className="rounded-button delete-profile-button"
                onClick={() => openModal("delete")}
              >
                Удалить профиль
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ProfileForm;
