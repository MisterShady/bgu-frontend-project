import axios from "axios";
import { AirpodsDto, IpadDto, IphoneDto, MacDto, WatchDto } from "./types";

const BASE_URL = "http://localhost:9000/api/v1";

export interface ProductDto {
  id: string;
  title: string;
  thumbUrl: string;
  price: number;
  images: string[];
  type: string;
}

export const getPopularProducts = async (page = 0, size = 0): Promise<ProductDto[]> => {
  const response = await axios.get<ProductDto[]>(`${BASE_URL}/products/catalog-pages`, {
    params: {
      page,
      size,
      sort: "title,Asc",
    },
  });
  return response.data;
};

export const searchProducts = async (name: string, page = 0, size = 0): Promise<ProductDto[]> => {
  const response = await axios.get<ProductDto[]>(`${BASE_URL}/products/search`, {
    params: {
      name,
      page,
      size,
      sort: "title,ASC",
    },
  });
  return response.data;
};

export const getAirpods = async (): Promise<AirpodsDto[]> => {
  const response = await axios.get<AirpodsDto[]>(`${BASE_URL}/products/airpods`);
  return response.data;
};

export const getWatches = async (): Promise<WatchDto[]> => {
  const response = await axios.get<WatchDto[]>(`${BASE_URL}/products/watches`);
  return response.data;
};

export const getIpads = async (): Promise<IpadDto[]> => {
  const response = await axios.get<IpadDto[]>(`${BASE_URL}/products/ipads`);
  return response.data;
};

export const getIphones = async (): Promise<IphoneDto[]> => {
  const response = await axios.get<IphoneDto[]>(`${BASE_URL}/products/iphones`);
  return response.data;
};

export const getMacs = async (): Promise<MacDto[]> => {
  const response = await axios.get<MacDto[]>(`${BASE_URL}/products/macs`);
  return response.data;
};

export const getAirpodsById = async (id: string): Promise<AirpodsDto> => {
  const response = await axios.get<AirpodsDto>(`${BASE_URL}/products/airpods/${id}`);
  return response.data;
};

export const getIphoneById = async (id: string): Promise<IphoneDto> => {
  const response = await axios.get<IphoneDto>(`${BASE_URL}/products/iphones/${id}`);
  return response.data;
};

export const getIpadById = async (id: string): Promise<IpadDto> => {
  const response = await axios.get<IpadDto>(`${BASE_URL}/products/ipads/${id}`);
  return response.data;
};

export const getWatchById = async (id: string): Promise<WatchDto> => {
  const response = await axios.get<WatchDto>(`${BASE_URL}/products/watches/${id}`);
  return response.data;
};
export const getMacById = async (id: string): Promise<MacDto> => {
  const response = await axios.get<MacDto>(`${BASE_URL}/products/macs/${id}`);
  return response.data;
};
