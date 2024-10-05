import React, { useEffect, useState } from 'react';
import { getIpads } from '../api';
import { IpadDto } from '../types';
import { motion } from 'framer-motion';
import { formatPrice } from './utils';
import Modal from './Modal';

const Ipads: React.FC<{ currency: string; conversionRate: number }> = ({ currency, conversionRate }) => {
    const [ipads, setIpads] = useState<IpadDto[]>([]);
    const [selectedItem, setSelectedItem] = useState<IpadDto | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ipadData = await getIpads();
                setIpads(ipadData);
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
                    <p className="price">{formatPrice(item.price * conversionRate)} {currency}</p>
                    <p>{item.description}</p>
                    <button className="view-button" onClick={() => setSelectedItem(item)}>
                        Посмотреть характеристики
                    </button>
                    <button className="buy-button">Купить</button>
                </motion.div>
            ))}
            {selectedItem && <Modal item={selectedItem} onClose={() => setSelectedItem(null)} />}
        </div>
    );
};

export default Ipads;
