import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const [soundPlayed, setSoundPlayed] = useState(false);

  // Загрузите звуковой файл
  const sound = new Audio('/image/mememe.mp3');

  const handleClick = () => {
    if (!soundPlayed) {
      sound.play();
      setSoundPlayed(true);
    }
  };

  return (
    <div className="not-found-container">
      <h1>404</h1>
      <img
        src="/image/404.gif"
        alt="404 GIF"
        className="not-found-gif"
        onClick={handleClick}
      />
      <h2>Страница не найдена</h2>
      <p>Извините, но запрашиваемая вами страница не существует.</p>
      <Link to="/" className="back-home-link">Вернуться на главную</Link>
    </div>
  );
};

export default NotFound;
