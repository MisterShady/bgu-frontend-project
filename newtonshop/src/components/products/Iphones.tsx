import React, { useEffect, useState } from 'react';
import { getIphones } from '../../Api';
import { IphoneDto } from '../../types';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Iphones: React.FC = () => {
    const [iphones, setIphones] = useState<IphoneDto[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const iphonesData = await getIphones();
                setIphones(iphonesData);
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
            {iphones.map((item) => (
                <motion.div className="card" key={item.id} whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                    <img src={item.thumbUrl} alt={item.title} className="card-image" />
                    <h2>{item.title}</h2>
                    <p className="price">{item.price}$</p>
                    <button className="view-button">
                        <Link to={`/iphones/${item.id}`}>Посмотреть характеристики</Link>
                    </button>
                    <button className="buy-button">Купить</button>
                </motion.div>
            ))}
        </div>
    );
};

export default Iphones;
