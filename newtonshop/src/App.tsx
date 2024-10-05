import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Airpods from './components/Airpods';
import Watches from './components/Watches';
import Ipads from './components/Ipads';
import Iphones from './components/Iphones';
import CurrencySelector from './components/CurrencySelector';
import './App.css';

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
                <h1>Товары Apple</h1>
                <CurrencySelector onCurrencyChange={handleCurrencyChange} />
                <nav className="navigation">
                    <ul>
                        <li><Link to="/airpods">AirPods</Link></li>
                        <li><Link to="/watches">Watch</Link></li>
                        <li><Link to="/ipads">iPad</Link></li>
                        <li><Link to="/iphones">iPhone</Link></li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/airpods" element={<Airpods currency={currency} conversionRate={conversionRate} />} />
                    <Route path="/watches" element={<Watches currency={currency} conversionRate={conversionRate} />} />
                    <Route path="/ipads" element={<Ipads currency={currency} conversionRate={conversionRate} />} />
                    <Route path="/iphones" element={<Iphones currency={currency} conversionRate={conversionRate} />} />
                    <Route path="/" element={<h2>Выберите категорию товаров</h2>} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
