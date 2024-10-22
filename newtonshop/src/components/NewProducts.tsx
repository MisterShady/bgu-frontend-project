import React, { useEffect, useState } from "react";
import { getPopularProducts, ProductDto } from "../Api";
import ImageWrapper from "./handler/ImageWrapper";
import { Link } from "react-router-dom";

const NewProducts = () => {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getPopularProducts();
        setProducts(allProducts.slice(0, 5));
      } catch (error) {
        console.error("Ошибка при загрузке списка продуктов:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts().catch((error) => {
      console.error("Ошибка при выполнении fetchProducts:", error);
    });
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
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
          <div key={product.id} className="product-item">
            <Link to={getProductLink(product)} className="product-item-link">
              <ImageWrapper src={product.thumbUrl} alt={product.title} className="product-image" />
            </Link>
            <h3>{product.title}</h3>
            <div className="price-container1">
              <span className="price-box">{product.price}$</span>
              <button className="cart-icon-container">
                <img src="/image/cart-white.png" alt="Cart" className="cart-icon-popular" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewProducts;
