import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { searchProducts, ProductDto } from '../Api';
import { toPlural } from '../utils';
import './Navbar.css';

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<ProductDto[]>([]);
    const [isSearchActive, setIsSearchActive] = useState(false);

    const toggleMenu = useCallback(() => {
        setIsMenuOpen(prev => !prev);
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.length >= 2) {
                try {
                    const filteredSuggestions = await searchProducts(searchTerm, 0, 5);
                    setSuggestions(filteredSuggestions);
                    setIsSearchActive(true); // Активируем поиск, если есть предложения
                } catch (error) {
                    console.error('Ошибка при поиске продуктов:', error);
                }
            } else {
                setSuggestions([]);
                setIsSearchActive(false); // Деактивируем поиск, если нет предложений
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const clearSuggestions = useCallback(() => {
        setSuggestions([]);
        setIsSearchActive(false); // Убираем активный поиск
    }, []);


    return (
        <>

            <div className={`navigation-wrapper`}>
                <div className="navbar-center-container">
                    <nav className="navigation">
                        <div className="logo">
                            <Link to="/">
                                <img src="/image/logo.png" alt="Apple Store" />
                            </Link>
                        </div>

                        <div className="menu-item">
                            <button className="menu-button" onClick={toggleMenu}>
                                Каталог <span className="arrow">▼</span>
                            </button>
                            {isMenuOpen && (
                                <div className="dropdown open">
                                    <ul className="dropdown-content">
                                        <li>
                                            <Link to="/macs">
                                                <img src="/image/device/mac.svg" alt="MacBook" /> MacBook
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/ipads">
                                                <img src="/image/device/ipad.svg" alt="iPad" /> iPad
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/iphones">
                                                <img src="/image/device/iphone.svg" alt="iPhone" /> iPhone
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/watches">
                                                <img src="/image/device/watch.svg" alt="Watch" /> Watch
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/airpods">
                                                <img src="/image/device/airpods.svg" alt="Airpods" /> Airpods
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className={`search-bar ${isSearchActive ? 'active' : ''}`}>
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
                            <img src="/image/magnifier.svg" alt="Search" className="search-icon" />
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
                                                className="suggestion-link"
                                            >
                                                <img src={suggestion.thumbUrl} alt={suggestion.title} className="suggestion-thumb" />
                                                <div className="suggestion-info">
                                                    <span className="suggestion-title">{suggestion.title}</span>
                                                    <span className="suggestion-price">
                                                        {suggestion.price}$
                                                    </span>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="cart-icon">
                            <Link to="/login">
                                <img src="/image/cart.png" alt="Cart" />
                            </Link>
                        </div>
                        <div className="account-icon">
                            <Link to="/login">
                                <img src="/image/account.png" alt="Account" />
                            </Link>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
};


export default Navbar;
