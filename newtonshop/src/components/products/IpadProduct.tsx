import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getIpadById } from '../../api';
import { IpadDto } from '../../types';
import './ProductDetails.css';
import ImageWrapper from "../handler/ImageWrapper";

// FC
const IpadProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [ipad, setIpad] = useState<IpadDto | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    const ipadData = await getIpadById(id);
                    setIpad(ipadData);
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

    if (!ipad) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="product-details">
            <div className="product-images">
                <ImageWrapper src={ipad.thumbUrl} alt={ipad.title} className="main-image" />
            </div>
            <div className="product-info">
                <h2>{ipad.title}</h2>
                <p className="product-price">${ipad.price}</p>
                <button className="buy-button">Купить</button>

                <div className="product-description">
                    <div className="description-block">
                        <h3>Экран</h3>
                        <p>{ipad.display.size} дюймов, {ipad.display.resolution}</p>
                    </div>
                    <div className="description-block">
                        <h3>Процессор</h3>
                        <p>{ipad.processor.chip}</p>
                    </div>
                    <div className="description-block">
                        <h3>Камеры</h3>
                        <p>Основные камеры: {ipad.camera.rearCameras.map(cam => cam.resolution).join(', ')}</p>
                    </div>
                    <div className="description-block">
                        <h3>Аккумулятор</h3>
                        <p>{ipad.battery.capacity}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IpadProduct;
