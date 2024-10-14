import React, { useRef } from 'react';
import './Footer.css';

const Footer: React.FC = () => {
    // Используем useRef для аудио
    const audioRef = useRef<HTMLAudioElement>(null);

    // Обработчик клика на изображении
    const handleGifClick = () => {
        if (audioRef.current) {
            audioRef.current.play(); // Запуск аудио
        }
    };

    return (
        <div className="footer-wrapper">
            <footer className="footer">
                <div className="footer-content">
                    <p>Адрес: г. Москва, ул. Примерная, д. 1</p>
                    <p>Телефон: +7 (999) 123-45-67</p>
                    <p>Email: example@apple.com</p>
                    <a href="/about-us" className="about-link">О нас</a>
                </div>
                <img
                    src="/image/skeleton.gif"
                    alt="Skeleton GIF"
                    className="footer-image"
                    onClick={handleGifClick} // Добавляем событие клика
                />
                <audio ref={audioRef}>
                    <source src="/image/igor.ogg" type="audio/ogg" />
                    Ваш браузер не поддерживает аудио.
                </audio>
            </footer>
        </div>
    );
};

export default Footer;
