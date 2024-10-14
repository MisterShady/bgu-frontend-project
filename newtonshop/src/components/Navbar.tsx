import React, {useCallback, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {getAllProducts, ProductDto} from '../api';
import {toPlural} from '../utils';
import './Navbar.css';

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [allProducts, setAllProducts] = useState<ProductDto[]>([]);
    const [suggestions, setSuggestions] = useState<ProductDto[]>([]);

    const toggleMenu = useCallback(() => {
        setIsMenuOpen(prev => !prev);
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await getAllProducts();
                setAllProducts(products);
            } catch (error) {
                console.error('Ошибка при загрузке списка продуктов:', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.length >= 2) {
                const filteredSuggestions = allProducts.filter(product =>
                    product.title.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setSuggestions(filteredSuggestions);
            } else {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, allProducts]);

    const clearSuggestions = useCallback(() => {
        setSuggestions([]);
    }, []);

    return (
        <div className="navbar-center-container">
            <nav className="navigation">
                {/* Логотип слева */}
                <div className="logo">
                    <Link to="/">
                        <img src="/image/logo.png" alt="Apple Store"/>
                    </Link>
                </div>

                {/* Кнопка "Каталог товаров" и выпадающее меню */}
                <div className="menu-item">
                    <button className="menu-button" onClick={toggleMenu}>
                        Каталог товаров <span className="arrow">▼</span>
                    </button>
                    {isMenuOpen && (
                        <div className="dropdown open">
                            <ul className="dropdown-content">
                                <li>
                                    <Link to="/macs">
                                        <img src="/image/device/mac.svg" alt="Mac"/> Mac
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/ipads">
                                        <img src="/image/device/ipad.svg" alt="iPad"/> iPad
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/iphones">
                                        <img src="/image/device/iphone.svg" alt="iPhone"/> iPhone
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/watches">
                                        <img src="/image/device/watch.svg" alt="Watch"/> Watch
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/airpods">
                                        <img src="/image/device/airpods.svg" alt="Airpods"/> Airpods
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* Поисковая строка */}
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Поиск товаров..."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        onBlur={(event) => {
                            if (!event.currentTarget.contains(event.relatedTarget)) {
                                clearSuggestions();
                            }
                        }}
                    />
                    <img src="/image/magnifier.svg" alt="Search" className="search-icon"/> {/* Иконка лупы */}
                    {suggestions.length > 0 && (
                        <ul className="suggestions-list">
                            {suggestions.map((suggestion) => (
                                <li
                                    key={suggestion.id}
                                    className="suggestion-item"
                                    onMouseDown={(e) => e.preventDefault()}
                                >
                                    <Link
                                        to={`/${toPlural(suggestion.type)}/${suggestion.id}`}
                                        onClick={clearSuggestions}
                                    >
                                        {suggestion.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="cart-icon">
                    <Link to="/login">
                        <img src="/image/cart.png" alt="Cart"/>
                    </Link>
                </div>
                <div className="account-icon">
                    <Link to="/login">
                        <img src="/image/account.png" alt="Account"/>
                    </Link>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
