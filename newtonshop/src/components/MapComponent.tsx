import React, { Component } from "react";
import { YMaps, Map, Placemark, GeolocationControl, SearchControl } from "@pbe/react-yandex-maps";

interface MapComponentProps {
  onSelectAddress: (address: string) => void;
}

interface MapComponentState {
  coordinates: [number, number];
  address: string;
}

class MapComponent extends Component<MapComponentProps, MapComponentState> {
  constructor(props: MapComponentProps) {
    super(props);
    this.state = {
      coordinates: [55.751574, 37.573856], // Москва по умолчанию
      address: "",
    };
  }

  fetchAddress = async (coords: [number, number]) => {
    try {
      const response = await fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=6cf0e337-a000-4bfd-abd2-4e2784ddd12e&format=json&geocode=${coords[1]},${coords[0]}`
      );
      const data = await response.json();

      const geoObjects = data?.response?.GeoObjectCollection?.featureMember;

      if (geoObjects && geoObjects.length > 0) {
        const foundAddress = geoObjects[0]?.GeoObject?.metaDataProperty?.GeocoderMetaData?.text;

        if (foundAddress) {
          this.setState({ address: foundAddress });
          this.props.onSelectAddress(foundAddress);
        } else {
          this.setState({ address: "Адрес не найден" });
        }
      } else {
        this.setState({ address: "Адрес не найден" });
      }
    } catch (error) {
      console.error("Ошибка получения адреса:", error);
      this.setState({ address: "Не удалось определить адрес" });
    }
  };

  handleMapClick = async (e: ymaps.IEvent) => {
    const coords = e.get("coords");
    this.setState({ coordinates: coords });
    await this.fetchAddress(coords);
  };


  render() {
    const { coordinates } = this.state;

    return (
      <div style={{ width: "100%", marginTop: "20px" }}>
        <YMaps query={{ apikey: "6cf0e337-a000-4bfd-abd2-4e2784ddd12e" }}>
          <Map
            defaultState={{ center: [55.751574, 37.573856], zoom: 10 }}
            width="100%"
            height="400px"
            onClick={this.handleMapClick}
            state={{ center: coordinates, zoom: 15 }}
          >
            <Placemark geometry={coordinates} />
            {/* Контрол для геолокации */}
            <GeolocationControl
              options={{
                float: "left",
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
      </div>
    );
  }
}

export default MapComponent;
