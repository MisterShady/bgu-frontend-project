import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Airpods from './components/Airpods';
import Watches from './components/Watches';
import Ipads from './components/Ipads';
import Iphones from './components/Iphones';
import Navbar from './components/Navbar'; // Подключаем навигационную панель
import Footer from './components/Footer'; // Подключаем подвал
import './App.css';
import AirpodsProduct from './components/AirpodsProduct';
import IpadProduct from "./components/IpadProduct";
import WatchProduct from "./components/WatchProduct";
import IphoneProduct from "./components/IphoneProduct";

const App: React.FC = () => {
    const [currency, setCurrency] = useState('USD');
    const [conversionRate, setConversionRate] = useState(1);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
                const rates = response.data.rates;
                setConversionRate(rates[currency]);
            } catch (error) {
                console.error('Ошибка получения курсов валют:', error);
            }
        };

        fetchRates();
    }, [currency]);

    const handleCurrencyChange = (selectedCurrency: string) => {
        setCurrency(selectedCurrency);
    };

    return (
        <Router>
            <div className="app-container">
                <Navbar /> {/* Вставляем навигационную панель */}
                <h1>Товары Apple</h1>
                <Routes>
                    <Route path="/airpods" element={<Airpods currency={currency} conversionRate={conversionRate} />} />
                    <Route path="/airpods/:id" element={<AirpodsProduct />} />
                    <Route path="/watches" element={<Watches currency={currency} conversionRate={conversionRate} />} />
                    <Route path="/watches/:id" element={<WatchProduct />} />
                    <Route path="/ipads" element={<Ipads currency={currency} conversionRate={conversionRate} />} />
                    <Route path="/ipads/:id" element={<IpadProduct />} />
                    <Route path="/iphones" element={<Iphones currency={currency} conversionRate={conversionRate} />} />
                    <Route path="/ipnones/:id" element={<IphoneProduct />} />
                    <Route path="/" element={<h2>Выберите категорию товаров</h2>} />
                </Routes>
                <Footer /> {/* Вставляем подвал */}
            </div>
        </Router>
    );
};

export default App;
