import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getIphoneById } from '../api';
import { IphoneDto } from '../types';
import './ProductDetails.css';

const IphoneProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [iphone, setIphone] = useState<IphoneDto | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    const iphoneData = await getIphoneById(id);
                    setIphone(iphoneData);
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

    if (!iphone) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="product-details">
            <div className="product-images">
                <img src={iphone.thumbUrl} alt={iphone.title} className="main-image" />
            </div>
            <div className="product-info">
                <h2>{iphone.title}</h2>
                <p className="product-price">${iphone.price}</p>
                <button className="buy-button">Купить</button>

                <div className="product-description">
                    <div className="description-block">
                        <h3>Экран</h3>
                        <p>{iphone.display.size} дюймов, {iphone.display.resolution}</p>
                    </div>
                    <div className="description-block">
                        <h3>Процессор</h3>
                        <p>{iphone.processor.chip}</p>
                    </div>
                    <div className="description-block">
                        <h3>Камеры</h3>
                        <p>Основные камеры: {iphone.camera.rearCameras.map(cam => cam.resolution).join(', ')}</p>
                    </div>
                    <div className="description-block">
                        <h3>Аккумулятор</h3>
                        <p>{iphone.battery.capacity}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IphoneProduct;
