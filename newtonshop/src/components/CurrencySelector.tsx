import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CurrencySelector: React.FC<{ onCurrencyChange: (currency: string) => void }> = ({ onCurrencyChange }) => {
    const currencies = ['USD', 'EUR', 'RUB'];
    const [selectedCurrency, setSelectedCurrency] = useState('USD');

    const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const currency = event.target.value;
        setSelectedCurrency(currency);
        onCurrencyChange(currency);
    };

    return (
        <div className="currency-selector">
            <label htmlFor="currency">Выберите валюту:</label>
            <select id="currency" value={selectedCurrency} onChange={handleCurrencyChange}>
                {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                        {currency}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CurrencySelector;
