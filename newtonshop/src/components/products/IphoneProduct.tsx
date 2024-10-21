import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getIphoneById } from "../../Api";
import { IphoneDto } from "../../types";
import "./ProductDetails.css";
import { colorMapping } from "./colorMapping";
import { AxiosError } from "axios";

const IphoneProduct = () => {
  const { id } = useParams<{ id: string }>();
  const [iphone, setIphone] = useState<IphoneDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);
  const getDataOrFallback = (data: any) => (data && data.length > 0 ? data : null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const iphoneData = await getIphoneById(id);

          const validImages = iphoneData.images.filter((img) => img && img.trim() !== "");

          setIphone({ ...iphoneData, images: validImages });
          setSelectedImage(validImages[0] || iphoneData.thumbUrl);
          setSelectedColor(iphoneData.colors[0]);
          setSelectedStorage(iphoneData.storages[0].size);
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        setError(axiosError.message || "Ошибка загрузки данных");
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

  if (!iphone) {
    return <div>Загрузка...</div>;
  }

  const selectedStoragePrice =
    iphone.storages.find((storage) => storage.size === selectedStorage)?.additionalPrice || 0;
  const totalPrice = iphone.price + selectedStoragePrice;

  return (
    <div className="product-details">
      <div className="product-images">
        <img src={selectedImage || iphone.thumbUrl} alt={iphone.title} className="main-image" />
        <div className="image-thumbnails">
          {iphone.images.map((img) => (
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
        <h2>{iphone.title}</h2>

        <div className="price-container">
          <p className="product-price">${totalPrice}</p>
          <button className="buy-button">Купить</button>
        </div>

        {iphone.colors.length > 1 && (
          <div className="product-colors">
            <h3>Цвета</h3>
            <div className="color-squares">
              {iphone.colors.map((color) => (
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
              value={selectedStorage || iphone.storages[0].size}
              onChange={(e) => setSelectedStorage(e.target.value)}
            >
              {iphone.storages.map((storage) => (
                <option key={storage.size} value={storage.size}>
                  {storage.size}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="product-description">
          {getDataOrFallback(iphone.display.size) && (
            <div className="description-block">
              <h3>Экран</h3>
              <p>
                {iphone.display.size} дюймов, {iphone.display.resolution}
              </p>
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
              <p>{iphone.camera.rearCameras.map((cam) => `${cam.resolution} (${cam.type})`).join(", ")}</p>
            </div>
          )}

          {getDataOrFallback(iphone.camera.zoomValues) && (
            <div className="description-block">
              <h3>Зум камер</h3>
              <p>{iphone.camera.zoomValues.join("x, ")}x</p>
            </div>
          )}

          {iphone.frontCamera && (
            <div className="description-block">
              <h3>Фронтальная камера</h3>
              <p>
                {iphone.frontCamera.resolution} ({iphone.frontCamera.aperture})
              </p>
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

          {getDataOrFallback(iphone.connectivities) && (
            <div className="description-block">
              <h3>Подключения</h3>
              <p>{iphone.connectivities.join(", ")}</p>
            </div>
          )}

          {getDataOrFallback(iphone.waterResistance) && (
            <div className="description-block">
              <h3>Водонепроницаемость</h3>
              <p>{iphone.waterResistance}</p>
            </div>
          )}

          {getDataOrFallback(iphone.dimensions) && (
            <div className="description-block">
              <h3>Размеры и вес</h3>
              <p>
                {iphone.dimensions.height} x {iphone.dimensions.width} x {iphone.dimensions.depth},{" "}
                {iphone.dimensions.weight}
              </p>
            </div>
          )}

          {getDataOrFallback(iphone.battery.chargingCapabilities) && (
            <div className="description-block">
              <h3>Зарядка</h3>
              <p>{iphone.battery.chargingCapabilities.join(", ")}</p>
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
