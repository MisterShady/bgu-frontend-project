import React, { useEffect, useState } from "react";
import { getIpads } from "../../Api";
import { IpadDto } from "../../types";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ImageWrapper from "../handler/ImageWrapper";
import { AxiosError } from "axios";

const Ipads = () => {
  const [ipads, setIpads] = useState<IpadDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ipadsData = await getIpads();
        setIpads(ipadsData);
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
      {ipads.map((item) => (
        <motion.div className="card" key={item.id} whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
          <ImageWrapper src={item.thumbUrl} alt={item.title} className="card-image" />
          <h2>{item.title}</h2>
          <p className="price">{item.price}$</p>
          <button className="view-button">
            <Link to={`/ipads/${item.id}`}>Посмотреть характеристики</Link>
          </button>
          <button className="buy-button">Купить</button>
        </motion.div>
      ))}
    </div>
  );
};

export default Ipads;
