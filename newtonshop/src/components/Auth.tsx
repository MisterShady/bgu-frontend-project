import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { postSignIn, postSignUp } from "../Api";
import { setAccessToken, setBackendError, setIsLogin } from "./slices/authSlice";
import "./Auth.css";
import { AppDispatch } from "../store";

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

interface RootState {
  auth: {
    isLogin: boolean;
    backendError: string | null;
    accessToken: string | null;
  };
}

const Auth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLogin, backendError} = useSelector((state: RootState) => state.auth);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<FormData & RegisterFormInputs>();
  const navigate = useNavigate();
  const location = useLocation();
  const password = watch("password");

  useEffect(() => {
    if (location.state && location.state.message) {
      dispatch(setBackendError(location.state.message));
    }
  }, [location.state, dispatch]);

  const onSubmit = async (data: FormData & RegisterFormInputs) => {
    if (!isLogin && data.password !== data.confirmPassword) {
      setError("confirmPassword", { type: "custom", message: "Пароли не совпадают" });
      return;
    }

    try {
      if (isLogin) {
        const response = await postSignIn(data);
        const { accessToken } = response;

        localStorage.setItem("accessToken", accessToken);
        dispatch(setAccessToken(accessToken));

        const event = new Event("login");
        window.dispatchEvent(event);

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

        const response = await postSignIn(data);
        const { accessToken } = response;

        localStorage.setItem("accessToken", accessToken);
        dispatch(setAccessToken(accessToken));

        const event = new Event("login");
        window.dispatchEvent(event);

        navigate("/profile");
      }
    } catch (error) {
      console.error("Ошибка:", error);
      dispatch(setBackendError(isLogin ? "Ошибка авторизации" : "Ошибка регистрации"));
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
              {errors.email && <p className="error-message">{errors.email.message}</p>}
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
              {errors.phone && <p className="error-message">{errors.phone.message}</p>}
            </div>

            <div className="auth-input-container">
              <label htmlFor="fullName">ФИО:</label>
              <input
                type="text"
                id="fullName"
                {...register("fullName", { required: "Поле ФИО обязательно" })}
                className="auth-input-container input"
              />
              {errors.fullName && <p className="error-message">{errors.fullName.message}</p>}
            </div>

            <div className="auth-input-container">
              <label htmlFor="birthDate">Дата рождения:</label>
              <input
                type="date"
                id="birthDate"
                {...register("birthDate", { required: "Поле дата рождения обязательно" })}
                className="auth-input-container input"
              />
              {errors.birthDate && <p className="error-message">{errors.birthDate.message}</p>}
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
          {errors.username && <p className="error-message">{errors.username.message}</p>}
        </div>

        <div className="auth-input-container">
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            {...register("password", { required: "Поле пароль обязательно" })}
            className="auth-input-container input"
          />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
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
            {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
          </div>
        )}

        {backendError && <h1 className="backend-error-message">{backendError}</h1>}

        <button type="submit" className="submit-button">
          {isLogin ? "Войти" : "Зарегистрироваться"}
        </button>
      </form>
      <p>
        {isLogin ? "У меня нет аккаунта. " : "У меня есть аккаунт. "}
        <a
          href="#"
          onClick={() => {
            dispatch(setIsLogin(!isLogin));
            dispatch(setBackendError(null));
          }}
        >
          {isLogin ? "Зарегистрироваться" : "Войти"}
        </a>
      </p>
    </div>
  );
};

export default Auth;
