import React, { useRef, useState } from "react";
import { GeolocationControl, Map, Placemark, SearchControl, YMaps } from "@pbe/react-yandex-maps";

interface MapComponentProps {
  onSelectAddress: (address: string) => void;
}

const MapComponent = ({ onSelectAddress }: MapComponentProps) => {
  const [coordinates, setCoordinates] = useState<[number, number]>([55.751574, 37.573856]); // Москва
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const addressCache = useRef<globalThis.Map<string, string>>(new globalThis.Map());

  const fetchAddress = async (coords: [number, number]) => {
    const key = coords.join(",");
    if (addressCache.current.has(key)) {
      setAddress(addressCache.current.get(key)!);
      setLoading(false);
      return;
    }

    setLoading(true);
    const response = await fetch(
      `https://geocode-maps.yandex.ru/1.x/?apikey=6cf0e337-a000-4bfd-abd2-4e2784ddd12e&format=json&geocode=${coords[1]},${coords[0]}`
    );
    const data = await response.json();
    const geoObjects = data?.response?.GeoObjectCollection?.featureMember;
    const foundAddress = geoObjects?.[0]?.GeoObject?.metaDataProperty?.GeocoderMetaData?.text;

    setAddress(foundAddress || "Адрес не найден");
    setLoading(false);

    if (foundAddress) {
      addressCache.current.set(key, foundAddress);
      onSelectAddress(foundAddress);
    }
  };

  const handleMapClick = (e: ymaps.IEvent) => {
    const coords = e.get("coords");
    setCoordinates(coords);
    fetchAddress(coords);
  };

  const handleGeolocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
      setCoordinates(coords);
      await fetchAddress(coords);
    });
  };

  return (
    <div style={{ width: "100%", marginTop: "20px" }}>
      {loading && <div>Определяем адрес...</div>}
      <YMaps query={{ apikey: "6cf0e337-a000-4bfd-abd2-4e2784ddd12e" }}>
        <Map
          defaultState={{ center: [55.751574, 37.573856], zoom: 10 }}
          width="100%"
          height="400px"
          onClick={handleMapClick}
          state={{ center: coordinates, zoom: 15 }}
        >
          <Placemark geometry={coordinates} />
          <GeolocationControl
            options={{ float: "left" }}
            instanceRef={(ref) => {
              if (ref) {
                ref.events.add("locationchange", handleGeolocation);
              }
            }}
          />
          <SearchControl
            options={{
              float: "right",
              noPlacemark: true,
              placeholderContent: "Введите адрес",
            }}
          />
        </Map>
      </YMaps>
      <div>
        <strong>Адрес:</strong> {address}
      </div>
    </div>
  );
};

export default MapComponent;
