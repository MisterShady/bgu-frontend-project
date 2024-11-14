import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getProductsByCategory, ProductDto } from "../../Api";
import ImageWrapper from "../handler/ImageWrapper";
import LazyLoad from "react-lazyload";
import { useFetch } from "../hooks/useFetch";
import Spinner from "../Spinner";

const CategoryProducts = ({ category }: { category: string }) => {
  const { data: products, error, loading } = useFetch<ProductDto[]>(() => getProductsByCategory(category), [category]);

  const productList = useMemo(() => {
    return products?.map((item) => (
      <LazyLoad key={item.id} height={200} offset={100}>
        <Link to={`/${category}/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
          <motion.div className="card" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <LazyLoad>
              <ImageWrapper src={item.thumbUrl} alt={item.title} className="card-image" />
            </LazyLoad>
            <h2>{item.title}</h2>
            <p className="price">{item.price}$</p>
            <button className="buy-button">Подробнее</button>
          </motion.div>
        </Link>
      </LazyLoad>
    ));
  }, [products, category]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Ошибка загрузки данных: {error}</div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: "20px", marginLeft: "50px" }}>
        <Link to="/products" className="all-products-link">
          Все товары
        </Link>
        {category && ` / ${category}`}
      </h1>
      <div className="card-container">{productList}</div>
    </div>
  );
};

export default CategoryProducts;
