import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { postSignUp } from "../Api";
import "./Auth.css";

interface RegisterFormInputs {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>();
  const navigate = useNavigate();
  const password = watch("password");

  const onSubmit = async (data: RegisterFormInputs) => {
    if (data.password !== data.confirmPassword) {
      alert("Пароли не совпадают");
      return;
    }

    try {
      const userData = {
        email: data.email,
        phoneNumber: data.phone,
        fullName: `${data.firstName} ${data.lastName}`,
        dateOfBirth: data.birthDate,
        username: data.username,
        password: data.password,
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
      <form onSubmit={handleSubmit(onSubmit)}>
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
                value: /^[0-9]{10,15}$/,
                message: "Некорректный номер телефона",
              },
            })}
            className="auth-input-container input"
          />
          {errors.phone && <p>{errors.phone.message}</p>}
        </div>

        <div className="auth-input-container">
          <label htmlFor="firstName">Имя:</label>
          <input
            type="text"
            id="firstName"
            {...register("firstName", { required: "Поле имя обязательно" })}
            className="auth-input-container input"
          />
          {errors.firstName && <p>{errors.firstName.message}</p>}
        </div>

        <div className="auth-input-container">
          <label htmlFor="lastName">Фамилия:</label>
          <input
            type="text"
            id="lastName"
            {...register("lastName", { required: "Поле фамилия обязательно" })}
            className="auth-input-container input"
          />
          {errors.lastName && <p>{errors.lastName.message}</p>}
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

        <button type="submit" className="submit-button">
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};

export default Register;
