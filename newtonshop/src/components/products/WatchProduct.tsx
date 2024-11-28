import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  fetchWatchById,
  setSelectedBandStyleIndex,
  setSelectedBandTypeIndex,
  setSelectedCaseIndex,
  setSelectedImage,
  setSelectedSizeIndex,
  setSelectedVersionIndex,
} from "../slices/watchSlice";
import { AppDispatch, RootState } from "../../store";
import { CartItemRequestDto } from "../../types";
import "./ProductDetails.css";
import { getDataOrFallback } from "../../utils";
import Spinner from "../Spinner";
import ImageWrapper from "../handler/ImageWrapper";
import { addNotification } from "../slices/notificationSlice";

const WatchProduct = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const {
    item: watch,
    loading,
    error,
    selectedImage,
    selectedBandTypeIndex,
    selectedBandStyleIndex,
    selectedCaseIndex,
    selectedVersionIndex,
    selectedSizeIndex,
    isAddingToCart,
  } = useSelector((state: RootState) => state.watch);

  useEffect(() => {
    if (id) {
      dispatch(fetchWatchById(id));
      dispatch(setSelectedImage(null));
      dispatch(setSelectedBandTypeIndex(null));
      dispatch(setSelectedBandStyleIndex(null));
      dispatch(setSelectedCaseIndex(null));
      dispatch(setSelectedVersionIndex(null));
      dispatch(setSelectedSizeIndex(null));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (watch && watch.images.length > 0) {
      const defaultBandTypeIndex = 0;
      const defaultBandStyleIndex = 0;
      const defaultCaseIndex = 0;
      const defaultVersionIndex = 0;
      const defaultSizeIndex = 0;

      const firstImageForBandStyle = getImagesByBandStyle(
        watch.bandTypes[defaultBandTypeIndex].styles[defaultBandStyleIndex]
      );
      dispatch(setSelectedBandTypeIndex(defaultBandTypeIndex));
      dispatch(setSelectedBandStyleIndex(defaultBandStyleIndex));
      dispatch(setSelectedCaseIndex(defaultCaseIndex));
      dispatch(setSelectedVersionIndex(defaultVersionIndex));
      dispatch(setSelectedSizeIndex(defaultSizeIndex));
      dispatch(setSelectedImage(firstImageForBandStyle || watch.images[0]));
    } else {
      dispatch(setSelectedImage(null));
    }
  }, [watch, dispatch]);

  if (error) {
    return <div>Ошибка загрузки данных: {error}</div>;
  }

  if (!watch || loading) {
    return <Spinner />;
  }

  const selectedBandType = watch.bandTypes[selectedBandTypeIndex || 0];
  const selectedBandStyle = selectedBandType?.styles[selectedBandStyleIndex || 0];
  const selectedBandTypePrice = selectedBandStyle?.additionalPrice || 0;

  const selectedCasePrice = watch.caseTypes[selectedCaseIndex || 0]?.additionalPrice || 0;
  const selectedVersionPrice = watch.versions[selectedVersionIndex || 0]?.additionalPrice || 0;

  const selectedSizePrice =
    selectedSizeIndex === 0
      ? watch.size.large.additionalPrice
      : typeof watch.size.small === "object" && watch.size.small !== null
        ? watch.size.small.additionalPrice
        : 0;

  const totalPrice = watch.price + selectedBandTypePrice + selectedCasePrice + selectedVersionPrice + selectedSizePrice;

  const handleBandTypeChange = (index: number) => {
    const firstImageForBandStyle = getImagesByBandStyle(watch.bandTypes[index].styles[0]);
    dispatch(setSelectedBandTypeIndex(index));
    dispatch(setSelectedBandStyleIndex(0));
    dispatch(setSelectedImage(firstImageForBandStyle || watch.images[0]));
  };

  const handleBandStyleChange = (index: number) => {
    const firstImageForBandStyle = getImagesByBandStyle(watch.bandTypes[selectedBandTypeIndex || 0].styles[index]);
    dispatch(setSelectedBandStyleIndex(index));
    dispatch(setSelectedImage(firstImageForBandStyle || watch.images[0]));
  };

  const handleAddToCart = async () => {
    if (watch && !isAddingToCart) {
      const cartItem: CartItemRequestDto = {
        productId: watch.id,
        config: `Band Type: ${selectedBandType?.material}, Band Style: ${selectedBandStyle?.name},
        Case: ${watch.caseTypes[selectedCaseIndex || 0].material},
        Version: ${watch.versions[selectedVersionIndex || 0].type},
        Size: ${
  selectedSizeIndex === 0
    ? watch.size.large.name
    : typeof watch.size.small === "object" && watch.size.small !== null
      ? watch.size.small.name
      : watch.size.small
}`,
        imageUrl: selectedImage || watch.images[0],
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
          <ImageWrapper src={selectedImage} alt={watch.title} className="main-image" />
        ) : (
          <ImageWrapper src="" alt="No image available" className="main-image" />
        )}
        <div className="image-thumbnails">
          {watch.images.length > 0 &&
            watch.images.map((image, index) => (
              <img
                key={image}
                src={image}
                alt={`Watch Image ${index + 1}`}
                className={`thumbnail ${image === selectedImage ? "selected" : ""}`}
                onClick={() => dispatch(setSelectedImage(image))}
              />
            ))}
        </div>
      </div>

      <div className="product-info">
        <h1>{watch.title}</h1>
        <div className="price-container">
          <p className="product-price">${totalPrice}</p>
          <button className="buy-button" onClick={handleAddToCart}>
            В корзину
          </button>
        </div>

        <div className="product-configuration">
          <h3>Выбор конфигурации</h3>

          {watch.bandTypes && (
            <div className="config-option">
              <h4>Тип ремешка</h4>
              <select onChange={(e) => handleBandTypeChange(Number(e.target.value))}>
                {watch.bandTypes.map((bandType, index) => (
                  <option key={bandType.material} value={index}>
                    {bandType.material} ({bandType.description})
                  </option>
                ))}
              </select>
              {selectedBandTypeIndex !== null && watch.bandTypes[selectedBandTypeIndex] && (
                <select onChange={(e) => handleBandStyleChange(Number(e.target.value))}>
                  {watch.bandTypes[selectedBandTypeIndex].styles.map((style, index) => (
                    <option key={style.name} value={index}>
                      {style.name} ({style.description})
                      {style.additionalPrice > 0 && ` (Дополнительно: $${style.additionalPrice})`}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {watch.caseTypes && (
            <div className="config-option">
              <h4>Материал корпуса</h4>
              <select onChange={(e) => dispatch(setSelectedCaseIndex(Number(e.target.value)))}>
                {watch.caseTypes.map((caseType, index) => (
                  <option key={caseType.material} value={index}>
                    {caseType.material} ({caseType.description})
                    {caseType.additionalPrice > 0 && ` (Дополнительно: $${caseType.additionalPrice})`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {watch.versions && (
            <div className="config-option">
              <h4>Версия</h4>
              <select onChange={(e) => dispatch(setSelectedVersionIndex(Number(e.target.value)))}>
                {watch.versions.map((version, index) => (
                  <option key={version.type} value={index}>
                    {version.type} ({version.description})
                    {version.additionalPrice > 0 && ` (Дополнительно: $${version.additionalPrice})`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {watch.size && (
            <div className="config-option">
              <h4>Размер</h4>
              <select onChange={(e) => dispatch(setSelectedSizeIndex(Number(e.target.value)))}>
                <option value={0}>
                  {watch.size.large.name}
                  {watch.size.large.additionalPrice > 0 && ` (Дополнительно: $${watch.size.large.additionalPrice})`}
                </option>
                {typeof watch.size.small === "object" && watch.size.small !== null && (
                  <option value={1}>
                    {watch.size.small.name}
                    {watch.size.small.additionalPrice > 0 && ` (Дополнительно: $${watch.size.small.additionalPrice})`}
                  </option>
                )}
                {typeof watch.size.small === "string" && <option value={1}>{watch.size.small}</option>}
              </select>
            </div>
          )}
        </div>

        <div className="product-description">
          <div className="description-block">
            <h3>Экран</h3>
            <p>Тип: {getDataOrFallback(watch.display, "type", "")}</p>
            <p>Яркость: {getDataOrFallback(watch.display, "brightness", "")} нитов</p>
          </div>

          <div className="description-block">
            <h3>Процессор</h3>
            <p>Модель: {getDataOrFallback(watch.chipset, "cpu", "")}</p>
          </div>

          <div className="description-block">
            <h3>Аккумулятор</h3>
            <p>Время работы: {getDataOrFallback(watch.battery, "lifetime", "")}</p>
          </div>

          {watch.caseTypes && watch.caseTypes[0]?.material && (
            <div className="description-block">
              <h3>Материал корпуса</h3>
              <p>{watch.caseTypes[0].material}</p>
            </div>
          )}

          <div className="description-block">
            <h3>Водонепроницаемость и пылезащита</h3>
            <p>Водонепроницаемость: {getDataOrFallback(watch.resistance, "water", "")}</p>
            <p>Пылезащита: {getDataOrFallback(watch.resistance, "dust", "")}</p>
          </div>

          <div className="description-block">
            <h3>Связь</h3>
            <p>Wi-Fi: {getDataOrFallback(watch.connectivity, "wifi", "")}</p>
            <p>Bluetooth: {getDataOrFallback(watch.connectivity, "bluetooth", 0)}</p>
            <p>Чип ультраширокополосной связи: {getDataOrFallback(watch.connectivity, "ultraWideBand", "")}</p>
          </div>

          {watch.sensors && (
            <div className="description-block">
              <h3>Датчики</h3>
              {watch.sensors.map((sensor) => (
                <p key={sensor.name}>
                  {sensor.name}: {sensor.spec}
                </p>
              ))}
            </div>
          )}

          {watch.dimensions && (
            <div className="description-block">
              <h3>Размеры и вес</h3>
              <p>
                Размеры: {watch.dimensions[0].height} x {watch.dimensions[0].width} x {watch.dimensions[0].depth}
              </p>
              <p>Вес: {watch.dimensions[0].weight} г</p>
            </div>
          )}

          <div className="description-block">
            <h3>Операционная система</h3>
            <p>{getDataOrFallback(watch, "operatingSystem", "")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchProduct;

const getImagesByBandStyle = (bandStyle: { image: string }): string | null => {
  return bandStyle.image || null;
};
