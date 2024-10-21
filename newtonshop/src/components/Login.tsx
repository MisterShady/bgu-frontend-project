import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Здесь будет логика авторизации
        navigate('/profile');
    };

    return (
        <div className="auth-container">
            <Link to="/" className="back-button">←</Link>
            <h2>Авторизация</h2>
            <form onSubmit={handleLogin}>
                <div className="auth-input-container">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" required className="auth-input-container input"/>
                </div>
                <div className="auth-input-container">
                    <label htmlFor="password">Пароль:</label>
                    <input type="password" id="password" required className="auth-input-container input"/>
                </div>
                <button type="submit" className="submit-button">Войти</button>
            </form>
            <p>
                У меня нет аккаунта. <Link to="/register">Зарегистрироваться</Link>
            </p>
        </div>
    );
};

export default Login;
