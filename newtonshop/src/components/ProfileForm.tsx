import React, { useState, useEffect } from "react";
import "./Profile.css";
import LazyLoad from "react-lazyload";
import { getCurrentProfile } from '../Api';
import { UserDto } from "../types";

const ProfileForm = () => {
  const [avatar, setAvatar] = useState<string>("/image/account.png");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [orders] = useState<string[]>([]);
  const [userData, setUserData] = useState<UserDto | null>(null);
  const [formData, setFormData] = useState<UserDto>({
    id: 0,
    email: '',
    phoneNumber: '',
    fullName: '',
    dateOfBirth: '',
    username: '',
    password: '',
    role: '',
    credentialsNonExpired: true,
    accountNonExpired: true,
    accountNonLocked: true,
    authorities: [],
    enabled: true,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const data = await getCurrentProfile(token);
          setUserData(data);
          setFormData(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAvatar(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleAvatarClick = () => {
    document.getElementById("avatar-upload")?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-form-container">
        <div
          className="avatar-container"
          onMouseEnter={() => setIsMenuOpen(true)}
          onMouseLeave={() => setIsMenuOpen(false)}
          onClick={handleAvatarClick}
        >
          <LazyLoad>
            <img src={avatar} alt="Avatar" className="avatar" />
          </LazyLoad>
          {isMenuOpen && (
            <div>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="file-input"
                style={{ display: "none" }}
              />
            </div>
          )}
        </div>
        <form className="profile-form">
          <div className="input-row">
            <div className="profile-input-container">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" value={formData.email || ''} onChange={handleChange} required className="profile-input" />
            </div>
            <div className="profile-input-container">
              <label htmlFor="phone">Номер телефона:</label>
              <input type="tel" id="phone" name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleChange} required className="profile-input" />
            </div>
          </div>
          <div className="input-row">
            <div className="profile-input-container">
              <label htmlFor="firstName">Имя:</label>
              <input type="text" id="firstName" name="fullName" value={formData.fullName.split(' ')[0] || ''} onChange={handleChange} required className="profile-input" />
            </div>
            <div className="profile-input-container">
              <label htmlFor="lastName">Фамилия:</label>
              <input type="text" id="lastName" name="fullName" value={formData.fullName.split(' ')[1] || ''} onChange={handleChange} required className="profile-input" />
            </div>
          </div>
          <div className="input-row">
            <div className="profile-input-container">
              <label htmlFor="birthdate">Дата рождения:</label>
              <input type="date" id="birthdate" name="dateOfBirth" value={formData.dateOfBirth || ''} onChange={handleChange} required className="profile-input" />
            </div>
            <div className="profile-input-container">
              <label htmlFor="username">Логин:</label>
              <input type="text" id="username" name="username" value={formData.username || ''} onChange={handleChange} required className="profile-input" />
            </div>
          </div>
          <div className="button-container">
            <button type="button" className="rounded-button">
              Сменить пароль
            </button>
            <button type="submit" className="rounded-button">
              Сохранить профиль
            </button>
            <button type="button" className="rounded-button">
              Выход
            </button>
            <button type="button" className="rounded-button delete-profile-button">
              Удалить профиль
            </button>
          </div>
        </form>
      </div>
      <h3 className="orders-title">Ваши заказы</h3>
      <div className="orders-container">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div key={index} className="order-item">
              {order}
            </div>
          ))
        ) : (
          <div className="no-orders">У вас пока нет заказов</div>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;
