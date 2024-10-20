import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getIphoneById } from '../../Api';
import { IphoneDto } from '../../types';
import './ProductDetails.css';

// Маппинг для цветов
const colorMapping: { [key: string]: string } = {
    "Natural Titanium": "#e2d3cc",
    "Blue Titanium": "#3b8bca",
    "White Titanium": "#f5f5f5",
    "Black Titanium": "#313131",
    "Pink": "#ffb6c1",
    "Yellow": "#fff700",
    "Green": "#4caf50",
    "Blue": "#0000ff",
    "Black": "#232323",
    "Deep Purple": "#673ab7",
    "Gold": "#ffd700",
    "Silver": "#c0c0c0",
    "Space Black": "#2c2c2f",
    "Midnight": "#36363a",
    "Starlight": "#f2f2f7",
    "Product Red": "#ce1f1f",
    "Alpine Green": "#4caf50",
    "Graphite": "#4b4b4b",
    "Sierra Blue": "#4b89ac"
};

const IphoneProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [iphone, setIphone] = useState<IphoneDto | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedStorage, setSelectedStorage] = useState<string | null>(null);

    // useEffect для получения данных телефона
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    const iphoneData = await getIphoneById(id);

                    // Удаляем пустые строки из массива изображений
                    const validImages = iphoneData.images.filter(img => img && img.trim() !== "");

                    setIphone({ ...iphoneData, images: validImages });
                    setSelectedImage(validImages[0] || iphoneData.thumbUrl);
                    setSelectedColor(iphoneData.colors[0]);
                    setSelectedStorage(iphoneData.storages[0].size);
                }
            } catch (error: any) {
                setError(error.message || 'Ошибка загрузки данных');
            }
        };

        fetchData();
    }, [id]);

    const getDataOrFallback = (data: any) => data && data.length > 0 ? data : null;

    if (error) {
        return <div>Ошибка загрузки данных: {error}</div>;
    }

    if (!iphone) {
        return <div>Загрузка...</div>;
    }

    const selectedStoragePrice = iphone.storages.find(storage => storage.size === selectedStorage)?.additionalPrice || 0;
    const totalPrice = iphone.price + selectedStoragePrice;

    return (
        <div className="product-details">
            {/* Изображения продукта */}
            <div className="product-images">
                <img src={selectedImage || iphone.thumbUrl} alt={iphone.title} className="main-image" />
                <div className="image-thumbnails">
                    {iphone.images.map((img, index) => (
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
                <h2>{iphone.title}</h2>

                {/* Блок с ценой и кнопкой */}
                <div className="price-container">
                    <p className="product-price">${totalPrice}</p>
                    <button className="buy-button">Купить</button>
                </div>

                {/* Рендерим блок выбора цвета только если больше одного цвета */}
                {iphone.colors.length > 1 && (
                    <div className="product-colors">
                        <h3>Цвета</h3>
                        <div className="color-squares">
                            {iphone.colors.map(color => (
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
                        value={selectedStorage || iphone.storages[0].size}
                        onChange={(e) => setSelectedStorage(e.target.value)}
                    >
                        {iphone.storages.map(storage => (
                            <option key={storage.size} value={storage.size}>
                                {storage.size}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="product-description">
                    {getDataOrFallback(iphone.display.size) && (
                        <div className="description-block">
                            <h3>Экран</h3>
                            <p>{iphone.display.size} дюймов, {iphone.display.resolution}</p>
                        </div>
                    )}

                    {getDataOrFallback(iphone.processor.chip) && (
                        <div className="description-block">
                            <h3>Процессор</h3>
                            <p>{iphone.processor.chip}</p>
                        </div>
                    )}

                    {getDataOrFallback(iphone.camera.rearCameras) && (
                        <div className="description-block">
                            <h3>Камеры</h3>
                            <p>{iphone.camera.rearCameras.map(cam => `${cam.resolution} (${cam.type})`).join(', ')}</p>
                        </div>
                    )}

                    {getDataOrFallback(iphone.battery.capacity) && (
                        <div className="description-block">
                            <h3>Аккумулятор</h3>
                            <p>{iphone.battery.capacity} мАч</p>
                        </div>
                    )}

                    {getDataOrFallback(iphone.memory) && (
                        <div className="description-block">
                            <h3>Память</h3>
                            <p>{iphone.memory} GB</p>
                        </div>
                    )}

                    {getDataOrFallback(iphone.operatingSystem) && (
                        <div className="description-block">
                            <h3>Операционная система</h3>
                            <p>{iphone.operatingSystem}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IphoneProduct;