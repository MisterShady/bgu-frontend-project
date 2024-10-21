import React from 'react';
import Carousel from './Carousel';
import PopularProducts from './PopularProducts';
import QuickSearch from './QuickSearch';
import './HomePage.css';

const HomePage = () => {
    return (
        <div>
            <Carousel />
            <PopularProducts />
            <QuickSearch />
        </div>
    );
};

export default HomePage;
