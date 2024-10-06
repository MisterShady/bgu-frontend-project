import React, { useEffect, useState } from 'react';
import { getAirpods } from '../api';
import { AirpodsDto } from '../types';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Airpods: React.FC<{ currency: string; conversionRate: number }> = ({ currency, conversionRate }) => {
    const [airpods, setAirpods] = useState<AirpodsDto[]>([]);
    const [selectedItem, setSelectedItem] = useState<AirpodsDto | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const airpodsData = await getAirpods();
                setAirpods(airpodsData);
            } catch (error: any) {
                setError(error.message || 'Ошибка загрузки данных');
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <div>Ошибка загрузки данных: {error}</div>;
    }

    return (
        <div className="card-container">
            {airpods.map((item) => (
                <motion.div className="card" key={item.id} whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                    <img src={item.thumbUrl} alt={item.title} className="card-image" />
                    <h2>{item.title}</h2>
                    <p className="price">{item.price} {currency}</p>
                    <button className="view-button">
                        <Link to={`/airpods/${item.id}`}>Посмотреть характеристики</Link>
                    </button>
                    <button className="buy-button">Купить</button>
                </motion.div>
            ))}
        </div>
    );
};

export default Airpods;
