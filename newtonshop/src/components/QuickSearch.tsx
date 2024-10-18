import React from 'react';
import { Link } from 'react-router-dom';

// FC
const QuickSearch: React.FC = () => {
    const products = [
        { id: 1, name: '14 Pro', link: '/iphones/14-pro' },
        { id: 2, name: 'AirPods Pro', link: '/airpods/airpods-pro' },
        { id: 3, name: 'iPad Pro', link: '/ipads/ipad-pro' },
        { id: 4, name: 'Apple Watch', link: '/watches/apple-watch' },
    ];

    return (
        <div className="quick-search">
            <h2>Быстрый поиск</h2>
            <div className="search-buttons">
                {products.map(product => (
                    <Link key={product.id} to={product.link} className="search-button">
                        {product.name}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default QuickSearch;
