import React, { useEffect, useState } from 'react';
import { getWatches } from '../api';
import { WatchDto } from '../types';
import { motion } from 'framer-motion';
import { formatPrice } from './utils';
import Modal from './Modal';

const Watches: React.FC<{ currency: string; conversionRate: number }> = ({ currency, conversionRate }) => {
    const [watches, setWatches] = useState<WatchDto[]>([]);
    const [selectedItem, setSelectedItem] = useState<WatchDto | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const watchData = await getWatches();
                setWatches(watchData);
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
            {watches.map((item) => (
                <motion.div
                    className="card"
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                >
                    <img src={item.thumbUrl} alt={item.title} className="card-image" />
                    <h2>{item.title}</h2>
                    <p className="price">{formatPrice(item.price * conversionRate)} {currency}</p>
                    <p>{item.description}</p>
                    {/* Кнопка для просмотра характеристик */}
                    <button className="view-button" onClick={() => setSelectedItem(item)}>
                        Посмотреть характеристики
                    </button>
                    <button className="buy-button">Купить</button>
                </motion.div>
            ))}
            {selectedItem && (
                <Modal item={selectedItem} onClose={() => setSelectedItem(null)} />
            )}
        </div>
    );
};

export default Watches;
