import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAirpodsById } from '../../Api';
import { AirpodsDto } from '../../types';
import { colorMapping } from './colorMapping';
import './ProductDetails.css';

const AirpodsProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [airpods, setAirpods] = useState<AirpodsDto | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const getDataOrFallback = (data: any) => (data && data !== 'none' && data.length > 0 ? data : null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    const airpodsData = await getAirpodsById(id);
                    setAirpods(airpodsData);

                    const defaultColor = airpodsData.colors[0];
                    setSelectedColor(defaultColor);
                    const firstImageForColor = getImagesByColor(airpodsData.images, defaultColor)[0];
                    setSelectedImage(firstImageForColor || airpodsData.images[0]);
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

    if (!airpods) {
        return <div>Загрузка...</div>;
    }

    const handleColorChange = (color: string) => {
        setSelectedColor(color);
        const firstImageForColor = getImagesByColor(airpods.images, color)[0];
        setSelectedImage(firstImageForColor || airpods.images[0]);
    };

    return (
        <div className="product-details">
            <div className="product-images">
                <img
                    src={selectedImage || airpods.thumbUrl}
                    alt={airpods.title}
                    className="main-image"
                />
                <div className="image-thumbnails">
                    {airpods.images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`AirPods Image ${index + 1}`}
                            className={`thumbnail ${image === selectedImage ? 'selected' : ''}`}
                            onClick={() => setSelectedImage(image)}
                        />
                    ))}
                </div>
            </div>

            <div className="product-info">
                <h1 className="product-title">{airpods.title}</h1>

                <div className="price-container">
                    <p className="product-price">${airpods.price}</p>
                    <button className="buy-button">Купить</button>
                </div>

                <div className="product-colors">
                    <h3>Выберите цвет:</h3>
                    <div className="color-squares">
                        {airpods.colors.map((color, index) => (
                            <div
                                key={index}
                                className={`color-square ${selectedColor === color ? 'selected' : ''}`}
                                style={{ backgroundColor: colorMapping[color] || '#fff4f4' }}
                                onClick={() => handleColorChange(color)}
                            ></div>
                        ))}
                    </div>
                </div>

                <div className="product-description">
                    {getDataOrFallback(airpods.audioFeatures) && (
                        <div className="description-block">
                            <h3>Аудио функции</h3>
                            <p>{airpods.audioFeatures.join(', ')}</p>
                        </div>
                    )}

                    {getDataOrFallback(airpods.mic) && (
                        <div className="description-block">
                            <h3>Микрофон</h3>
                            <p>{airpods.mic}</p>
                        </div>
                    )}

                    {getDataOrFallback(airpods.chip) && (
                        <div className="description-block">
                            <h3>Чип</h3>
                            <p>{airpods.chip}</p>
                        </div>
                    )}

                    {getDataOrFallback(airpods.controls) && (
                        <div className="description-block">
                            <h3>Управление</h3>
                            <p>{airpods.controls.join(', ')}</p>
                        </div>
                    )}

                    {getDataOrFallback(airpods.size) && (
                        <div className="description-block">
                            <h3>Размеры</h3>
                            <p>Высота: {airpods.size.height}, Ширина: {airpods.size.width}, Глубина: {airpods.size.depth}, Вес: {airpods.size.weight}</p>
                        </div>
                    )}

                    {getDataOrFallback(airpods.battery) && (
                        <div className="description-block">
                            <h3>Аккумулятор</h3>
                            <p>{airpods.battery}</p>
                        </div>
                    )}

                    {getDataOrFallback(airpods.connectivity) && (
                        <div className="description-block">
                            <h3>Подключение</h3>
                            <p>{airpods.connectivity}</p>
                        </div>
                    )}

                    {getDataOrFallback(airpods.resistance) && (
                        <div className="description-block">
                            <h3>Сопротивление</h3>
                            <p>{airpods.resistance}</p>
                        </div>
                    )}

                    {getDataOrFallback(airpods.sensors) && (
                        <div className="description-block">
                            <h3>Сенсоры</h3>
                            <p>{airpods.sensors.join(', ')}</p>
                        </div>
                    )}

                    {getDataOrFallback(airpods.packageEquipments) && (
                        <div className="description-block">
                            <h3>Комплектация</h3>
                            <p>{airpods.packageEquipments.join(', ')}</p>
                        </div>
                    )}

                    {getDataOrFallback(airpods.accessibilities) && (
                        <div className="description-block">
                            <h3>Возможности</h3>
                            <p>{airpods.accessibilities.join(', ')}</p>
                        </div>
                    )}

                    {getDataOrFallback(airpods.caseType) && (
                        <div className="description-block">
                            <h3>Тип кейса</h3>
                            <p>{airpods.caseType}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AirpodsProduct;

const getImagesByColor = (images: string[], color: string): string[] => {
    const normalizedColor = color.replace(/\s+/g, '').toLowerCase();
    return images.filter(image =>
        image.toLowerCase().includes(normalizedColor)
    );
};
