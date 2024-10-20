import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getIpadById } from '../../Api';
import { IpadDto } from '../../types';
import './ProductDetails.css';
import ImageWrapper from "../handler/ImageWrapper";

// Маппинг для цветов (при необходимости можешь добавить больше цветов)
const colorMapping: { [key: string]: string } = {
    "Space Grey": "#2c2c2f",
    "Silver": "#c0c0c0",
    "Pink": "#ffb6c1",
    "Blue": "#0000ff",
    "Yellow": "#fff700",
    "Starlight": "#f2f2f7",
    "Purple": "#800080"
};

const IpadProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [ipad, setIpad] = useState<IpadDto | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedStorage, setSelectedStorage] = useState<string | null>(null);

    // useEffect для получения данных iPad
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    const ipadData = await getIpadById(id);

                    // Удаляем пустые строки из массива изображений
                    const validImages = ipadData.images.filter(img => img && img.trim() !== "");

                    setIpad({ ...ipadData, images: validImages });
                    setSelectedImage(validImages[0] || ipadData.thumbUrl);
                    setSelectedColor(ipadData.colors[0]);
                    setSelectedStorage(ipadData.storages[0].size);
                }
            } catch (error: any) {
                setError(error.message || 'Ошибка загрузки данных');
            }
        };

        fetchData();
    }, [id]);

    // Функция для проверки данных
    const getDataOrFallback = (data: any) => data && data.length > 0 ? data : null;

    if (error) {
        return <div>Ошибка загрузки данных: {error}</div>;
    }

    if (!ipad) {
        return <div>Загрузка...</div>;
    }

    const selectedStoragePrice = ipad.storages.find(storage => storage.size === selectedStorage)?.additionalPrice || 0;
    const totalPrice = ipad.price + selectedStoragePrice;

    return (
        <div className="product-details">
            {/* Изображения продукта */}
            <div className="product-images">
                <ImageWrapper src={selectedImage || ipad.thumbUrl} alt={ipad.title} className="main-image" />
                <div className="image-thumbnails">
                    {ipad.images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Image ${index + 1}`}
                            className={`thumbnail ${img === selectedImage ? 'selected' : ''}`}
                            onClick={() => setSelectedImage(img)}
                        />
                    ))}
                </div>
            </div>

            {/* Информация о продукте */}
            <div className="product-info">
                <h2>{ipad.title}</h2>

                {/* Блок с ценой и кнопкой */}
                <div className="price-container">
                    <p className="product-price">${totalPrice}</p>
                    <button className="buy-button">Купить</button>
                </div>

                {/* Рендерим блок выбора цвета только если больше одного цвета */}
                {ipad.colors.length > 1 && (
                    <div className="product-colors">
                        <h3>Цвета</h3>
                        <div className="color-squares">
                            {ipad.colors.map(color => (
                                <div
                                    key={color}
                                    className={`color-square ${color === selectedColor ? 'selected' : ''}`}
                                    onClick={() => setSelectedColor(color)}
                                    style={{ backgroundColor: colorMapping[color] || 'transparent' }} // Применяем цвет из маппинга
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="product-storage">
                    <h3>Хранилище</h3>
                    <select
                        value={selectedStorage || ipad.storages[0].size}
                        onChange={(e) => setSelectedStorage(e.target.value)}
                    >
                        {ipad.storages.map(storage => (
                            <option key={storage.size} value={storage.size}>
                                {storage.size} GB (Дополнительно: ${storage.additionalPrice})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Блоки с характеристиками. Показ только если данные существуют */}
                <div className="product-description">
                    {getDataOrFallback(ipad.display.size) && (
                        <div className="description-block">
                            <h3>Экран</h3>
                            <p>{ipad.display.size} дюймов, {ipad.display.type}, {ipad.display.resolution}, {ipad.display.ppi} PPI, {ipad.display.refreshRate}Hz</p>
                        </div>
                    )}

                    {getDataOrFallback(ipad.processor.chip) && (
                        <div className="description-block">
                            <h3>Процессор</h3>
                            <p>{ipad.processor.chip}, CPU: {ipad.processor.cpu}, GPU: {ipad.processor.gpu}</p>
                        </div>
                    )}

                    {getDataOrFallback(ipad.camera.rearCameras) && (
                        <div className="description-block">
                            <h3>Камеры</h3>
                            <p>Основные камеры: {ipad.camera.rearCameras.map(cam => `${cam.resolution} (${cam.type})`).join(', ')}</p>
                            <p>Фронтальная камера: {ipad.camera.frontCamera.resolution} ({ipad.camera.frontCamera.aperture})</p>
                        </div>
                    )}

                    {getDataOrFallback(ipad.memory) && (
                        <div className="description-block">
                            <h3>Память</h3>
                            <p>{ipad.memory} GB</p>
                        </div>
                    )}

                    {getDataOrFallback(ipad.battery.capacity) && (
                        <div className="description-block">
                            <h3>Аккумулятор</h3>
                            <p>Емкость: {ipad.battery.capacity}</p>
                        </div>
                    )}

                    {getDataOrFallback(ipad.dimensions.height) && (
                        <div className="description-block">
                            <h3>Габариты и вес</h3>
                            <p>Высота: {ipad.dimensions.height}, Ширина: {ipad.dimensions.width}, Глубина: {ipad.dimensions.depth}, Вес: {ipad.dimensions.weight}</p>
                        </div>
                    )}

                    {getDataOrFallback(ipad.operatingSystem) && (
                        <div className="description-block">
                            <h3>Операционная система</h3>
                            <p>{ipad.operatingSystem}</p>
                        </div>
                    )}

                    {getDataOrFallback(ipad.connectivities) && (
                        <div className="description-block">
                            <h3>Подключение</h3>
                            <p>{ipad.connectivities.map(conn => conn.type).join(', ')}</p>
                        </div>
                    )}

                    {getDataOrFallback(ipad.applePencils) && (
                        <div className="description-block">
                            <h3>Apple Pencil</h3>
                            <p>{ipad.applePencils.map(pencil => `${pencil.type} (Дополнительно: $${pencil.additionalPrice})`).join(', ')}</p>
                        </div>
                    )}

                    {getDataOrFallback(ipad.smartKeyboards) && (
                        <div className="description-block">
                            <h3>Клавиатура</h3>
                            <p>{ipad.smartKeyboards.map(keyboard => `${keyboard.type} (Дополнительно: $${keyboard.additionalPrice})`).join(', ')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IpadProduct;
