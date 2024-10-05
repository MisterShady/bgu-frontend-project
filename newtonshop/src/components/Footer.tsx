import React from 'react';
import './Footer.css'; // Импортируйте стили для футера

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>Адрес: г. Москва, ул. Примерная, д. 1</p>
                <p>Телефон: +7 (999) 123-45-67</p>
                <p>Email: example@apple.com</p>
                <a href="/about-us" className="about-link">О нас</a>
            </div>
        </footer>
    );
};

export default Footer;
