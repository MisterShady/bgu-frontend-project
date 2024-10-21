import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { getIpadById } from "../../Api";
import { IpadDto } from "../../types";
import "./ProductDetails.css";
import ImageWrapper from "../handler/ImageWrapper";
import { colorMapping } from "./colorMapping";

const IpadProduct = () => {
  const { id } = useParams<{ id: string }>();
  const [ipad, setIpad] = useState<IpadDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);
  const [selectedConnectivity, setSelectedConnectivity] = useState<string | null>(null);
  const [selectedApplePencil, setSelectedApplePencil] = useState<string | null>(null);
  const [selectedSmartKeyboard, setSelectedSmartKeyboard] = useState<string | null>(null);

  const getDataOrFallback = (data: any) => (data && data.length > 0 ? data : null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const ipadData = await getIpadById(id);

          const validImages = ipadData.images.filter((img) => img && img.trim() !== "");

          setIpad({ ...ipadData, images: validImages });
          setSelectedImage(validImages[0] || ipadData.thumbUrl);
          setSelectedColor(ipadData.colors[0]);
          setSelectedStorage(ipadData.storages[0].size);
          setSelectedConnectivity(ipadData.connectivities[0].type);
          setSelectedApplePencil(ipadData.applePencils[0].type);
          setSelectedSmartKeyboard(ipadData.smartKeyboards[0].type);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.message || "Ошибка загрузки данных");
        } else {
          setError("Неизвестная ошибка");
        }
      }
    };

    fetchData().catch((error) => {
      const axiosError = error as AxiosError;
      setError(axiosError.message || "Ошибка загрузки данных");
    });
  }, [id]);

  if (error) {
    return <div>Ошибка загрузки данных: {error}</div>;
  }

  if (!ipad) {
    return <div>Загрузка...</div>;
  }

  const selectedStoragePrice = ipad.storages.find((storage) => storage.size === selectedStorage)?.additionalPrice || 0;
  const totalPrice = ipad.price + selectedStoragePrice;

  return (
    <div className="product-details">
      <div className="product-images">
        <ImageWrapper src={selectedImage || ipad.thumbUrl} alt={ipad.title} className="main-image" />
        <div className="image-thumbnails">
          {ipad.images.map((img) => (
            <img
              key={img}
              src={img}
              alt={`Image ${img + 1}`}
              className={`thumbnail ${img === selectedImage ? "selected" : ""}`}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
      </div>

      <div className="product-info">
        <h2>{ipad.title}</h2>

        <div className="price-container">
          <p className="product-price">${totalPrice}</p>
          <button className="buy-button">Купить</button>
        </div>

        {ipad.colors.length > 1 && (
          <div className="product-colors">
            <h3>Цвета</h3>
            <div className="color-squares">
              {ipad.colors.map((color) => (
                <div
                  key={color}
                  className={`color-square ${color === selectedColor ? "selected" : ""}`}
                  onClick={() => setSelectedColor(color)}
                  style={{ backgroundColor: colorMapping[color] || "transparent" }}
                />
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
                  {storage.size} GB (Дополнительно: ${storage.additionalPrice})
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
                  {conn.type} (Дополнительно: ${conn.additionalPrice})
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
                  {pencil.type} (Дополнительно: ${pencil.additionalPrice})
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
                  {keyboard.type} (Дополнительно: ${keyboard.additionalPrice})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="product-description">
          {getDataOrFallback(ipad.display.size ? [ipad.display.size] : null) && (
            <div className="description-block">
              <h3>Экран</h3>
              <p>
                {ipad.display.size} дюймов, {ipad.display.type}, {ipad.display.resolution}, {ipad.display.ppi} PPI,{" "}
                {ipad.display.refreshRate}Hz
              </p>
            </div>
          )}

          {getDataOrFallback(ipad.processor.chip ? [ipad.processor.chip] : null) && (
            <div className="description-block">
              <h3>Процессор</h3>
              <p>
                {ipad.processor.chip}, CPU: {ipad.processor.cpu}, GPU: {ipad.processor.gpu}
              </p>
            </div>
          )}

          {getDataOrFallback(ipad.camera.rearCameras) && (
            <div className="description-block">
              <h3>Камеры</h3>
              <p>
                Основные камеры: {ipad.camera.rearCameras.map((cam) => `${cam.resolution} (${cam.type})`).join(", ")}
              </p>
              <p>
                Фронтальная камера: {ipad.camera.frontCamera.resolution} ({ipad.camera.frontCamera.aperture})
              </p>
            </div>
          )}

          {getDataOrFallback(ipad.memory ? [ipad.memory] : null) && (
            <div className="description-block">
              <h3>Память</h3>
              <p>{ipad.memory} GB</p>
            </div>
          )}

          {getDataOrFallback(ipad.battery.capacity ? [ipad.battery.capacity] : null) && (
            <div className="description-block">
              <h3>Аккумулятор</h3>
              <p>Емкость: {ipad.battery.capacity}</p>
            </div>
          )}

          {getDataOrFallback(ipad.dimensions.height ? [ipad.dimensions.height] : null) && (
            <div className="description-block">
              <h3>Габариты и вес</h3>
              <p>
                Высота: {ipad.dimensions.height}, Ширина: {ipad.dimensions.width}, Глубина: {ipad.dimensions.depth},
                Вес: {ipad.dimensions.weight}
              </p>
            </div>
          )}

          {getDataOrFallback(ipad.operatingSystem ? [ipad.operatingSystem] : null) && (
            <div className="description-block">
              <h3>Операционная система</h3>
              <p>{ipad.operatingSystem}</p>
            </div>
          )}

          {getDataOrFallback(ipad.connectivities) && (
            <div className="description-block">
              <h3>Подключение</h3>
              <p>{ipad.connectivities.map((conn) => conn.type).join(", ")}</p>
            </div>
          )}

          {getDataOrFallback(ipad.applePencils) && (
            <div className="description-block">
              <h3>Поддержка Apple Pencil</h3>
              <p>{ipad.applePencils.map((pencil) => pencil.type).join(", ")}</p>
            </div>
          )}

          {getDataOrFallback(ipad.smartKeyboards) && (
            <div className="description-block">
              <h3>Поддержка Smart Keyboard</h3>
              <p>{ipad.smartKeyboards.map((keyboard) => keyboard.type).join(", ")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IpadProduct;
