import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1>404</h1>
      <img src="/image/404.gif" alt="404 GIF" className="not-found-gif" />
      <h2>Страница не найдена</h2>
      <p>Извините, но запрашиваемая вами страница не найдена.</p>
      <Link to="/" className="back-home-link">
        Вернуться на главную
      </Link>
    </div>
  );
};

export default NotFound;
