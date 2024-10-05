import axios from 'axios';
import { AirpodsDto, WatchDto, IpadDto, IphoneDto } from './types';

const BASE_URL = 'http://localhost:9000/api/v1';

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
