import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LazyLoad from "react-lazyload";

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
        <LazyLoad>
          <img src="/image/carousel/slide1.png" alt="Slide 1" />
        </LazyLoad>
      </div>
      <div>
        <LazyLoad>
          <img src="/image/carousel/slide2.png" alt="Slide 2" />
        </LazyLoad>
      </div>
      <div>
        <LazyLoad>
          <img src="/image/carousel/slide3.png" alt="Slide 3" />
        </LazyLoad>
      </div>
    </Slider>
  );
};

export default Carousel;
