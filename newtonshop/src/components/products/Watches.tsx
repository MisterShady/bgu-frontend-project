import React, { useEffect, useState } from "react";
import { getWatches } from "../../Api";
import { WatchDto } from "../../types";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";

const Watches = () => {
  const [watches, setWatches] = useState<WatchDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const watchesData = await getWatches();
        setWatches(watchesData);
      } catch (error) {
        const axiosError = error as AxiosError;
        setError(axiosError.message || "Ошибка загрузки данных");
      }
    };

    fetchData().catch((error) => {
      const axiosError = error as AxiosError;
      setError(axiosError.message || "Ошибка загрузки данных");
    });
  }, []);

  if (error) {
    return <div>Ошибка загрузки данных: {error}</div>;
  }

  return (
    <div className="card-container">
      {watches.map((item) => (
        <motion.div className="card" key={item.id} whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
          <Link to={`/watches/${item.id}`}>
          <img src={item.thumbUrl} alt={item.title} className="card-image" />
          </Link>
          <h2>{item.title}</h2>
          <p className="price">{item.price}$</p>
          <button className="buy-button">В корзину</button>
        </motion.div>
      ))}
    </div>
  );
};

export default Watches;
