import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAirpodsById } from '../../api';
import { AirpodsDto } from '../../types';
import './ProductDetails.css'; // Стили

const AirpodsProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Получаем ID из параметров маршрута
    const [airpods, setAirpods] = useState<AirpodsDto | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    const airpodsData = await getAirpodsById(id);
                    setAirpods(airpodsData);

                    // Устанавливаем первый цвет и изображение по умолчанию
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
        setSelectedImage(firstImageForColor || airpods.images[0]); // Устанавливаем первое изображение для нового цвета
    };

    return (
        <div className="product-details">
            <div className="product-images">
                <img
                    src={selectedImage || airpods.thumbUrl}
                    alt={airpods.title}
                    className="main-image"
                />
                {/* Миниатюры изображений */}
                <div className="image-thumbnails">
                    {airpods.images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`AirPods Image ${index + 1}`}
                            className={`thumbnail ${image === selectedImage ? 'selected' : ''}`}
                            onClick={() => setSelectedImage(image)} // Изменение изображения при клике
                        />
                    ))}
                </div>
            </div>

            <div className="product-info">
                {/* Добавляем название продукта */}
                <h1 className="product-title">{airpods.title}</h1>

                {/* Блок с ценой и кнопкой "Купить" */}
                <div className="price-container">
                    <p className="product-price">${airpods.price}</p>
                    <button className="buy-button">Купить</button>
                </div>

                {/* Блок с цветами */}
                <div className="product-colors">
                    <h3>Выберите цвет:</h3>
                    <div className="color-squares">
                        {airpods.colors.map((color, index) => (
                            <div
                                key={index}
                                className={`color-square ${selectedColor === color ? 'selected' : ''}`}
                                style={{ backgroundColor: getColorHex(color) }}
                                onClick={() => handleColorChange(color)} // Изменение цвета
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Блок с описанием в квадратном стиле */}
                <div className="product-description">
                    <div className="description-block">
                        <h3>Аудио функции</h3>
                        <p>{airpods.audioFeatures.join(', ')}</p>
                    </div>
                    <div className="description-block">
                        <h3>Микрофон</h3>
                        <p>{airpods.mic}</p>
                    </div>
                    <div className="description-block">
                        <h3>Чип</h3>
                        <p>{airpods.chip}</p>
                    </div>
                    <div className="description-block">
                        <h3>Управление</h3>
                        <p>{airpods.controls.join(', ')}</p>
                    </div>
                    <div className="description-block">
                        <h3>Размеры</h3>
                        <p>Высота: {airpods.size.height}, Ширина: {airpods.size.width}, Глубина: {airpods.size.depth}, Вес: {airpods.size.weight}</p>
                    </div>
                    <div className="description-block">
                        <h3>Аккумулятор</h3>
                        <p>{airpods.battery}</p>
                    </div>
                    <div className="description-block">
                        <h3>Подключение</h3>
                        <p>{airpods.connectivity}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AirpodsProduct;

// Функция для фильтрации изображений по цвету
const getImagesByColor = (images: string[], color: string): string[] => {
    const normalizedColor = color.replace(/\s+/g, '').toLowerCase(); // Убираем пробелы и делаем цвет строчным
    return images.filter(image =>
        image.toLowerCase().includes(normalizedColor)
    );
};

// Функция для получения цвета в формате HEX
const getColorHex = (color: string): string => {
    switch (color.toLowerCase()) {
        case 'space gray':
            return '#4B4B4B';
        case 'pink':
            return '#FFC0CB';
        case 'green':
            return '#32CD32';
        case 'silver':
            return '#C0C0C0';
        case 'sky blue':
            return '#87CEEB';
        default:
            return '#fff4f4';
    }
};
