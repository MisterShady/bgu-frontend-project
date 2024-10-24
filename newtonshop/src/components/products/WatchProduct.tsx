import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getWatchById } from "../../Api";
import { WatchDto } from "../../types";
import "./ProductDetails.css";
import { AxiosError } from "axios";
import LazyLoad from 'react-lazyload';

const WatchProduct = () => {
  const { id } = useParams<{ id: string }>();
  const [watch, setWatch] = useState<WatchDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedBandTypeIndex, setSelectedBandTypeIndex] = useState<number | null>(null);
  const [selectedBandStyleIndex, setSelectedBandStyleIndex] = useState<number | null>(null);
  const [selectedCaseIndex, setSelectedCaseIndex] = useState<number | null>(null);
  const [selectedVersionIndex, setSelectedVersionIndex] = useState<number | null>(null);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number | null>(null);

  const getDataOrFallback = (data: string | number | (string | number)[] | null): string | number | (string | number)[] | null =>
    data && (Array.isArray(data) ? data.length > 0 : true) ? data : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const watchData = await getWatchById(id);
          setWatch(watchData);
          setSelectedImage(watchData.thumbUrl);

          if (watchData.bandTypes?.length > 0) {
            setSelectedBandTypeIndex(0);
            setSelectedBandStyleIndex(0);
          }
          if (watchData.caseTypes?.length > 0) {
            setSelectedCaseIndex(0);
          }
          if (watchData.versions?.length > 0) {
            setSelectedVersionIndex(0);
          }
          if (watchData.size) {
            setSelectedSizeIndex(0);
          }
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

  useEffect(() => {
    if (watch && selectedBandTypeIndex !== null && selectedBandStyleIndex !== null) {
      const currentBandType = watch.bandTypes[selectedBandTypeIndex];
      const currentBandStyle = currentBandType?.styles[selectedBandStyleIndex];
      if (currentBandStyle) {
        setSelectedImage(currentBandStyle.image);
      }
    }
  }, [watch, selectedBandTypeIndex, selectedBandStyleIndex]);

  if (error) {
    return <div>Ошибка загрузки данных: {error}</div>;
  }

  if (!watch) {
    return <div>Загрузка...</div>;
  }

  const selectedBandType = watch.bandTypes[selectedBandTypeIndex || 0];
  const selectedBandStyle = selectedBandType?.styles[selectedBandStyleIndex || 0];
  const selectedBandTypePrice = selectedBandStyle?.additionalPrice || 0;

  const selectedCasePrice = watch.caseTypes[selectedCaseIndex || 0]?.additionalPrice || 0;
  const selectedVersionPrice = watch.versions[selectedVersionIndex || 0]?.additionalPrice || 0;

  const selectedSizePrice = selectedSizeIndex === 0
    ? watch.size.large.additionalPrice
    : (typeof watch.size.small === "object" && watch.size.small !== null
      ? watch.size.small.additionalPrice
      : 0);

  const totalPrice = watch.price + selectedBandTypePrice + selectedCasePrice + selectedVersionPrice + selectedSizePrice;

  return (
    <div className="product-details">
      <div className="product-images">
        <LazyLoad>
          <img src={selectedImage || watch.thumbUrl} alt={watch.title} className="main-image" />
        </LazyLoad>
        <div className="image-thumbnails">
          {watch.images.map((img) => (
            <LazyLoad key={img}>
              <img
                src={img}
                alt={"Image"}
                className={`thumbnail ${img === selectedImage ? "selected" : ""}`}
                onClick={() => setSelectedImage(img)}
              />
            </LazyLoad>
          ))}
        </div>
      </div>

      <div className="product-info">
        <h1>{watch.title}</h1>
        <div className="price-container">
          <p className="product-price">${totalPrice}</p>
          <button className="buy-button">В корзину</button>
        </div>

        <div className="product-configuration">
          <h3>Выбор конфигурации</h3>

          {watch.bandTypes && (
            <div className="config-option">
              <h4>Тип ремешка</h4>
              <select onChange={(e) => setSelectedBandTypeIndex(Number(e.target.value))}>
                {watch.bandTypes.map((bandType) => (
                  <option key={bandType.material} value={watch.bandTypes.indexOf(bandType)}>
                    {bandType.material} ({bandType.description})
                  </option>
                ))}
              </select>
              {selectedBandTypeIndex !== null && watch.bandTypes[selectedBandTypeIndex] && (
                <select onChange={(e) => setSelectedBandStyleIndex(Number(e.target.value))}>
                  {watch.bandTypes[selectedBandTypeIndex].styles.map((style) => (
                    <option key={style.name} value={watch.bandTypes[selectedBandTypeIndex].styles.indexOf(style)}>
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
              <select onChange={(e) => setSelectedCaseIndex(Number(e.target.value))}>
                {watch.caseTypes.map((caseType) => (
                  <option key={caseType.material} value={watch.caseTypes.indexOf(caseType)}>
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
              <select onChange={(e) => setSelectedVersionIndex(Number(e.target.value))}>
                {watch.versions.map((version) => (
                  <option key={version.type} value={watch.versions.indexOf(version)}>
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
              <select onChange={(e) => setSelectedSizeIndex(Number(e.target.value))}>
                <option value={0}>
                  {watch.size.large.name}
                  {watch.size.large.additionalPrice > 0 && ` (Дополнительно: $${watch.size.large.additionalPrice})`}
                </option>
                {watch.size.small && typeof watch.size.small !== "string" && (
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
          {getDataOrFallback(watch.display.type) && (
            <div className="description-block">
              <h3>Экран</h3>
              <p>Тип: {watch.display.type}</p>
              <p>Яркость: {watch.display.brightness} нитов</p>
            </div>
          )}

          {getDataOrFallback(watch.chipset.cpu) && (
            <div className="description-block">
              <h3>Процессор</h3>
              <p>Модель: {watch.chipset.cpu}</p>
            </div>
          )}

          {getDataOrFallback(watch.battery.lifetime) && (
            <div className="description-block">
              <h3>Аккумулятор</h3>
              <p>Время работы: {watch.battery.lifetime}</p>
            </div>
          )}

          {(watch.caseTypes) && watch.caseTypes[0]?.material && (
            <div className="description-block">
              <h3>Материал корпуса</h3>
              <p>{watch.caseTypes[0].material}</p>
            </div>
          )}

          {getDataOrFallback(watch.resistance?.water) && (
            <div className="description-block">
              <h3>Водонепроницаемость и пылезащита</h3>
              <p>Водонепроницаемость: {watch.resistance.water}</p>
              <p>Пылезащита: {watch.resistance.dust}</p>
            </div>
          )}

          {getDataOrFallback(watch.connectivity?.wifi) && (
            <div className="description-block">
              <h3>Связь</h3>
              <p>Wi-Fi: {watch.connectivity.wifi}</p>
              <p>Bluetooth: {watch.connectivity.bluetooth}</p>
              <p>Чип ультраширокополосной связи: {watch.connectivity.ultraWideBand}</p>
            </div>
          )}

          {(watch.sensors) && (
            <div className="description-block">
              <h3>Датчики</h3>
              {watch.sensors.map((sensor) => (
                <p key={sensor.name}>
                  {sensor.name}: {sensor.spec}
                </p>
              ))}
            </div>
          )}

          {(watch.dimensions) && (
            <div className="description-block">
              <h3>Размеры и вес</h3>
              <p>
                Размеры: {watch.dimensions[0].height} x {watch.dimensions[0].width} x {watch.dimensions[0].depth}
              </p>
              <p>Вес: {watch.dimensions[0].weight} г</p>
            </div>
          )}

          {getDataOrFallback(watch.operatingSystem) && (
            <div className="description-block">
              <h3>Операционная система</h3>
              <p>{watch.operatingSystem}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchProduct;
