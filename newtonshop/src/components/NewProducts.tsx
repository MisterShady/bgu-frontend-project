import React from "react";
import { getPopularProducts, ProductDto } from "../Api";
import ImageWrapper from "./handler/ImageWrapper";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";
import { useFetch } from "./hooks/useFetch";

const NewProducts = () => {
  const { data: products, error, loading } = useFetch<ProductDto[]>(getPopularProducts);

  if (loading || !products) {
    return <Spinner />;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  const getProductLink = (product: ProductDto) => {
    switch (product.type) {
      case "airpods":
        return `/airpods/${product.id}`;
      case "iphone":
        return `/iphones/${product.id}`;
      case "ipad":
        return `/ipads/${product.id}`;
      case "watch":
        return `/watches/${product.id}`;
      case "mac":
        return `/macs/${product.id}`;
      default:
        return `/brand-new/${product.id}`;
    }
  };

  return (
    <div className="new-products">
      <h2>Новинки в продаже </h2>
      <div className="product-list">
        {products.map((product) => (
          <Link
            key={product.id}
            to={getProductLink(product)}
            className="product-item-link"
            style={{ textDecoration: "none" }}
          >
            <div className="product-item">
              <ImageWrapper src={product.thumbUrl} alt={product.title} className="product-image" />
              <h3>{product.title}</h3>
              <div className="price-container1">
                <span className="price-box">{product.price}$</span>
                <button className="cart-icon-container">
                  <img src="/image/cart-white.png" alt="Cart" className="cart-icon-popular" />
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NewProducts;
