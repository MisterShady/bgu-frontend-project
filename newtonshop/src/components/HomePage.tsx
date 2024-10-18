import React from 'react';
import Carousel from './Carousel';
import PopularProducts from './PopularProducts';
import QuickSearch from './QuickSearch';
import './HomePage.css';

// FC
const HomePage: React.FC = () => {
    return (
        <div>
            <Carousel />
            <PopularProducts />
            <QuickSearch />
        </div>
    );
};

export default HomePage;
