import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getWatchById } from '../../Api';
import { WatchDto } from '../../types';
import './ProductDetails.css';

const WatchProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [watch, setWatch] = useState<WatchDto | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedBandTypeIndex, setSelectedBandTypeIndex] = useState<number | null>(null);
    const [selectedBandStyleIndex, setSelectedBandStyleIndex] = useState<number | null>(null);

    // useEffect для получения данных часов
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    const watchData = await getWatchById(id);
                    setWatch(watchData);
                    setSelectedImage(watchData.thumbUrl);

                    if (watchData.bandTypes?.length > 0) {
                        setSelectedBandTypeIndex(0);
                        setSelectedBandStyleIndex(0);
                    }
                }
            } catch (error: any) {
                setError(error.message || 'Ошибка загрузки данных');
            }
        };

        fetchData();
    }, [id]);

    // useEffect для обновления изображения при выборе стиля ремешка
    useEffect(() => {
        if (watch && selectedBandTypeIndex !== null && selectedBandStyleIndex !== null) {
            const currentBandType = watch.bandTypes[selectedBandTypeIndex];
            const currentBandStyle = currentBandType?.styles[selectedBandStyleIndex];
            if (currentBandStyle) {
                setSelectedImage(currentBandStyle.image);
            }
        }
    }, [watch, selectedBandTypeIndex, selectedBandStyleIndex]);

    const getDataOrFallback = (data: any) => data && data.length > 0 ? data : null;

    if (error) {
        return <div>Ошибка загрузки данных: {error}</div>;
    }

    if (!watch) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="product-details">
            {/* Изображения продукта */}
            <div className="product-images">
                <img src={selectedImage || watch.thumbUrl} alt={watch.title} className="main-image" />
                <div className="image-thumbnails">
                    {watch.images.map((img, index) => (
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
                <h1>{watch.title}</h1>
                <div className="price-container">
                    <p className="product-price">${watch.price}</p>
                    <button className="buy-button">Купить</button>
                </div>

                {/* Выбор конфигурации */}
                <div className="product-configuration">
                    <h3>Выбор конфигурации</h3>

                    {/* Выбор типа и стиля ремешка */}
                    <div className="config-option">
                        <h4>Ремешок</h4>
                        {watch.bandTypes ? (
                            <div>
                                <select onChange={(e) => setSelectedBandTypeIndex(Number(e.target.value))}>
                                    {watch.bandTypes.map((bandType, index) => (
                                        <option key={index} value={index}>
                                            {bandType.material} ({bandType.description})
                                        </option>
                                    ))}
                                </select>
                                {selectedBandTypeIndex !== null && watch.bandTypes[selectedBandTypeIndex] && (
                                    <select onChange={(e) => setSelectedBandStyleIndex(Number(e.target.value))}>
                                        {watch.bandTypes[selectedBandTypeIndex].styles.map((style, index) => (
                                            <option key={index} value={index}>
                                                {style.name} ({style.description})
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Характеристики продукта */}
                <div className="product-description">
                    {getDataOrFallback(watch.display.type) && (
                        <div className="description-block">
                            <h3>Экран</h3>
                            <p>Тип: {watch.display.type}</p>
                            <p>Яркость: {watch.display.brightness} нитов</p>
                        </div>
                    )}

                    {getDataOrFallback(watch.chipset.cpu) && (
                        <div className="description-block">
                            <h3>Процессор</h3>
                            <p>Модель: {watch.chipset.cpu}</p>
                        </div>
                    )}

                    {getDataOrFallback(watch.battery.lifetime) && (
                        <div className="description-block">
                            <h3>Аккумулятор</h3>
                            <p>Время работы: {watch.battery.lifetime}</p>
                        </div>
                    )}

                    {getDataOrFallback(watch.caseTypes) && watch.caseTypes[0]?.material && (
                        <div className="description-block">
                            <h3>Материал корпуса</h3>
                            <p>{watch.caseTypes[0].material}</p>
                        </div>
                    )}

                    {/* Новые характеристики с использованием getDataOrFallback */}
                    {getDataOrFallback(watch.resistance?.water) && (
                        <div className="description-block">
                            <h3>Водонепроницаемость и пылезащита</h3>
                            <p>Водонепроницаемость: {watch.resistance.water}</p>
                            <p>Пылезащита: {watch.resistance.dust}</p>
                        </div>
                    )}

                    {getDataOrFallback(watch.connectivity?.wifi) && (
                        <div className="description-block">
                            <h3>Связь</h3>
                            <p>Wi-Fi: {watch.connectivity.wifi}</p>
                            <p>Bluetooth: {watch.connectivity.bluetooth}</p>
                            <p>Чип ультраширокополосной связи: {watch.connectivity.ultraWideBand}</p>
                        </div>
                    )}

                    {getDataOrFallback(watch.sensors) && (
                        <div className="description-block">
                            <h3>Датчики</h3>
                            {watch.sensors.map((sensor, index) => (
                                <p key={index}>{sensor.name}: {sensor.spec}</p>
                            ))}
                        </div>
                    )}

                    {getDataOrFallback(watch.dimensions) && (
                        <div className="description-block">
                            <h3>Размеры и вес</h3>
                            <p>Размеры: {watch.dimensions[0].height} x {watch.dimensions[0].width} x {watch.dimensions[0].depth}</p>
                            <p>Вес: {watch.dimensions[0].weight} г</p>
                        </div>
                    )}

                    {getDataOrFallback(watch.operatingSystem) && (
                        <div className="description-block">
                            <h3>Операционная система</h3>
                            <p>{watch.operatingSystem}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WatchProduct;
