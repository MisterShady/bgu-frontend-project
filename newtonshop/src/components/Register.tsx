import React from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const Register = () => {
    return (
        <div className="auth-container">
            <Link to="/" className="back-button">←</Link>
            <h2>Регистрация</h2>
            <form>
                <div className="auth-input-container">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" required className="auth-input-container input" />
                </div>
                <div className="auth-input-container">
                    <label htmlFor="phone">Номер телефона:</label>
                    <input type="tel" id="phone" required className="auth-input-container input" />
                </div>
                <div className="auth-input-container">
                    <label htmlFor="firstName">Имя:</label>
                    <input type="text" id="firstName" required className="auth-input-container input" />
                </div>
                <div className="auth-input-container">
                    <label htmlFor="lastName">Фамилия:</label>
                    <input type="text" id="lastName" required className="auth-input-container input" />
                </div>
                <div className="auth-input-container">
                    <label htmlFor="birthDate">Дата рождения:</label>
                    <input type="date" id="birthDate" required className="auth-input-container input" />
                </div>
                <div className="auth-input-container">
                    <label htmlFor="username">Логин:</label>
                    <input type="text" id="username" required className="auth-input-container input" />
                </div>
                <div className="auth-input-container">
                    <label htmlFor="password">Пароль:</label>
                    <input type="password" id="password" required className="auth-input-container input" />
                </div>
                <div className="auth-input-container">
                    <label htmlFor="confirmPassword">Подтверждение пароля:</label>
                    <input type="password" id="confirmPassword" required className="auth-input-container input" />
                </div>
                <button type="submit" className="submit-button">Зарегистрироваться</button>
            </form>
        </div>
    );
};

export default Register;
