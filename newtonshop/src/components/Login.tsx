import React from 'react';
import {Link} from 'react-router-dom';
import './Auth.css';

const Login: React.FC = () => {
    return (
        <div className="auth-container">
            <Link to="/" className="back-button">←</Link>
            <h2>Авторизация</h2>
            <form>
                <div className="input-container">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" required/>
                </div>
                <div className="input-container">
                    <label htmlFor="password">Пароль:</label>
                    <input type="password" id="password" required/>
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