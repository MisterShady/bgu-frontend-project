import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getMacById} from "../../Api";
import {MacDto} from "../../types";
import "./ProductDetails.css";
import {colorMapping} from "./colorMapping";
import {useFetch} from "../hooks/useFetch";
import Spinner from "../Spinner";
import ImageWrapper from "../handler/ImageWrapper";

const MacProduct = () => {
    const {id} = useParams<{ id: string }>();
    const {data: mac, error, loading} = useFetch<MacDto>(() => getMacById(id!));
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedStorage, setSelectedStorage] = useState<string | null>(null);
    const [selectedRam, setSelectedRam] = useState<string | null>(null);

    const getDataOrFallback = <T, K extends keyof T>(obj: T | null | undefined, key: K, fallback: T[K]): T[K] => {
        return obj && obj[key] !== undefined ? obj[key] : fallback;
    };

    useEffect(() => {
        if (mac && selectedColor === null && !selectedImage) {
            setSelectedColor(mac.colors[0]);
            setSelectedImage(mac.images[0]);
            setSelectedStorage(mac.storages[0].size);
            setSelectedRam(mac.ramMemories?.[0]?.size || null);
        }
    }, [mac]);

    if (loading || !mac) {
        return <Spinner/>;
    }

    if (error) {
        return <div>Ошибка загрузки данных: {error}</div>;
    }

    const selectedStoragePrice = getDataOrFallback(
        mac.storages?.find((storage) => storage.size === selectedStorage),
        "additionalPrice",
        0
    );
    const selectedRamPrice = getDataOrFallback(
        mac.ramMemories?.find((ram) => ram.size === selectedRam),
        "additionalPrice",
        0
    );
    const totalPrice = mac.price + selectedStoragePrice + selectedRamPrice;

    return (
        <div className="product-details">
            <div className="product-images">
                <ImageWrapper src={selectedImage || (mac.images && mac.images[0])} alt={mac.title}
                              className="main-image"/>
                <div className="image-thumbnails">
                    {mac.images.map((image, index) => (
                        <img
                            key={image}
                            src={image}
                            alt={`Mac Image ${index + 1}`}
                            className={`thumbnail ${image === selectedImage ? "selected" : ""}`}
                            onClick={() => setSelectedImage(image)}
                        />
                    ))}
                </div>
            </div>

            <div className="product-info">
                <h2>{mac.title}</h2>

                <div className="price-container">
                    <p className="product-price">${totalPrice}</p>
                    <button className="buy-button">В корзину</button>
                </div>

                {getDataOrFallback(mac.colors, "length", 0) > 1 && (
                    <div className="product-colors">
                        <h3>Выберите цвет</h3>
                        <div className="color-squares">
                            {mac.colors.map((color) => (
                                <div key={color} className="color-square-container">
                                    <div
                                        className={`color-square ${color === selectedColor ? "selected" : ""}`}
                                        onClick={() => setSelectedColor(color)}
                                        style={{backgroundColor: colorMapping[color] || "transparent"}}
                                    />
                                    <div className="color-tooltip">
                                        <p>{color}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="product-configuration">
                    <h3>Выбор конфигурации</h3>

                    <div className="config-option">
                        <h4>Память</h4>
                        <select value={selectedRam || ""} onChange={(e) => setSelectedRam(e.target.value)}>
                            {mac.ramMemories?.map((ram) => (
                                <option key={ram.size} value={ram.size}>
                                    {ram.size} GB
                                    {ram.additionalPrice > 0 && ` (Дополнительно: $${ram.additionalPrice})`}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="config-option">
                        <h4>Хранилище</h4>
                        <select value={selectedStorage || ""} onChange={(e) => setSelectedStorage(e.target.value)}>
                            {mac.storages?.map((storage) => (
                                <option key={storage.size} value={storage.size}>
                                    {storage.size} GB
                                    {storage.additionalPrice > 0 && ` (Дополнительно: $${storage.additionalPrice})`}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="product-description">
                    {getDataOrFallback(mac.display, "size", "") && (
                        <div className="description-block">
                            <h3>Экран</h3>
                            <p>
                                {mac.display.size}, {mac.display.resolution}, {mac.display.brightness} nits, {mac.display.refreshRate}
                                Hz, PPI: {mac.display.ppi}
                            </p>
                        </div>
                    )}

                    {getDataOrFallback(mac.processor, "name", "") && (
                        <div className="description-block">
                            <h3>Процессор</h3>
                            <p>
                                {mac.processor.name}, {mac.processor.cpu}, GPU: {mac.processor.gpu},
                                Скорость: {mac.processor.speed}
                            </p>
                        </div>
                    )}

                    {getDataOrFallback(mac.battery, "life", "") && (
                        <div className="description-block">
                            <h3>Аккумулятор</h3>
                            <p>
                                Тип: {mac.battery.type}, Время работы: {mac.battery.life}
                            </p>
                        </div>
                    )}

                    {getDataOrFallback(mac.operatingSystem, "initial", "") && (
                        <div className="description-block">
                            <h3>Операционная система</h3>
                            <p>
                                Начальная: {mac.operatingSystem.initial}, Последняя: {mac.operatingSystem.latest}
                            </p>
                        </div>
                    )}

                    {getDataOrFallback(mac.dimensions, "height", "") && (
                        <div className="description-block">
                            <h3>Габариты и вес</h3>
                            <p>
                                Высота: {mac.dimensions.height}, Ширина: {mac.dimensions.width},
                                Глубина: {mac.dimensions.depth}, Вес:{" "}
                                {mac.dimensions.weight}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MacProduct;
