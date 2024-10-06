import axios from 'axios';
import {AirpodsDto, IpadDto, IphoneDto, WatchDto} from './types';

const BASE_URL = 'http://localhost:9000/api/v1';

// Функция для получения списка всех продуктов
export interface ProductDto {
    id: string;
    title: string;
    type: string;
}

export const getAllProducts = async (): Promise<ProductDto[]> => {
    const response = await axios.get<ProductDto[]>(`${BASE_URL}/products`);
    return response.data;
};

// Существующие API-запросы для категорий
export const getAirpods = async (): Promise<AirpodsDto[]> => {
    const response = await axios.get<AirpodsDto[]>(`${BASE_URL}/categories/airpods`);
    return response.data;
};

export const getWatches = async (): Promise<WatchDto[]> => {
    const response = await axios.get<WatchDto[]>(`${BASE_URL}/categories/watches`);
    return response.data;
};

export const getIpads = async (): Promise<IpadDto[]> => {
    const response = await axios.get<IpadDto[]>(`${BASE_URL}/categories/ipads`);
    return response.data;
};

export const getIphones = async (): Promise<IphoneDto[]> => {
    const response = await axios.get<IphoneDto[]>(`${BASE_URL}/categories/iphones`);
    return response.data;
};

// Запросы для конкретного продукта по идентификатору
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
