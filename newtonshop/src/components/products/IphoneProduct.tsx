import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getIphoneById } from "../../Api";
import { IphoneDto } from "../../types";
import "./ProductDetails.css";
import { colorMapping } from "./colorMapping";
import LazyLoad from "react-lazyload";
import { useFetch } from "../hooks/useFetch";
import { getDataOrFallback } from "../../utils";

const IphoneProduct = () => {
  const { id } = useParams<{ id: string }>();
  const { data: iphone, error, loading } = useFetch<IphoneDto>(() => getIphoneById(id!));
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);

  useEffect(() => {
    if (iphone && !selectedImage) {
      const defaultColor = iphone.colors[0];
      setSelectedColor(defaultColor);
      setSelectedImage(iphone.images[0]);
      setSelectedStorage(iphone.storages[0].size);
    }
  }, [iphone]);

  if (loading || !iphone) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка загрузки данных: {error}</div>;
  }

  const selectedStoragePrice =
    iphone.storages.find((storage) => storage.size === selectedStorage)?.additionalPrice || 0;
  const totalPrice = iphone.price + selectedStoragePrice;

  return (
    <div className="product-details">
      <div className="product-images">
        <LazyLoad>
          <img
            src={selectedImage || getDataOrFallback(iphone, "thumbUrl", "default-image-url")}
            alt={iphone.title}
            className="main-image"
          />
        </LazyLoad>
        {getDataOrFallback(iphone, "images", []).length > 0 && (
          <div className="image-thumbnails">
            {iphone.images.map((image, index) => (
              <LazyLoad key={image} height={50} offset={100}>
                <img
                  src={image}
                  alt={`IPhone Image ${index + 1}`}
                  className={`thumbnail ${image === selectedImage ? "selected" : ""}`}
                  onClick={() => setSelectedImage(image)}
                />
              </LazyLoad>
            ))}
          </div>
        )}
      </div>

      <div className="product-info">
        <h2>{iphone.title}</h2>

        <div className="price-container">
          <p className="product-price">${totalPrice}</p>
          <button className="buy-button">В корзину</button>
        </div>

        {iphone.colors.length > 1 && (
          <div className="product-colors">
            <h3>Выберите цвет</h3>
            <div className="color-squares">
              {iphone.colors.map((color) => (
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
          <div className="description-block">
            <h3>Экран</h3>
            <p>
              {getDataOrFallback(iphone.display, "size", "")}, {getDataOrFallback(iphone.display, "resolution", "")}
            </p>
          </div>

          <div className="description-block">
            <h3>Процессор</h3>
            <p>{getDataOrFallback(iphone.processor, "chip", "")}</p>
          </div>

          {iphone.camera.rearCameras && iphone.camera.rearCameras.length > 0 && (
            <div className="description-block">
              <h3>Камеры</h3>
              <p>{iphone.camera.rearCameras.map((cam) => `${cam.resolution} (${cam.type})`).join(", ")}</p>
            </div>
          )}

          <div className="description-block">
            <h3>Зум камер</h3>
            <p>{getDataOrFallback(iphone.camera, "zoomValues", []).join("x, ")}x</p>
          </div>

          {iphone.frontCamera && (
            <div className="description-block">
              <h3>Фронтальная камера</h3>
              <p>
                {getDataOrFallback(iphone.frontCamera, "resolution", "")} (
                {getDataOrFallback(iphone.frontCamera, "aperture", "")})
              </p>
            </div>
          )}

          <div className="description-block">
            <h3>Аккумулятор</h3>
            <p>{getDataOrFallback(iphone.battery, "capacity", "")}</p>
          </div>

          <div className="description-block">
            <h3>Память</h3>
            <p>{getDataOrFallback(iphone, "memory", "")} GB</p>
          </div>

          <div className="description-block">
            <h3>Подключения</h3>
            <p>{getDataOrFallback(iphone, "connectivities", []).join(", ")}</p>
          </div>

          <div className="description-block">
            <h3>Водонепроницаемость</h3>
            <p>{getDataOrFallback(iphone, "waterResistance", "")}</p>
          </div>

          {iphone.dimensions && (
            <div className="description-block">
              <h3>Размеры и вес</h3>
              <p>
                {getDataOrFallback(iphone.dimensions, "height", "")} x{" "}
                {getDataOrFallback(iphone.dimensions, "width", "")} x{" "}
                {getDataOrFallback(iphone.dimensions, "depth", "")},{" "}
                {getDataOrFallback(iphone.dimensions, "weight", "")}
              </p>
            </div>
          )}

          <div className="description-block">
            <h3>Зарядка</h3>
            <p>{getDataOrFallback(iphone.battery, "chargingCapabilities", []).join(", ")}</p>
          </div>

          <div className="description-block">
            <h3>Операционная система</h3>
            <p>{getDataOrFallback(iphone, "operatingSystem", "")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IphoneProduct;
