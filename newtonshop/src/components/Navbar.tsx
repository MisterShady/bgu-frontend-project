import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCartItems, getCurrentProfile, ProductDto, searchProducts } from '../Api';
import { CartItemDto } from '../types';
import { toPlural } from '../utils';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<ProductDto[]>([]);
  const [avatar, setAvatar] = useState<string>('/image/account.png');
  const [cartItems, setCartItems] = useState<CartItemDto[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const cartTimeoutRef = useRef<number | undefined>(undefined);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length >= 2) {
        try {
          const filteredSuggestions = await searchProducts(searchTerm, 0, 5);
          setSuggestions(filteredSuggestions);
        } catch (error) {
          console.error('Ошибка при поиске продуктов:', error);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          const data = await getCurrentProfile();
          setAvatar(data.avatar ? `data:image/jpeg;base64,${data.avatar}` : '/image/account.png');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };


    const fetchCartItems = async () => {
      try {
        const items = await getCartItems();
        setCartItems(items);
      } catch (error) {
        console.error('Ошибка при получении товаров корзины:', error);
      }
    };

    fetchUserData();
    fetchCartItems();

    const handleLogin = () => {
      fetchUserData();
      fetchCartItems();
    };

    const handleLogout = () => {
      setAvatar('/image/account.png');
      setCartItems([]);
    };

    window.addEventListener('login', handleLogin);
    window.addEventListener('logout', handleLogout);

    return () => {
      window.removeEventListener('login', handleLogin);
      window.removeEventListener('logout', handleLogout);
    };
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  const handleAccountClick = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      navigate('/profile');
    } else {
      navigate('/auth');
    }
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleCartMouseEnter = () => {
    clearTimeout(cartTimeoutRef.current);
    setIsCartOpen(true);
  };

  const handleCartMouseLeave = () => {
    if (cartTimeoutRef.current !== undefined) {
      clearTimeout(cartTimeoutRef.current);
    }
    cartTimeoutRef.current = setTimeout(() => {
      setIsCartOpen(false);
    }, 500);
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
      <>
        <div className={'navigation-wrapper'}>
          <div className="navbar-center-container">
            <nav className="navigation">
              <div className="logo">
                <Link to="/">
                  <img src="/image/logo.png" alt="Apple Store" />
                </Link>
              </div>

              <div className="menu-item">
                <button className={`menu-button ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
                  Каталог <span className="arrow">▼</span>
                </button>
                {isMenuOpen && (
                    <div className="dropdown open">
                      <ul className="dropdown-content">
                        <Link to="/macs">
                          <li>
                            <img src="/image/device/mac.svg" alt="MacBook" /> MacBook
                          </li>
                        </Link>
                        <Link to="/ipads">
                          <li>
                            <img src="/image/device/ipad.svg" alt="iPad" /> iPad
                          </li>
                        </Link>
                        <Link to="/iphones">
                          <li>
                            <img src="/image/device/iphone.svg" alt="iPhone" /> iPhone
                          </li>
                        </Link>
                        <Link to="/watches">
                          <li>
                            <img src="/image/device/watch.svg" alt="Watch" /> Watch
                          </li>
                        </Link>
                        <Link to="/airpods">
                          <li style={{ borderRadius: '0 0 15px 15px' }}>
                            <img src="/image/device/airpods.svg" alt="Airpods" /> Airpods
                          </li>
                        </Link>
                      </ul>
                    </div>
                )}
              </div>

              <div className={`search-bar ${suggestions.length > 0 ? 'active' : ''}`}>
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
                          <li key={suggestion.id} className="suggestion-item" onMouseDown={(e) => e.preventDefault()}>
                            <Link
                                to={`/${toPlural(suggestion.type)}/${suggestion.id}`}
                                onClick={clearSuggestions}
                                className="suggestion-link"
                            >
                              {suggestion.type === 'ipad' ? (
                                  <img
                                      src="/image/placeholder.svg"
                                      alt={suggestion.title}
                                      className="suggestion-thumb"
                                      style={{ width: '50px', height: '50px' }}
                                  />
                              ) : (
                                  <img src={suggestion.thumbUrl} alt={suggestion.title} className="suggestion-thumb" />
                              )}
                              <div className="suggestion-info">
                                <span className="suggestion-title">{suggestion.title}</span>
                                <span className="suggestion-price">{suggestion.price}$</span>
                              </div>
                            </Link>
                          </li>
                      ))}
                    </ul>
                )}
              </div>

              <div
                  className="cart-icon"
                  onMouseEnter={handleCartMouseEnter}
                  onMouseLeave={handleCartMouseLeave}
                  onClick={handleCartClick}
                  style={{ cursor: 'pointer', position: 'relative' }}
              >
                <img src="/image/cart.png" alt="Cart" />
                {isCartOpen && (
                    <div className="cart-dropdown" onMouseLeave={() => setIsCartOpen(false)}>
                      <h3>Товары в корзине</h3>
                      <ul className="cart-items-list">
                        {cartItems.length > 0 ? (
                            cartItems.map((item) => (
                                <li key={item.id} className="cart-item">
                                  <img src={item.imageUrl} alt={item.name} />
                                  <span>{item.name}</span>
                                  <span>{item.quantity} x ${item.price.toFixed(2)}</span>
                                </li>
                            ))
                        ) : (
                            <li className="empty-cart">Корзина пуста</li>
                        )}
                      </ul>
                      <div className="cart-total">
                        <span>Итого: ${totalPrice.toFixed(2)}</span>
                      </div>
                      <button onClick={handleCartClick} className="menu-button checkout-button">
                        Перейти к оформлению
                      </button>
                    </div>
                )}
              </div>

              <div className="account-icon" onClick={handleAccountClick} style={{ cursor: 'pointer' }}>
                <img src={avatar} alt="Account" />
              </div>
            </nav>
          </div>
        </div>
      </>
  );
};

export default Navbar;