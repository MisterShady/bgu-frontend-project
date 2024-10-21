import React, { useRef } from "react";
import "./Footer.css";

const Footer = () => {
  const audioRefLeft = useRef<HTMLAudioElement>(null);
  const audioRefRight = useRef<HTMLAudioElement>(null);
  const audioRefAlien = useRef<HTMLAudioElement>(null);

  const handleLeftGifClick = async () => {
    if (audioRefLeft.current) {
      try {
        await audioRefLeft.current.play();
      } catch (error) {
        console.error("Ошибка при проигрывании аудио:", error);
      }
    }
  };

  const handleRightGifClick = async () => {
    if (Math.random() < 0.2 && audioRefAlien.current) {
      try {
        await audioRefAlien.current.play();
      } catch (error) {
        console.error("Ошибка при проигрывании аудио:", error);
      }
    } else if (audioRefRight.current) {
      try {
        await audioRefRight.current.play();
      } catch (error) {
        console.error("Ошибка при проигрывании аудио:", error);
      }
    }
  };

  return (
    <div className="footer-wrapper">
      <footer className="footer">
        <img src="/image/alien.gif" alt="Alien GIF" className="footer-image" onClick={handleRightGifClick} />
        <div className="footer-content">
          <p>Адрес: г. Москва, ул. Примерная, д. 1</p>
          <p>Телефон: +7 (999) 123-45-67</p>
          <p>Email: example@apple.com</p>
          <a href="/about-us" className="about-link">
            О нас
          </a>
        </div>
        <img src="/image/skeleton.gif" alt="Skeleton GIF" className="footer-image" onClick={handleLeftGifClick} />
        <audio ref={audioRefLeft}>
          <source src="/image/igor.ogg" type="audio/ogg" />
          Ваш браузер не поддерживает аудио.
        </audio>
        <audio ref={audioRefRight}>
          <source src="/image/shimi.ogg" type="audio/ogg" />
          Ваш браузер не поддерживает аудио.
        </audio>
        <audio ref={audioRefAlien}>
          <source src="/image/alien%20zip.mp3" type="audio/ogg" />
          Ваш браузер не поддерживает аудио.
        </audio>
      </footer>
    </div>
  );
};

export default Footer;
