import React, {useCallback, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {getCurrentProfile, ProductDto, searchProducts} from "../Api";
import {toPlural} from "../utils";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<ProductDto[]>([]);
  const [avatar, setAvatar] = useState<string>("/image/png/account.png");

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
          console.error("Ошибка при поиске продуктов:", error);
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
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          const data = await getCurrentProfile();
          setAvatar(data.avatar ? `data:image/jpeg;base64,${data.avatar}` : "/image/png/account.png");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    const handleLogin = () => {
      fetchUserData();
    };

    const handleLogout = () => {
      setAvatar("/image/png/account.png");
    };

    window.addEventListener("login", handleLogin);
    window.addEventListener("logout", handleLogout);

    return () => {
      window.removeEventListener("login", handleLogin);
      window.removeEventListener("logout", handleLogout);
    };
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  return (
    <>
      <div className={"navigation-wrapper"}>
        <div className="navbar-center-container">
          <nav className="navigation">
            <div className="logo">
              <Link to="/">
                <img src="/image/png/logo.png" alt="Apple Store"/>
              </Link>
            </div>

            <div className="menu-item">
              <button className={`menu-button ${isMenuOpen ? "open" : ""}`} onClick={toggleMenu}>
                                Каталог <img src="/image/svg/arrow.svg" alt="Arrow"
                  className={`arrow ${isMenuOpen ? "up" : "down"}`}/>
              </button>
              {isMenuOpen && (
                <div className="dropdown open">
                  <ul className="dropdown-content">
                    <Link to="/macs">
                      <li>
                        <img src="/image/svg/mac.svg" alt="MacBook"/> MacBook
                      </li>
                    </Link>
                    <Link to="/ipads">
                      <li>
                        <img src="/image/svg/ipad.svg" alt="iPad"/> iPad
                      </li>
                    </Link>
                    <Link to="/iphones">
                      <li>
                        <img src="/image/svg/iphone.svg" alt="iPhone"/> iPhone
                      </li>
                    </Link>
                    <Link to="/watches">
                      <li>
                        <img src="/image/svg/watch.svg" alt="Watch"/> Watch
                      </li>
                    </Link>
                    <Link to="/airpods">
                      <li style={{borderRadius: "0 0 15px 15px"}}>
                        <img src="/image/svg/airpods.svg" alt="Airpods"/> Airpods
                      </li>
                    </Link>
                  </ul>
                </div>
              )}
            </div>

            <div className={`search-bar ${suggestions.length > 0 ? "active" : ""}`}>
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
              <img src="/image/magnifier.svg" alt="Search" className="search-icon"/>
              {suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map((suggestion) => (
                    <li key={suggestion.id} className="suggestion-item"
                      onMouseDown={(e) => e.preventDefault()}>
                      <Link
                        to={`/${toPlural(suggestion.type)}/${suggestion.id}`}
                        onClick={clearSuggestions}
                        className="suggestion-link"
                      >
                        {suggestion.type === "ipad" ? (
                          <img
                            src="/image/placeholder.svg"
                            alt={suggestion.title}
                            className="suggestion-thumb"
                            style={{width: "50px", height: "50px"}}
                          />
                        ) : (
                          <img src={suggestion.thumbUrl} alt={suggestion.title}
                            className="suggestion-thumb"/>
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

            <div className="cart-icon" style={{cursor: "pointer"}}>
              <Link to="/cart">
                <img src="/image/png/cart.png" alt="Cart"/>
              </Link>
            </div>
            <div className="account-icon" style={{cursor: "pointer"}}>
              <Link to="/profile">
                <img src={avatar} alt="Account"/>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
