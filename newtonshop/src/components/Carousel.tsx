import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Slider {...settings}>
      <div>
        <img src="/image/carousel/slide1.png" alt="Slide 1" />
      </div>
      <div>
        <img src="/image/carousel/slide2.png" alt="Slide 2" />
      </div>
      <div>
        <img src="/image/carousel/slide3.png" alt="Slide 3" />
      </div>
    </Slider>
  );
};

export default Carousel;
