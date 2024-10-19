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

    const getDataOrFallback = (data: any, fallback: string = "Данные отсутствуют") => {
        return data ? data : fallback;
    };

    if (error) {
        return <div>Ошибка загрузки данных: {error}</div>;
    }

    if (!watch) {
        return <div>Загрузка...</div>;
    }

    // Получаем текущий выбранный стиль ремешка
    const currentBandType = selectedBandTypeIndex !== null ? watch.bandTypes[selectedBandTypeIndex] : null;
    const currentBandStyle = currentBandType && selectedBandStyleIndex !== null ? currentBandType.styles[selectedBandStyleIndex] : null;

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
                                {currentBandType && (
                                    <select onChange={(e) => setSelectedBandStyleIndex(Number(e.target.value))}>
                                        {currentBandType.styles.map((style, index) => (
                                            <option key={index} value={index}>
                                                {style.name} ({style.description})
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        ) : (
                            <p>Ремешки отсутствуют</p>
                        )}
                    </div>
                </div>

                {/* Отображение выбранного ремешка */}
                <div className="selected-band">
                    <h4>Выбранный ремешок:</h4>
                    {currentBandStyle ? (
                        <div>
                            <p>{currentBandStyle.name}</p>
                            <img src={currentBandStyle.image} alt={currentBandStyle.name} className="band-image" />
                            <p>Цвета: {currentBandStyle.colors?.join(', ')}</p>
                            <p>Дополнительная цена: ${currentBandStyle.additionalPrice}</p>
                        </div>
                    ) : (
                        <p>Ремешок не выбран</p>
                    )}
                </div>

                {/* Характеристики продукта */}
                <div className="product-description">
                    <div className="description-block">
                        <h3>Экран</h3>
                        <p>Тип: {getDataOrFallback(watch.display.type)}</p>
                        <p>Яркость: {getDataOrFallback(watch.display.brightness)} нитов</p>
                    </div>
                    <div className="description-block">
                        <h3>Процессор</h3>
                        <p>Модель: {getDataOrFallback(watch.chipset.cpu)}</p>
                    </div>
                    <div className="description-block">
                        <h3>Аккумулятор</h3>
                        <p>Время работы: {getDataOrFallback(watch.battery.lifetime)}</p>
                    </div>
                    <div className="description-block">
                        <h3>Материал корпуса</h3>
                        <p>{getDataOrFallback(watch.caseTypes[0]?.material)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WatchProduct;
