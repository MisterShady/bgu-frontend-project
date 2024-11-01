import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getIpadById } from "../../Api";
import { IpadDto } from "../../types";
import "./ProductDetails.css";
import ImageWrapper from "../handler/ImageWrapper";
import { colorMapping } from "./colorMapping";
import LazyLoad from "react-lazyload";
import { useFetch } from "../hooks/useFetch";
import { getDataOrFallback } from "../../utils";
import Spinner from "../Spinner";

const IpadProduct = () => {
  const { id } = useParams<{ id: string }>();
  const { data: ipad, error, loading } = useFetch<IpadDto>(() => getIpadById(id!));
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);
  const [selectedConnectivity, setSelectedConnectivity] = useState<string | null>(null);
  const [selectedApplePencil, setSelectedApplePencil] = useState<string | null>(null);
  const [selectedSmartKeyboard, setSelectedSmartKeyboard] = useState<string | null>(null);

  const selectedStoragePrice = ipad?.storages.find((storage) => storage.size === selectedStorage)?.additionalPrice || 0;
  const selectedConnectivityPrice =
    ipad?.connectivities.find((conn) => conn.type === selectedConnectivity)?.additionalPrice || 0;
  const selectedApplePencilPrice =
    ipad?.applePencils.find((pencil) => pencil.type === selectedApplePencil)?.additionalPrice || 0;
  const selectedSmartKeyboardPrice =
    ipad?.smartKeyboards.find((keyboard) => keyboard.type === selectedSmartKeyboard)?.additionalPrice || 0;

  const totalPrice = ipad
    ? ipad.price +
      selectedStoragePrice +
      selectedConnectivityPrice +
      selectedApplePencilPrice +
      selectedSmartKeyboardPrice
    : 0;

  useEffect(() => {
    if (ipad && !selectedImage) {
      const defaultColor = ipad.colors[0];
      setSelectedColor(defaultColor);
      setSelectedImage(ipad.images[0]);
      setSelectedStorage(ipad.storages[0].size);
      setSelectedConnectivity(ipad.connectivities[0].type);
      setSelectedApplePencil(ipad.applePencils[0].type);
      setSelectedSmartKeyboard(ipad.smartKeyboards[0].type);
    }
  }, [ipad]);

  if (!ipad || loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Ошибка загрузки данных: {error}</div>;
  }

  return (
    <div className="product-details">
      <div className="product-images">
        <LazyLoad height={200} offset={100}>
          <ImageWrapper src={selectedImage || ipad.thumbUrl} alt={ipad.title} className="main-image" />
        </LazyLoad>
        <div className="image-thumbnails">
          {ipad.images.map((img) => (
            <LazyLoad key={img} height={50} offset={100}>
              <img
                src={img}
                alt={`Image ${img + 1}`}
                className={`thumbnail ${img === selectedImage ? "selected" : ""}`}
                onClick={() => setSelectedImage(img)}
              />
            </LazyLoad>
          ))}
        </div>
      </div>

      <div className="product-info">
        <h2>{ipad.title}</h2>

        <div className="price-container">
          <p className="product-price">${totalPrice}</p>
          <button className="buy-button">В корзину</button>
        </div>

        {ipad.colors.length > 1 && (
          <div className="product-colors">
            <h3>Выберите цвет</h3>
            <div className="color-squares">
              {ipad.colors.map((color) => (
                <div key={color} className="color-square-container">
                  <div
                    className={`color-square ${selectedColor === color ? "selected" : ""}`}
                    onClick={() => setSelectedColor(color)}
                    style={{ backgroundColor: colorMapping[color] || "transparent" }}
                  >
                    <div className="color-tooltip">
                      <p>{color}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="product-configuration">
          <h3>Выбор конфигурации</h3>

          <div className="config-option">
            <h4>Хранилище</h4>
            <select
              value={selectedStorage || ipad.storages[0].size}
              onChange={(e) => setSelectedStorage(e.target.value)}
            >
              {ipad.storages.map((storage) => (
                <option key={storage.size} value={storage.size}>
                  {storage.size} {storage.additionalPrice > 0 ? `(Дополнительно: $${storage.additionalPrice})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="config-option">
            <h4>Подключение</h4>
            <select
              value={selectedConnectivity || ipad.connectivities[0].type}
              onChange={(e) => setSelectedConnectivity(e.target.value)}
            >
              {ipad.connectivities.map((conn) => (
                <option key={conn.type} value={conn.type}>
                  {conn.type} {conn.additionalPrice > 0 ? `(Дополнительно: $${conn.additionalPrice})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="config-option">
            <h4>Карандаш</h4>
            <select
              value={selectedApplePencil || ipad.applePencils[0].type}
              onChange={(e) => setSelectedApplePencil(e.target.value)}
            >
              {ipad.applePencils.map((pencil) => (
                <option key={pencil.type} value={pencil.type}>
                  {pencil.type} {pencil.additionalPrice > 0 ? `(Дополнительно: $${pencil.additionalPrice})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="config-option">
            <h4>Клавиатура</h4>
            <select
              value={selectedSmartKeyboard || ipad.smartKeyboards[0].type}
              onChange={(e) => setSelectedSmartKeyboard(e.target.value)}
            >
              {ipad.smartKeyboards.map((keyboard) => (
                <option key={keyboard.type} value={keyboard.type}>
                  {keyboard.type} {keyboard.additionalPrice > 0 ? `(Дополнительно: $${keyboard.additionalPrice})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="product-description">
          <div className="description-block">
            <h3>Экран</h3>
            <p>
              {getDataOrFallback(ipad.display, "size", "")}, {getDataOrFallback(ipad.display, "type", "")},{" "}
              {getDataOrFallback(ipad.display, "resolution", "")}, {getDataOrFallback(ipad.display, "ppi", "")} PPI,{" "}
              {getDataOrFallback(ipad.display, "refreshRate", "")}
            </p>
          </div>

          <div className="description-block">
            <h3>Процессор</h3>
            <p>
              {getDataOrFallback(ipad.processor, "chip", "")}, CPU: {getDataOrFallback(ipad.processor, "cpu", "")}, GPU:{" "}
              {getDataOrFallback(ipad.processor, "gpu", "")}
            </p>
          </div>

          <div className="description-block">
            <h3>Камеры</h3>
            <p>Основные камеры: {ipad.camera.rearCameras.map((cam) => `${cam.resolution} (${cam.type})`).join(", ")}</p>
            <p>
              Фронтальная камера: {getDataOrFallback(ipad.camera.frontCamera, "resolution", "")} (
              {getDataOrFallback(ipad.camera.frontCamera, "aperture", "")})
            </p>
          </div>

          <div className="description-block">
            <h3>Память</h3>
            <p>{getDataOrFallback(ipad, "memory", "")}</p>
          </div>

          <div className="description-block">
            <h3>Аккумулятор</h3>
            <p>Емкость: {getDataOrFallback(ipad.battery, "capacity", "")}</p>
          </div>

          <div className="description-block">
            <h3>Габариты и вес</h3>
            <p>
              Высота: {getDataOrFallback(ipad.dimensions, "height", "")}, ширина:{" "}
              {getDataOrFallback(ipad.dimensions, "width", "")}, толщина:{" "}
              {getDataOrFallback(ipad.dimensions, "depth", "")}, вес: {getDataOrFallback(ipad.dimensions, "weight", "")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IpadProduct;
