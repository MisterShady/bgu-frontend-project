import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getProductsByCategory } from "../../Api";
import { ProductDto } from "../../Api";
import ImageWrapper from "../handler/ImageWrapper";
import LazyLoad from "react-lazyload";
import { useFetch } from "../hooks/useFetch";
import Spinner from "../Spinner";

interface ProductProps {
  category: string;
}

const CategoryProducts = ({ category }: ProductProps) => {
  const { data: products, error, loading } = useFetch<ProductDto[]>(() => getProductsByCategory(category));

  if (loading || !products) {
    return <Spinner />;
  }

  if (error) {
    return <div>Ошибка загрузки данных: {error}</div>;
  }

  const productList = products.map((item) => (
      <LazyLoad key={item.id} height={200} offset={100}>
        <Link to={`/${category}/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
          <motion.div className="card" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <LazyLoad>
              <ImageWrapper src={item.thumbUrl} alt={item.title} className="card-image" />
            </LazyLoad>
            <h2>{item.title}</h2>
            <p className="price">{item.price}$</p>
            <button className="buy-button">В корзину</button>
          </motion.div>
        </Link>
      </LazyLoad>
  ));

  return <div className="card-container">{productList}</div>;
};

export default CategoryProducts;
