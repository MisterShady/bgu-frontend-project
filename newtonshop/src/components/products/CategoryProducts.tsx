import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByCategory } from "../slices/categorySlice";
import { AppDispatch, RootState } from "../../store";
import ImageWrapper from "../handler/ImageWrapper";
import LazyLoad from "react-lazyload";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ProductDto } from "../../Api";

interface CategoryProductsProps {
  category: string;
}

const CategoryProducts = ({ category }: CategoryProductsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, loading, error } = useSelector((state: RootState) => state.category);

  useEffect(() => {
    dispatch(fetchProductsByCategory(category));
  }, [dispatch, category]);

  const productList = useMemo(() => {
    return products.map((item: ProductDto) => (
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

  const skeletonCards = Array.from({ length: 8 }).map((_, index) => (
    <motion.div
      key={index}
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Skeleton height={200} />
      <Skeleton width={150} />
      <Skeleton width={100} />
      <Skeleton width={80} />
    </motion.div>
  ));

  if (loading) {
    return <div className="card-container">{skeletonCards}</div>;
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
