import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import { getProductsByCategory } from "../../Api";
import { ProductDto } from "../../Api";
import ImageWrapper from "../handler/ImageWrapper";
import LazyLoad from "react-lazyload";

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

    fetchData();
  }, [category]);

  if (error) {
    return <div>Ошибка загрузки данных: {error}</div>;
  }

  const productList = useMemo(
    () => products.map((item) => (
      <LazyLoad key={item.id} height={200} offset={100}>
        <motion.div className="card" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
          <Link to={`/${category}/${item.id}`}>
            <LazyLoad>
              <ImageWrapper src={item.thumbUrl} alt={item.title} className="card-image" />
            </LazyLoad>
          </Link>
          <h2>{item.title}</h2>
          <p className="price">{item.price}$</p>
          <button className="buy-button">В корзину</button>
        </motion.div>
      </LazyLoad>
    )),
    [products, category],
  );

  return <div className="card-container">{productList}</div>;
};

export default CategoryProducts;
