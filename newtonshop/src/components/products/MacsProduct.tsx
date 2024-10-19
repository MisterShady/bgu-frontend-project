import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMacById } from '../../Api';
import { MacDto } from '../../types';
import './ProductDetails.css';

const MacsProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [mac, setMac] = useState<MacDto | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    const macData = await getMacById(id);
                    setMac(macData);
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

    if (!mac) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="product-details">
            <div className="product-images">
                <img src={mac.thumbUrl} alt={mac.title} className="main-image" />
            </div>
            <div className="product-info">
                <h2>{mac.title}</h2>
                <p className="product-price">${mac.price}</p>
                <button className="buy-button">Купить</button>

                <div className="product-description">
                    <div className="description-block">
                        <h3>Экран</h3>
                        <p>{mac.display.smallScreen.size} дюймов, {mac.display.smallScreen.resolution}</p>
                    </div>
                    <div className="description-block">
                        <h3>Процессор</h3>
                        <p>{mac.processor.name}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MacsProduct;
