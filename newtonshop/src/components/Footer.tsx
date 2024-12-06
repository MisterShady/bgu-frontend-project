import React, { useRef } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const audioRefLeft = useRef<HTMLAudioElement>(null);
  const audioRefRight = useRef<HTMLAudioElement>(null);
  const audioRefAlien = useRef<HTMLAudioElement>(null);

  const handleLeftGifClick = () => {
    if (audioRefLeft.current) {
      audioRefLeft.current.play();
    }
  };

  const handleRightGifClick = () => {
    if (Math.random() < 0.2 && audioRefAlien.current) {
      audioRefAlien.current.play();
    } else if (audioRefRight.current) {
      audioRefRight.current.play();
    }
  };

  return (
    <div className="footer-wrapper">
      <footer className="footer">
        <img src="/image/alien.gif" alt="Alien GIF" className="footer-image" onClick={handleRightGifClick} />
        <div className="footer-content">
          <p>Адрес: г. Белгород, ул. Победы, 85</p>
          <p>Телефон: +7 (999) 123-45-67</p>
          <p>Email: example@apple.com</p>
          <Link to="/about-us" className="about-link">
            О нас
          </Link>
        </div>
        <img src="/image/skeleton.gif" alt="Skeleton GIF" className="footer-image" onClick={handleLeftGifClick} />
        <audio ref={audioRefLeft}>
          <source src="/image/igor.ogg" type="audio/ogg" />
        </audio>
        <audio ref={audioRefRight}>
          <source src="/image/shimi.ogg" type="audio/ogg" />
        </audio>
        <audio ref={audioRefAlien}>
          <source src="/image/alien%20zip.mp3" type="audio/ogg" />
        </audio>
      </footer>
    </div>
  );
};

export default Footer;
