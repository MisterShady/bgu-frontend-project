import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";
import LazyLoad from "react-lazyload";

const NotFound = () => {
  const [soundPlayed, setSoundPlayed] = useState(false);

  const sound = new Audio("/image/mememe.mp3");

  const handleClick = () => {
    if (!soundPlayed) {
      sound.play();
      setSoundPlayed(true);
    }
  };

  return (
    <div className="not-found-container">
      <h1>404</h1>
      <LazyLoad>
        <img
          src="/image/404.gif"
          alt="404 GIF"
          className="not-found-gif"
          onClick={handleClick} />
      </LazyLoad>
      <h2>Страница не найдена</h2>
      <p>Извините, но запрашиваемая вами страница не существует.</p>
      <Link to="/" className="back-home-link">Вернуться на главную</Link>
    </div>
  );
};

export default NotFound;
