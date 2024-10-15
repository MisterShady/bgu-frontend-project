import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getWatchById } from '../../api';
import { WatchDto } from '../../types';
import './ProductDetails.css';

const WatchProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [watch, setWatch] = useState<WatchDto | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    const watchData = await getWatchById(id);
                    setWatch(watchData);
                }
            } catch (error: any) {
                setError(error.message || 'Ошибка загрузки данных');
            }
        };

        fetchData();
    }, [id]);

    if (error) {
        return <div>Ошибка загрузки данных: {error}</div>;
    }

    if (!watch) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="product-details">
            <div className="product-images">
                <img src={watch.thumbUrl} alt={watch.title} className="main-image" />
            </div>
            <div className="product-info">
                <h2>{watch.title}</h2>
                <p className="product-price">${watch.price}</p>
                <button className="buy-button">Купить</button>

                <div className="product-description">
                    <div className="description-block">
                        <h3>Экран</h3>
                        <p>{watch.display.screen.large.size} дюймов, {watch.display.screen.large.resolution}</p>
                    </div>
                    <div className="description-block">
                        <h3>Процессор</h3>
                        <p>{watch.chipset.cpu}</p>
                    </div>
                    <div className="description-block">
                        <h3>Аккумулятор</h3>
                        <p>{watch.battery.lifetime}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WatchProduct;
