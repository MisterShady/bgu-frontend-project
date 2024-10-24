import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAirpodsById } from "../../Api";
import { AirpodsDto } from "../../types";
import { AxiosError } from "axios";
import { colorMapping } from "./colorMapping";
import LazyLoad from "react-lazyload";
import "./ProductDetails.css";

const AirpodsProduct = () => {
  const { id } = useParams<{ id: string }>();
  const [airpods, setAirpods] = useState<AirpodsDto | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  type DataType = string | string[] | { [key: string]: string } | null | undefined;

  const getDataOrFallback = (data: DataType) =>
    data && data !== "none" && (typeof data === "string" ? data.length > 0 : Object.keys(data).length > 0)
      ? data
      : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const airpodsData = await getAirpodsById(id);
          setAirpods(airpodsData);

          const defaultColor = airpodsData.colors[0];
          setSelectedColor(defaultColor);
          const firstImageForColor = getImagesByColor(airpodsData.images, defaultColor)[0];
          setSelectedImage(firstImageForColor || airpodsData.images[0]);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
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

  if (!airpods) {
    return <div>Загрузка...</div>;
  }

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const firstImageForColor = getImagesByColor(airpods.images, color)[0];
    setSelectedImage(firstImageForColor || airpods.images[0]);
  };

  return (
    <div className="product-details">
      <div className="product-images">
        <LazyLoad height={200} offset={100}>
          <img src={selectedImage || airpods.thumbUrl} alt={airpods.title} className="main-image" />
        </LazyLoad>
        <div className="image-thumbnails">
          {airpods.images.map((image, index) => (
            <LazyLoad key={image} height={50} offset={100}>
              <img
                src={image}
                alt={`AirPods Image ${index + 1}`}
                className={`thumbnail ${image === selectedImage ? "selected" : ""}`}
                onClick={() => setSelectedImage(image)}
              />
            </LazyLoad>
          ))}
        </div>
      </div>

      <div className="product-info">
        <h1 className="product-title">{airpods.title}</h1>

        <div className="price-container">
          <p className="product-price">${airpods.price}</p>
          <button className="buy-button">В корзину</button>
        </div>

        <div className="product-colors">
          <h3>Выберите цвет:</h3>
          <div className="color-squares">
            {airpods.colors.map((color) => (
              <div key={color} className="color-square-container">
                <div
                  className={`color-square ${selectedColor === color ? "selected" : ""}`}
                  style={{ backgroundColor: colorMapping[color] || "#fff4f4" }}
                  onClick={() => handleColorChange(color)}
                ></div>
                <div className="color-tooltip">
                  <LazyLoad height={100} offset={100}>
                    <img
                      src={getImagesByColor(airpods.images, color)[0] || airpods.thumbUrl}
                      alt={color}
                      style={{ width: "100px", height: "100px" }}
                    />
                  </LazyLoad>
                  <p>{color}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="product-description">
          {getDataOrFallback(airpods.audioFeatures) && (
            <div className="description-block">
              <h3>Аудио функции</h3>
              <p>{airpods.audioFeatures.join(", ")}</p>
            </div>
          )}

          {getDataOrFallback(airpods.mic) && (
            <div className="description-block">
              <h3>Микрофон</h3>
              <p>{airpods.mic}</p>
            </div>
          )}

          {getDataOrFallback(airpods.chip) && (
            <div className="description-block">
              <h3>Чип</h3>
              <p>{airpods.chip}</p>
            </div>
          )}

          {getDataOrFallback(airpods.controls) && (
            <div className="description-block">
              <h3>Управление</h3>
              <p>{airpods.controls.join(", ")}</p>
            </div>
          )}

          {getDataOrFallback(airpods.size) && (
            <div className="description-block">
              <h3>Размеры</h3>
              <p>
                Высота: {airpods.size.height}, Ширина: {airpods.size.width}, Глубина: {airpods.size.depth}, Вес:{" "}
                {airpods.size.weight}
              </p>
            </div>
          )}

          {getDataOrFallback(airpods.battery) && (
            <div className="description-block">
              <h3>Аккумулятор</h3>
              <p>{airpods.battery}</p>
            </div>
          )}

          {getDataOrFallback(airpods.connectivity) && (
            <div className="description-block">
              <h3>Подключение</h3>
              <p>{airpods.connectivity}</p>
            </div>
          )}

          {getDataOrFallback(airpods.resistance) && (
            <div className="description-block">
              <h3>Сопротивление</h3>
              <p>{airpods.resistance}</p>
            </div>
          )}

          {getDataOrFallback(airpods.sensors) && (
            <div className="description-block">
              <h3>Сенсоры</h3>
              <p>{airpods.sensors.join(", ")}</p>
            </div>
          )}

          {getDataOrFallback(airpods.packageEquipments) && (
            <div className="description-block">
              <h3>Комплектация</h3>
              <p>{airpods.packageEquipments.join(", ")}</p>
            </div>
          )}

          {getDataOrFallback(airpods.accessibilities) && (
            <div className="description-block">
              <h3>Возможности</h3>
              <p>{airpods.accessibilities.join(", ")}</p>
            </div>
          )}

          {getDataOrFallback(airpods.caseType) && (
            <div className="description-block">
              <h3>Тип кейса</h3>
              <p>{airpods.caseType}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AirpodsProduct;

const getImagesByColor = (images: string[], color: string): string[] => {
  const normalizedColor = color.replace(/\s+/g, "").toLowerCase();
  return images.filter((image) => image.toLowerCase().includes(normalizedColor));
};
