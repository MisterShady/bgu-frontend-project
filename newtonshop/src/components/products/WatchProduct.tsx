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
    const [selectedCaseIndex, setSelectedCaseIndex] = useState<number | null>(null);
    const [selectedVersionIndex, setSelectedVersionIndex] = useState<number | null>(null);
    const [selectedSizeIndex, setSelectedSizeIndex] = useState<number | null>(null);
    const getDataOrFallback = (data: any) => data && data.length > 0 ? data : null;

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
                    if (watchData.caseTypes?.length > 0) {
                        setSelectedCaseIndex(0);
                    }
                    if (watchData.versions?.length > 0) {
                        setSelectedVersionIndex(0);
                    }
                    if (watchData.size) {
                        setSelectedSizeIndex(0);
                    }
                }
            } catch (error: any) {
                setError(error.message || 'Ошибка загрузки данных');
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        if (watch && selectedBandTypeIndex !== null && selectedBandStyleIndex !== null) {
            const currentBandType = watch.bandTypes[selectedBandTypeIndex];
            const currentBandStyle = currentBandType?.styles[selectedBandStyleIndex];
            if (currentBandStyle) {
                setSelectedImage(currentBandStyle.image);
            }
        }
    }, [watch, selectedBandTypeIndex, selectedBandStyleIndex]);

    if (error) {
        return <div>Ошибка загрузки данных: {error}</div>;
    }

    if (!watch) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="product-details">
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

            <div className="product-info">
                <h1>{watch.title}</h1>
                <div className="price-container">
                    <p className="product-price">${watch.price}</p>
                    <button className="buy-button">Купить</button>
                </div>

                <div className="product-configuration">
                    <h3>Выбор конфигурации</h3>

                    {watch.bandTypes && (
                        <div className="config-option">
                            <h4>Тип ремешка</h4>
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
                    )}

                    {watch.caseTypes && (
                        <div className="config-option">
                            <h4>Материал корпуса</h4>
                            <select onChange={(e) => setSelectedCaseIndex(Number(e.target.value))}>
                                {watch.caseTypes.map((caseType, index) => (
                                    <option key={index} value={index}>
                                        {caseType.material} ({caseType.description})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {watch.versions && (
                        <div className="config-option">
                            <h4>Версия</h4>
                            <select onChange={(e) => setSelectedVersionIndex(Number(e.target.value))}>
                                {watch.versions.map((version, index) => (
                                    <option key={index} value={index}>
                                        {version.type} ({version.description})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {watch.size && (
                        <div className="config-option">
                            <h4>Размер</h4>
                            <select onChange={(e) => setSelectedSizeIndex(Number(e.target.value))}>
                                <option value={0}>
                                    {watch.size.large.name} (Доплата: ${watch.size.large.additionalPrice})
                                </option>
                                {watch.size.small && typeof watch.size.small !== 'string' && (
                                    <option value={1}>
                                        {watch.size.small.name} (Доплата: ${watch.size.small.additionalPrice})
                                    </option>
                                )}
                                {typeof watch.size.small === 'string' && (
                                    <option value={1}>{watch.size.small}</option>
                                )}
                            </select>
                        </div>
                    )}
                </div>

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
