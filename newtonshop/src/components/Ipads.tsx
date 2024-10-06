import React, { useEffect, useState } from 'react';
import { getIpads } from '../api';
import { IpadDto } from '../types';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Ipads: React.FC<{ currency: string; conversionRate: number }> = ({ currency, conversionRate }) => {
    const [ipads, setIpads] = useState<IpadDto[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ipadsData = await getIpads();
                setIpads(ipadsData);
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
            {ipads.map((item) => (
                <motion.div className="card" key={item.id} whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                    <img src={item.thumbUrl} alt={item.title} className="card-image" />
                    <h2>{item.title}</h2>
                    <p className="price">{(item.price * conversionRate).toFixed(2)} {currency}</p>
                    <button className="view-button">
                        <Link to={`/ipads/${item.id}`}>Посмотреть характеристики</Link>
                    </button>
                    <button className="buy-button">Купить</button>
                </motion.div>
            ))}
        </div>
    );
};

export default Ipads;
