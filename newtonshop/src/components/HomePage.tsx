import React from "react";
import Carousel from "./Carousel";
import NewProducts from "./NewProducts";
import QuickSearch from "./QuickSearch";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div>
      <Carousel />
      <NewProducts />
      <QuickSearch />
    </div>
  );
};

export default HomePage;
