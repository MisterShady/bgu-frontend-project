import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { postSignIn } from "../Api";
import "./Auth.css";

type FormData = {
  username: string;
  password: string;
};

const Login = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await postSignIn(data);
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="auth-input-container">
          <label htmlFor="username">Логин:</label>
          <input
            type="text"
            id="username"
            {...register("username", { required: true })}
            className="auth-input-container input"
          />
        </div>
        <div className="auth-input-container">
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            {...register("password", { required: true })}
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
