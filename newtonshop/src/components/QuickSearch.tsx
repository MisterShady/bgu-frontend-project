import React from "react";
import { Link } from "react-router-dom";

const QuickSearch = () => {
  const products = [
    { id: 1, name: "iPhone 15 Pro", link: "/iphones/iphone-15-pro" },
    { id: 2, name: "AirPods Max", link: "/airpods/airpods-max" },
    { id: 3, name: "iPad Pro 12", link: "/ipads/ipad-pro-12" },
    { id: 4, name: "Apple Watch 9", link: "/watches/watch-9" },
    { id: 5, name: "MacBook Pro 16", link: "/macs/16-inch-m2-max-1238" },
  ];

  return (
    <div className="quick-search">
      <h2>У нас часто ищут</h2>
      <div className="search-buttons">
        {products.map((product) => (
          <Link key={product.id} to={product.link} className="search-button">
            {product.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickSearch;
