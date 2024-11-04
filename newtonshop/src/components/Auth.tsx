import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { postSignIn, postSignUp } from "../Api";
import "./Auth.css";
import Cookies from "js-cookie";

type FormData = {
  username: string;
  password: string;
};

interface RegisterFormInputs {
  email: string;
  phone: string;
  fullName: string;
  birthDate: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData & RegisterFormInputs>();
  const navigate = useNavigate();
  const password = watch("password");

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      navigate("/profile");
    }
  }, [navigate]);

  const onSubmit = async (data: FormData & RegisterFormInputs) => {
    if (!isLogin && data.password !== data.confirmPassword) {
      alert("Пароли не совпадают");
      return;
    }

    try {
      if (isLogin) {
        const response = await postSignIn(data);
        const { accessToken, refreshToken } = response;

        Cookies.set("accessToken", accessToken);
        Cookies.set("refreshToken", refreshToken);

        navigate("/profile");
      } else {
        const userData = {
          email: data.email,
          phoneNumber: data.phone,
          fullName: data.fullName,
          dateOfBirth: data.birthDate,
          username: data.username,
          password: data.password,
        };

        await postSignUp(userData);
        alert("Регистрация успешна");
        navigate("/auth");
      }
    } catch (error) {
      console.error("Ошибка:", error);
      alert(isLogin ? "Ошибка авторизации" : "Ошибка регистрации");
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Авторизация" : "Регистрация"}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!isLogin && (
          <>
            <div className="auth-input-container">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                {...register("email", {
                  required: "Поле email обязательно",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Некорректный email",
                  },
                })}
                className="auth-input-container input"
              />
              {errors.email && <p>{errors.email.message}</p>}
            </div>

            <div className="auth-input-container">
              <label htmlFor="phone">Номер телефона:</label>
              <input
                type="tel"
                id="phone"
                {...register("phone", {
                  required: "Поле телефон обязательно",
                  pattern: {
                    value: /^\+[1-9]\d{1,14}$/,
                    message: "Некорректный номер телефона",
                  },
                })}
                className="auth-input-container input"
              />
              {errors.phone && <p>{errors.phone.message}</p>}
            </div>

            <div className="auth-input-container">
              <label htmlFor="fullName">ФИО:</label>
              <input
                type="text"
                id="fullName"
                {...register("fullName", { required: "Поле ФИО обязательно" })}
                className="auth-input-container input"
              />
              {errors.fullName && <p>{errors.fullName.message}</p>}
            </div>

            <div className="auth-input-container">
              <label htmlFor="birthDate">Дата рождения:</label>
              <input
                type="date"
                id="birthDate"
                {...register("birthDate", { required: "Поле дата рождения обязательно" })}
                className="auth-input-container input"
              />
              {errors.birthDate && <p>{errors.birthDate.message}</p>}
            </div>
          </>
        )}

        <div className="auth-input-container">
          <label htmlFor="username">Логин:</label>
          <input
            type="text"
            id="username"
            {...register("username", { required: "Поле логин обязательно" })}
            className="auth-input-container input"
          />
          {errors.username && <p>{errors.username.message}</p>}
        </div>

        <div className="auth-input-container">
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            {...register("password", {
              required: "Поле пароль обязательно",
              minLength: { value: 6, message: "Пароль должен содержать минимум 6 символов" },
            })}
            className="auth-input-container input"
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        {!isLogin && (
          <div className="auth-input-container">
            <label htmlFor="confirmPassword">Подтверждение пароля:</label>
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword", {
                validate: (value) => value === password || "Пароли должны совпадать",
              })}
              className="auth-input-container input"
            />
            {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
          </div>
        )}

        <button type="submit" className="submit-button">
          {isLogin ? "Войти" : "Зарегистрироваться"}
        </button>
      </form>
      <p>
        {isLogin ? "У меня нет аккаунта. " : "У меня есть аккаунт. "}
        <a href="#" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Зарегистрироваться" : "Войти"}
        </a>
      </p>
    </div>
  );
};

export default Auth;
