import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByPage, setPage } from "../slices/productsSlice";
import { AppDispatch, RootState } from "../../store";
import ImageWrapper from "../handler/ImageWrapper";
import LazyLoad from "react-lazyload";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { categoryMapping } from "../categoryMapping";
import "./Products.css";

const sortOptions = [
  { value: "title,ASC", label: "Названию (A-Z)" },
  { value: "title,DESC", label: "Названию (Z-A)" },
  { value: "price,ASC", label: "Цене (возрастание)" },
  { value: "price,DESC", label: "Цене (убывание)" },
];

const AllProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error, page } = useSelector((state: RootState) => state.products);
  const navigate = useNavigate();
  const location = useLocation();

  const [sortCriteria, setSortCriteria] = useState(sortOptions[0].value);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const currentPage = parseInt(query.get("page") || "1", 10) - 1;
    const sort = query.get("sort") || sortOptions[0].value;

    setSortCriteria(sort);
    dispatch(setPage(currentPage));
    dispatch(fetchProductsByPage({ page: currentPage, sort }));
  }, [dispatch, location.search]);

  const handleSortChange = (newSort: string) => {
    const query = new URLSearchParams(location.search);
    query.set("sort", newSort);
    navigate(`${location.pathname}?${query.toString()}`);
  };

  const [isSortOpen, setIsSortOpen] = useState(false);

  const handleSortToggle = () => {
    setIsSortOpen((prev) => !prev);
  };

  const handlePageChange = (newPage: number) => {
    const query = new URLSearchParams(location.search);
    query.set("page", (newPage + 1).toString());
    navigate(`${location.pathname}?${query.toString()}`);
  };

  const productList = useMemo(() => {
    return products.map((item) => {
      const categoryKey = item.category.toLowerCase().substring(0, 3);
      const categoryPath = categoryMapping[categoryKey] || item.category.toLowerCase();
      return (
        <LazyLoad key={item.id} height={200} offset={100}>
          <Link to={`/${categoryPath}/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
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
      );
    });
  }, [products]);

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

  const currentSortLabel = sortOptions.find((option) => option.value === sortCriteria)?.label || "";

  if (loading) {
    return <div className="card-container">{skeletonCards}</div>;
  }

  if (error) {
    return <div>Ошибка загрузки данных: {error}</div>;
  }

  if (products.length === 0) {
    return <div>Пустота :(</div>;
  }

  return (
    <div>
      <div className="header-container">
        <h1>Все товары</h1>
        <div className="sort-dropdown">
          <label htmlFor="sort">Сортировка по: </label>
          <div className="custom-select-container">
            <div className={`custom-select ${isSortOpen ? "open" : ""}`} onClick={handleSortToggle}>
              {currentSortLabel}
              <img src="/image/svg/arrow.svg" alt="Arrow" className={`arrow-icon ${isSortOpen ? "rotate" : ""}`} />
            </div>
            <div className={`custom-dropdown ${isSortOpen ? "open" : ""}`}>
              <ul>
                {sortOptions.map((option) => (
                  <li key={option.value} onClick={() => handleSortChange(option.value)}>
                    {option.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="card-container">{productList}</div>
      <div className="pagination">
        <button className="pagination-button" onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
          Назад
        </button>
        <span>Страница {page + 1}</span>
        <button className="pagination-button" onClick={() => handlePageChange(page + 1)} disabled={products.length < 8}>
          Вперед
        </button>
      </div>
    </div>
  );
};

export default AllProducts;
