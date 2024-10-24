import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import { getProductsByCategory } from "../../Api";
import { ProductDto } from "../../Api";
import ImageWrapper from "../handler/ImageWrapper";

interface ProductProps {
  category: string;
}

const CategoryProducts = ({ category }: ProductProps) => {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getProductsByCategory(category);
        setProducts(productsData);
      } catch (error) {
        const axiosError = error as AxiosError;
        setError(axiosError.message || "Ошибка загрузки данных");
      }
    };

    fetchData().catch((error) => {
      const axiosError = error as AxiosError;
      setError(axiosError.message || "Ошибка загрузки данных");
    });
  }, [category]);

  if (error) {
    return <div>Ошибка загрузки данных: {error}</div>;
  }

  return (
    <div className="card-container">
      {products.map((item) => (
        <motion.div className="card" key={item.id} whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
          <Link to={`/${category}/${item.id}`}>
            <ImageWrapper src={item.thumbUrl} alt={item.title} className="card-image" />
          </Link>
          <h2>{item.title}</h2>
          <p className="price">{item.price}$</p>
          <button className="buy-button">В корзину</button>
        </motion.div>
      ))}
    </div>
  );
};

export default CategoryProducts;
