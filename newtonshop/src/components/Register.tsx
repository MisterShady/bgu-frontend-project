import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postSignUp } from "../Api";
import "./Auth.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Пароли не совпадают");
      return;
    }

    try {
      const userData = {
        email,
        phoneNumber: phone,
        fullName: `${firstName} ${lastName}`,
        dateOfBirth: birthDate,
        username,
        password,
      };

      await postSignUp(userData);
      alert("Регистрация успешна");
      navigate("/login");
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      alert("Ошибка регистрации");
    }
  };

  return (
    <div className="auth-container">
      <Link to="/" className="back-button">
        ←
      </Link>
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <div className="auth-input-container">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input-container input"
          />
        </div>
        <div className="auth-input-container">
          <label htmlFor="phone">Номер телефона:</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="auth-input-container input"
          />
        </div>
        <div className="auth-input-container">
          <label htmlFor="firstName">Имя:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="auth-input-container input"
          />
        </div>
        <div className="auth-input-container">
          <label htmlFor="lastName">Фамилия:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="auth-input-container input"
          />
        </div>
        <div className="auth-input-container">
          <label htmlFor="birthDate">Дата рождения:</label>
          <input
            type="date"
            id="birthDate"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
            className="auth-input-container input"
          />
        </div>
        <div className="auth-input-container">
          <label htmlFor="username">Логин:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="auth-input-container input"
          />
        </div>
        <div className="auth-input-container">
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input-container input"
          />
        </div>
        <div className="auth-input-container">
          <label htmlFor="confirmPassword">Подтверждение пароля:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="auth-input-container input"
          />
        </div>
        <button type="submit" className="submit-button">
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};

export default Register;
