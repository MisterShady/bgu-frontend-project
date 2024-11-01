import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAirpodsById } from "../../Api";
import { AirpodsDto } from "../../types";
import { colorMapping } from "./colorMapping";
import LazyLoad from "react-lazyload";
import "./ProductDetails.css";
import { useFetch } from "../hooks/useFetch";
import { getDataOrFallback } from "../../utils";
import Spinner from "../Spinner";

const AirpodsProduct = () => {
  const { id } = useParams<{ id: string }>();
  const { data: airpods, error, loading } = useFetch<AirpodsDto>(() => getAirpodsById(id!));
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  useEffect(() => {
    if (airpods && !selectedImage) {
      const defaultColor = airpods.colors[0];
      setSelectedColor(defaultColor);
      const firstImageForColor = getImagesByColor(airpods.images, defaultColor)[0];
      setSelectedImage(firstImageForColor || airpods.images[0]);
    }
  }, [airpods]);

  if (loading || !airpods) {
    return <Spinner />;
  }

  if (error) {
    return <div>Ошибка загрузки данных: {error}</div>;
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
          {getDataOrFallback(airpods, "audioFeatures", []).length > 0 && (
            <div className="description-block">
              <h3>Audio Features</h3>
              <p>{airpods.audioFeatures.join(", ")}</p>
            </div>
          )}

          {getDataOrFallback(airpods, "mic", "").length > 0 && (
            <div className="description-block">
              <h3>Microphone</h3>
              <p>{airpods.mic}</p>
            </div>
          )}

          {getDataOrFallback(airpods, "chip", "").length > 0 && (
            <div className="description-block">
              <h3>Chip</h3>
              <p>{airpods.chip}</p>
            </div>
          )}

          {getDataOrFallback(airpods, "controls", []).length > 0 && (
            <div className="description-block">
              <h3>Controls</h3>
              <p>{airpods.controls.join(", ")}</p>
            </div>
          )}

          {airpods.size && (
            <div className="description-block">
              <h3>Size</h3>
              <p>
                Height: {airpods.size.height}, Width: {airpods.size.width}, Depth: {airpods.size.depth}, Weight:{" "}
                {airpods.size.weight}
              </p>
            </div>
          )}

          {getDataOrFallback(airpods, "battery", "").length > 0 && (
            <div className="description-block">
              <h3>Battery</h3>
              <p>{airpods.battery}</p>
            </div>
          )}

          {getDataOrFallback(airpods, "connectivity", "").length > 0 && (
            <div className="description-block">
              <h3>Connectivity</h3>
              <p>{airpods.connectivity}</p>
            </div>
          )}

          {getDataOrFallback(airpods, "resistance", "").length > 0 && (
            <div className="description-block">
              <h3>Resistance</h3>
              <p>{airpods.resistance}</p>
            </div>
          )}

          {getDataOrFallback(airpods, "sensors", []).length > 0 && (
            <div className="description-block">
              <h3>Sensors</h3>
              <p>{airpods.sensors.join(", ")}</p>
            </div>
          )}

          {getDataOrFallback(airpods, "packageEquipments", []).length > 0 && (
            <div className="description-block">
              <h3>Package Equipments</h3>
              <p>{airpods.packageEquipments.join(", ")}</p>
            </div>
          )}

          {getDataOrFallback(airpods, "accessibilities", []).length > 0 && (
            <div className="description-block">
              <h3>Accessibilities</h3>
              <p>{airpods.accessibilities.join(", ")}</p>
            </div>
          )}

          {getDataOrFallback(airpods, "caseType", "").length > 0 && (
            <div className="description-block">
              <h3>Case Type</h3>
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
