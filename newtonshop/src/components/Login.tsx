import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postSignIn } from "../Api";
import "./Auth.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userData = {
        username,
        password,
      };

      const response = await postSignIn(userData);
      const { token } = response;

      localStorage.setItem("token", token);

      navigate("/profile");
    } catch (error) {
      console.error("Ошибка авторизации:", error);
      alert("Ошибка авторизации");
    }
  };

  return (
    <div className="auth-container">
      <Link to="/" className="back-button">
        ←
      </Link>
      <h2>Авторизация</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit" className="submit-button">
          Войти
        </button>
      </form>
      <p>
        У меня нет аккаунта. <Link to="/register">Зарегистрироваться</Link>
      </p>
    </div>
  );
};

export default Login;
