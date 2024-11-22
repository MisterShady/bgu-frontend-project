import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  fetchIphoneById,
  setSelectedColor,
  setSelectedImage,
  setSelectedStorage,
} from "../slices/iphoneSlice";
import { AppDispatch, RootState } from "../../store";
import { CartItemRequestDto } from "../../types";
import "./ProductDetails.css";
import { colorMapping } from "./colorMapping";
import { getDataOrFallback } from "../../utils";
import Spinner from "../Spinner";
import ImageWrapper from "../handler/ImageWrapper";
import { addNotification } from "../slices/notificationSlice";

const IphoneProduct = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const {
    item: iphone,
    loading,
    error,
    selectedImage,
    selectedColor,
    selectedStorage,
    isAddingToCart,
  } = useSelector((state: RootState) => state.iphone);

  useEffect(() => {
    if (id) {
      dispatch(fetchIphoneById(id));
      dispatch(setSelectedImage(null));
      dispatch(setSelectedColor(null));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (iphone && iphone.images.length > 0) {
      const defaultColor = iphone.colors[0];
      const firstImageForColor = getImagesByColor(iphone.images, defaultColor)[0];
      dispatch(setSelectedColor(defaultColor));
      dispatch(setSelectedImage(firstImageForColor || iphone.images[0]));
      dispatch(setSelectedStorage(iphone.storages[0].size));
    } else {
      dispatch(setSelectedImage(null));
    }
  }, [iphone, dispatch]);

  if (loading || !iphone) {
    return <Spinner />;
  }

  if (error) {
    return <div>Ошибка загрузки данных: {error}</div>;
  }

  const selectedStoragePrice =
    iphone.storages.find((storage) => storage.size === selectedStorage)?.additionalPrice || 0;
  const totalPrice = iphone.price + selectedStoragePrice;

  const handleColorChange = (color: string) => {
    const firstImageForColor = getImagesByColor(iphone.images, color)[0];
    dispatch(setSelectedColor(color));
    dispatch(setSelectedImage(firstImageForColor || iphone.images[0]));
  };

  const handleAddToCart = async () => {
    if (iphone && !isAddingToCart) {
      const cartItem: CartItemRequestDto = {
        productId: iphone.id,
        config: `Color: ${selectedColor}, Storage: ${selectedStorage}`,
        imageUrl: selectedImage || "",
        price: totalPrice,
      };

      dispatch(addToCart(cartItem));
      dispatch(addNotification({ item: cartItem, operation: "add", id: Date.now() }));
    }
  };

  return (
    <div className="product-details">
      <div className="product-images">
        {selectedImage ? (
          <ImageWrapper src={selectedImage} alt={iphone.title} className="main-image" />
        ) : (
          <ImageWrapper src={""} alt="No image available" className="main-image" />
        )}
        <div className="image-thumbnails">
          {iphone.images.length > 0 &&
            iphone.images.map((image, index) => (
              <img
                key={image}
                src={image}
                alt={`iPhone Image ${index + 1}`}
                className={`thumbnail ${image === selectedImage ? "selected" : ""}`}
                onClick={() => dispatch(setSelectedImage(image))}
              />
            ))}
        </div>
      </div>

      <div className="product-info">
        <h2>{iphone.title}</h2>

        <div className="price-container">
          <p className="product-price">${totalPrice}</p>
          <button className="buy-button" onClick={handleAddToCart}>
            В корзину
          </button>
        </div>

        {iphone.colors.length > 1 && (
          <div className="product-colors">
            <h3>Выберите цвет</h3>
            <div className="color-squares">
              {iphone.colors.map((color) => (
                <div key={color} className="color-square-container">
                  <div
                    className={`color-square ${selectedColor === color ? "selected" : ""}`}
                    onClick={() => handleColorChange(color)}
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
              onChange={(e) => dispatch(setSelectedStorage(e.target.value))}
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

const getImagesByColor = (images: string[], color: string): string[] => {
  const normalizedColor = color.replace(/\s+/g, "").toLowerCase();
  return images.filter((image) => image.toLowerCase().includes(normalizedColor));
};
