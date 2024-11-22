import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByPage, setPage } from "../slices/productsSlice";
import { AppDispatch, RootState } from "../../store";
import ImageWrapper from "../handler/ImageWrapper";
import LazyLoad from "react-lazyload";
import Spinner from "../Spinner";

export const categoryMapping: { [key: string]: string } = {
  mac: "macs",
  ipa: "ipads",
  iph: "iphones",
  wat: "watches",
  air: "airpods",
};

const AllProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error, page } = useSelector((state: RootState) => state.products);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const currentPage = parseInt(query.get("page") || "0", 10);
    dispatch(setPage(currentPage));
    dispatch(fetchProductsByPage(currentPage));
  }, [dispatch, location.search]);

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

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Ошибка загрузки данных: {error}</div>;
  }

  const handlePageChange = (newPage: number) => {
    const query = new URLSearchParams(location.search);
    query.set("page", newPage.toString());
    navigate(`${location.pathname}?${query.toString()}`);
  };

  return (
    <div>
      <h1 style={{ marginBottom: "20px", marginLeft: "50px" }}>Все товары</h1>
      <div className="card-container">{productList}</div>
      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
        >
          Назад
        </button>
        <span>Страница {page + 1}</span>
        <button
          className="pagination-button"
          onClick={() => handlePageChange(page + 1)}
          disabled={products.length < 8}
        >
          Вперед
        </button>
      </div>
    </div>
  );
};

export default AllProducts;
