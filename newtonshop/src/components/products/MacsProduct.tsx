import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMacById } from '../../Api';
import { MacDto } from '../../types';
import './ProductDetails.css';

const colorMapping: { [key: string]: string } = {
    "Space Black": "#000000",
    "Silver": "#c0c0c0",
    "Space Grey": "#757575",
    "Gold": "#FFD700",
    "Midnight": "#1A1A1A",
    "Starlight": "#F5DEB3",
};

const MacsProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [mac, setMac] = useState<MacDto | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedStorage, setSelectedStorage] = useState<string | null>(null);
    const [selectedRam, setSelectedRam] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    const macData = await getMacById(id);

                    const validImages = macData.images?.filter(img => img?.trim()) || [];

                    setMac({ ...macData, images: validImages });
                    setSelectedImage(validImages[0] || macData.thumbUrl);
                    setSelectedColor(macData.colors?.[0] || null);
                    setSelectedStorage(macData.storages?.[0]?.size || null);
                    setSelectedRam(macData.ramMemories?.[0]?.size || null);
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

    const selectedStoragePrice = mac.storages?.find(storage => storage.size === selectedStorage)?.additionalPrice || 0;
    const selectedRamPrice = mac.ramMemories?.find(ram => ram.size === selectedRam)?.additionalPrice || 0;
    const totalPrice = mac.price + selectedStoragePrice + selectedRamPrice;

    return (
        <div className="product-details">
            <div className="product-images">
                <img src={selectedImage || mac.thumbUrl} alt={mac.title} className="main-image" />
                <div className="image-thumbnails">
                    {mac.images?.map((img, index) => (
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

            <div className="product-info">
                <h2>{mac.title}</h2>

                <div className="price-container">
                    <p className="product-price">${totalPrice}</p>
                    <button className="buy-button">Купить</button>
                </div>

                {mac.colors?.length > 1 && (
                    <div className="product-colors">
                        <h3>Цвета</h3>
                        <div className="color-squares">
                            {mac.colors.map(color => (
                                <div
                                    key={color}
                                    className={`color-square ${color === selectedColor ? 'selected' : ''}`}
                                    onClick={() => setSelectedColor(color)}
                                    style={{ backgroundColor: colorMapping[color] || 'transparent' }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="product-ram">
                    <h3>Память</h3>
                    <select
                        value={selectedRam || ''}
                        onChange={(e) => setSelectedRam(e.target.value)}
                    >
                        {mac.ramMemories?.map(ram => (
                            <option key={ram.size} value={ram.size}>
                                {ram.size} GB (Дополнительно: ${ram.additionalPrice})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="product-storage">
                    <h3>Хранилище</h3>
                    <select
                        value={selectedStorage || ''}
                        onChange={(e) => setSelectedStorage(e.target.value)}
                    >
                        {mac.storages?.map(storage => (
                            <option key={storage.size} value={storage.size}>
                                {storage.size} GB (Дополнительно: ${storage.additionalPrice})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="product-description">
                    {mac.display?.smallScreen?.size && (
                        <div className="description-block">
                            <h3>Экран</h3>
                            <p>{mac.display.smallScreen.size} дюймов, {mac.display.smallScreen.resolution}, {mac.display.brightness} nits</p>
                        </div>
                    )}

                    {mac.processor?.name && (
                        <div className="description-block">
                            <h3>Процессор</h3>
                            <p>{mac.processor.name}, CPU: {mac.processor.cpu}, GPU: {mac.processor.gpu}</p>
                        </div>
                    )}

                    {mac.connectivity?.wifi && (
                        <div className="description-block">
                            <h3>Подключения</h3>
                            <p>Wi-Fi: {mac.connectivity.wifi}, Bluetooth: {mac.connectivity.bluetooth}</p>
                        </div>
                    )}

                    {mac.battery?.lifetime && (
                        <div className="description-block">
                            <h3>Аккумулятор</h3>
                            <p>Время работы: {mac.battery.lifetime}</p>
                        </div>
                    )}

                    {mac.dimensions?.height && (
                        <div className="description-block">
                            <h3>Габариты и вес</h3>
                            <p>Высота: {mac.dimensions.height}, Ширина: {mac.dimensions.width}, Глубина: {mac.dimensions.depth}, Вес: {mac.dimensions.weight}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MacsProduct;
