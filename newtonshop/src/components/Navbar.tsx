import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Подключаем стили

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navigation">
            {/* Логотип слева */}
            <div className="logo">
                <Link to="/">
                    <img src="/path-to-logo.png" alt="Apple Store" />
                </Link>
            </div>
            {/* Кнопка "Все товары" и выпадающее меню */}
            <div className="menu-item">
                <button className="menu-button" onClick={toggleMenu}>
                    Все товары
                </button>
                <div className={`dropdown ${isMenuOpen ? 'open' : ''}`}>
                    <ul className="dropdown-content">
                        <li>
                            <Link to="/airpods">
                                <img src="/path-to-airpods.png" alt="AirPods" /> AirPods
                            </Link>
                        </li>
                        <li>
                            <Link to="/watches">
                                <img src="/path-to-watch.png" alt="Watch" /> Watch
                            </Link>
                        </li>
                        <li>
                            <Link to="/ipads">
                                <img src="/path-to-ipad.png" alt="iPad" /> iPad
                            </Link>
                        </li>
                        <li>
                            <Link to="/iphones">
                                <img src="/path-to-iphone.png" alt="iPhone" /> iPhone
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            {/* Личный кабинет справа */}
            <div className="account-icon">
                <Link to="/account">
                    <img src="/newtonshop/public/logo192.png" alt="Account" />
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
