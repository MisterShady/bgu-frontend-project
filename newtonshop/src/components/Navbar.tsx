import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts, ProductDto } from '../api'; // Импорт API для получения всех продуктов
import { toPlural } from '../utils'; // Импорт функции преобразования в множественное число
import './Navbar.css';

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [allProducts, setAllProducts] = useState<ProductDto[]>([]);
    const [suggestions, setSuggestions] = useState<ProductDto[]>([]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Загрузка списка всех продуктов из API при монтировании компонента
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await getAllProducts(); // Используем API для загрузки всех продуктов
                setAllProducts(products);
            } catch (error) {
                console.error('Ошибка при загрузке списка продуктов:', error);
            }
        };

        fetchProducts();
    }, []);

    // Обработка изменения текста в поисковой строке
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);

        if (value.length >= 2) {
            // Локальная фильтрация продуктов по введенному запросу
            const filteredSuggestions = allProducts.filter(product =>
                product.title.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const clearSuggestions = () => {
        setSuggestions([]);
    };

    return (
        <nav className="navigation">
            {/* Логотип слева */}
            <div className="logo">
                <Link to="/">
                    <img src="Ноги.jpg" alt="Apple Store" />
                </Link>
            </div>

            {/* Кнопка "Все товары" и выпадающее меню */}
            <div className="menu-item">
                <button className="menu-button" onClick={toggleMenu}>
                    Все товары
                </button>
                <div className={`dropdown ${isMenuOpen ? 'open' : ''}`}>
                    <ul className="dropdown-content">
                        <li>
                            <Link to="/macs">
                                <img src="/mac.png" alt="Mac" /> Mac
                            </Link>
                        </li>
                        <li>
                            <Link to="/ipads">
                                <img src="/ipad.png" alt="iPad" /> iPad
                            </Link>
                        </li>
                        <li>
                            <Link to="/iphones">
                                <img src="/smartphone.png" alt="iPhone" /> iPhone
                            </Link>
                        </li>
                        <li>
                            <Link to="/watches">
                                <img src="/smartphone.png" alt="Watch" /> Watch
                            </Link>
                        </li>
                        <li>
                            <Link to="/airpods">
                                <img src="/airpods.png" alt="Airpods" /> Airpods
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Поисковая строка */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Поиск товаров..."
                    value={searchTerm}
                    onChange={handleSearch}
                    onFocus={handleSearch} // Показываем подсказки при получении фокуса
                    onBlur={(event) => {
                        // Проверяем, если фокус не на элементе подсказки, очищаем список
                        if (!event.currentTarget.contains(event.relatedTarget)) {
                            clearSuggestions();
                        }
                    }}
                />
                {/* Выпадающий список предложений */}
                {suggestions.length > 0 && (
                    <ul className="suggestions-list">
                        {suggestions.map((suggestion) => (
                            <li
                                key={suggestion.id}
                                className="suggestion-item"
                                onMouseDown={(e) => e.preventDefault()} // Предотвращаем потерю фокуса на input
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

            {/* Личный кабинет справа */}
            <div className="account-icon">
                <Link to="/account">
                    <img src="account.png" alt="Account" />
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
