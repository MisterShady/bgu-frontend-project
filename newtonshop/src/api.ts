import axios from 'axios';
import { CategoryInfo, AirpodsDto } from './types';

const BASE_URL = 'http://localhost:9000/api/v1';

export const getCategoriesInfo = async (): Promise<CategoryInfo[]> => {
    try {
        const response = await axios.get<CategoryInfo[]>(`${BASE_URL}/categories/info`);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories info:', error);
        throw error;
    }
};

export const getAirpods = async (): Promise<AirpodsDto[]> => {
    try {
        const response = await axios.get<AirpodsDto[]>(`${BASE_URL}/categories/airpods`);
        return response.data;
    } catch (error) {
        console.error('Error fetching airpods:', error);
        throw error;
    }
};

