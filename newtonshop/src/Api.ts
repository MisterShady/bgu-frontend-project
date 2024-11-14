import axios from "./axiosConfig";
import {
  AirpodsDto,
  CartItemDto,
  CartItemRequestDto,
  IpadDto,
  IphoneDto,
  MacDto,
  OrderRequestDto,
  OrderResponseDto,
  ProfileDto,
  TokenDto,
  UserDto,
  WatchDto,
} from "./types";

const BASE_URL = "http://localhost:9000/api/v1";

export interface ProductDto {
  id: string;
  title: string;
  thumbUrl: string;
  price: number;
  images: string[];
  type: string;
  category: string;
}

export const createOrder = async (orderData: OrderRequestDto): Promise<OrderResponseDto> => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.post(`${BASE_URL}/orders`, orderData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const getOrders = async (): Promise<OrderResponseDto[]> => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(`${BASE_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const postCartItem = async (cartItem: CartItemRequestDto): Promise<CartItemDto> => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.post<CartItemDto>(`${BASE_URL}/cart-items`, null, {
    params: {
      productId: cartItem.productId,
      config: cartItem.config,
      imageUrl: cartItem.imageUrl,
      price: cartItem.price,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getCartItems = async (): Promise<CartItemDto[]> => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get<CartItemDto[]>(`${BASE_URL}/cart-items`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateCartItem = async (id: number, quantity: number, selected: boolean): Promise<CartItemDto> => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.put<CartItemDto>(
    `${BASE_URL}/cart-items/${id}`,
    {},
    {
      params: {
        quantity,
        selected,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const deleteCartItem = async (id: number): Promise<void> => {
  const token = localStorage.getItem("accessToken");
  await axios.delete(`${BASE_URL}/cart-items/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const postSignUp = async (userData: Partial<UserDto>): Promise<UserDto> => {
  const response = await axios.post<UserDto>(`${BASE_URL}/users/sign-up`, userData);
  return response.data;
};

export const postSignIn = async (userData: Partial<UserDto>): Promise<TokenDto> => {
  const response = await axios.post<TokenDto>(`${BASE_URL}/users/sign-in`, userData, {
    withCredentials: true,
  });
  const tokens = response.data;

  localStorage.setItem("accessToken", tokens.accessToken);

  return tokens;
};

export const getCurrentProfile = async (): Promise<ProfileDto> => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Access token not found");
  }

  const response = await axios.get<ProfileDto>(`${BASE_URL}/users/secured/get-current`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const deleteProfile = async (token: string): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/users/secured/delete`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Ошибка при удалении профиля:", error);
    throw error;
  }
};

export const updateProfile = async (token: string, profileData: Partial<ProfileDto>): Promise<ProfileDto> => {
  const response = await axios.put<ProfileDto>(`${BASE_URL}/users/secured/update`, profileData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updatePassword = async (
  token: string,
  passwordData: { providedCurrentPassword: string; newPassword: string }
): Promise<ProfileDto> => {
  const response = await axios.put<ProfileDto>(`${BASE_URL}/users/secured/update-password`, passwordData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateAvatar = async (token: string, file: File): Promise<ProfileDto> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.put<ProfileDto>(`${BASE_URL}/users/secured/update-avatar`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
export const getProductsByPage = async (page: number, size: number, sort: string): Promise<ProductDto[]> => {
  const response = await axios.get<ProductDto[]>(
    `${BASE_URL}/products/catalog-pages?page=${page}&size=${size}&sort=${sort}`
  );
  return response.data;
};

export const getProductsByCategory = async (category: string): Promise<ProductDto[]> => {
  const response = await axios.get<ProductDto[]>(`${BASE_URL}/products/${category}`);
  return response.data;
};

export const getPopularProducts = async (): Promise<ProductDto[]> => {
  const response = await axios.get<ProductDto[]>(`${BASE_URL}/products/brand-new`);
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
