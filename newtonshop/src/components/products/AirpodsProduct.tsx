import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAirpodsById, postCartItem } from "../../Api";
import { AirpodsDto, CartItemRequestDto } from "../../types";
import { colorMapping } from "./colorMapping";
import "./ProductDetails.css";
import { useFetch } from "../hooks/useFetch";
import { getDataOrFallback } from "../../utils";
import Spinner from "../Spinner";
import ImageWrapper from "../handler/ImageWrapper";
import Notification from "../Notification";

const AirpodsProduct = () => {
  const { id } = useParams<{ id: string }>();
  const { data: airpods, error, loading } = useFetch<AirpodsDto>(() => getAirpodsById(id!));
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<{ id: number; item: CartItemRequestDto }[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (airpods && selectedColor === null && !selectedImage) {
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

  const handleAddToCart = async () => {
    if (airpods && !isAddingToCart) {
      setIsAddingToCart(true);
      const cartItem: CartItemRequestDto = {
        productId: airpods.id,
        config: `Color: ${selectedColor}`,
        imageUrl: selectedImage || airpods.images[0],
        price: airpods.price,
      };

      try {
        await postCartItem(cartItem);
        setNotifications((prevNotifications) => [...prevNotifications, { id: Date.now(), item: cartItem }]);
      } catch (error) {
        console.error("Ошибка при добавлении товара в корзину:", error);
      } finally {
        setIsAddingToCart(false);
      }
    }
  };

  const handleNotificationComplete = (id: number) => {
    setNotifications((prevNotifications) => prevNotifications.filter((notification) => notification.id !== id));
  };

  const handleNotificationCancel = (id: number) => {
    setNotifications((prevNotifications) => prevNotifications.filter((notification) => notification.id !== id));
  };

  return (
    <div className="product-details">
      <div className="product-images">
        <ImageWrapper src={selectedImage || airpods.images[0]} alt={airpods.title} className="main-image" />
        <div className="image-thumbnails">
          {airpods.images.map((image, index) => (
            <img
              key={image}
              src={image}
              alt={`AirPods Image ${index + 1}`}
              className={`thumbnail ${image === selectedImage ? "selected" : ""}`}
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </div>
      </div>

      <div className="product-info">
        <h1 className="product-title">{airpods.title}</h1>

        <div className="price-container">
          <p className="product-price">${airpods.price}</p>
          <button className="buy-button" onClick={handleAddToCart}>
            В корзину
          </button>
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
                  <img
                    src={getImagesByColor(airpods.images, color)[0]}
                    alt={color}
                    style={{ width: "100px", height: "100px" }}
                  />
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

      {notifications.map((notification, index) => (
        <Notification
          key={notification.id}
          item={notification.item}
          onCancel={() => handleNotificationCancel(notification.id)}
          onComplete={() => handleNotificationComplete(notification.id)}
          index={index}
          operation="add"
        />
      ))}
    </div>
  );
};

export default AirpodsProduct;

const getImagesByColor = (images: string[], color: string): string[] => {
  const normalizedColor = color.replace(/\s+/g, "").toLowerCase();
  return images.filter((image) => image.toLowerCase().includes(normalizedColor));
};
