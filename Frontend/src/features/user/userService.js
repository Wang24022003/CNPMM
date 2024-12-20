import axios from "axios";
import { base_url, config } from "../../utils/axiosConfig";

const register = async (userData) => {
  const response = await axios.post(`${base_url}user/register`, userData);
  if (response.data) {
    return response.data;
  }
};

const active_account = async (userData) => {
  const response = await axios.post(`${base_url}user/active-account`, userData);
  if (response.data) {
    return response.data;
  }
};

const check_active_account = async (userData) => {
  const response = await axios.post(`${base_url}user/check-active-account`, userData);
  if (response.data) {
    return response.data;
  }
};

const login = async (userData) => {
  const response = await axios.post(`${base_url}user/login`, userData);

  if (response.data) {
    localStorage.setItem("customer", JSON.stringify(response.data));
  }
  return response.data;
};

const getUserWislist = async () => {
  const response = await axios.get(`${base_url}user/wishlist`, config);
  if (response.data) {
    return response.data;
  }
};

const getUserHistory = async (Data) => {
  const response = await axios.post(`${base_url}product/purchased`, Data);
  if (response.data) {
    return response.data;
  }
};

const addToCart = async (cartData) => {
  const response = await axios.post(`${base_url}user/cart`, cartData, config);
  if (response.data) {
    return response.data;
  }
};

const getCart = async (data) => {
  const response = await axios.get(`${base_url}user/cart`, data);
  if (response.data) {
    return response.data;
  }
};

const removeProductFromCart = async (data) => {
  const response = await axios.delete(
    `${base_url}user/delete-product-cart/${data.id}`,

    data.config2, {
      headers: {
        "ngrok-skip-browser-warning": "69420"
      }
    }
  );
  if (response.data) {
    return response.data;
  }
};

const updateProductFromCart = async (cartDetail) => {
  const response = await axios.delete(
    `${base_url}user/update-product-cart/${cartDetail.cartItemId}/${cartDetail.quantity}`,
    config
  );
  if (response.data) {
    return response.data;
  }
};

const createOrder = async (orderDetail) => {
  const response = await axios.post(
    `${base_url}user/cart/create-order/`,
    orderDetail,
    config
  );
  if (response.data) {
    return response.data;
  }
};

const getUserOrders = async () => {
  const response = await axios.get(`${base_url}user/getmyorders`, config);

  if (response.data) {
    return response.data;
  }
};

const updateUser = async (data) => {
  const response = await axios.put(
    `${base_url}user/edit-user`,
    data.data,
    data.config2,
    config
  );

  if (response.data) {
    return response.data;
  }
};

const forgotPasswordToken = async (data) => {
  const response = await axios.post(
    `${base_url}user/forgot-password-token`,
    data, {
      headers: {
        "ngrok-skip-browser-warning": "69420"
      }
    }
  );

  if (response.data) {
    return response.data;
  }
};

const resetPass = async (data) => {
  const response = await axios.put(
    `${base_url}user/reset-password/${data.token}`,
    {
      password: data?.password,
    }
  );

  if (response.data) {
    return response.data;
  }
};

const emptyCart = async (data) => {
  const response = await axios.delete(`${base_url}user/empty-cart`, data);

  if (response.data) {
    return response.data;
  }
};



const paymentVerification = async (params) => {
  const response = await axios.post(
    `${base_url}user/order/paymentVerification`,
    {},
    {
      ...config,
      params,
    }
  );

  if (response.data) {
    return response.data;
  }
};

export const authService = {
  register,
  active_account,
  check_active_account,
  login,
  getUserWislist,
  getUserHistory,
  addToCart,
  getCart,
  removeProductFromCart,
  updateProductFromCart,
  createOrder,
  getUserOrders,
  updateUser,
  forgotPasswordToken,
  resetPass,
  emptyCart,
  paymentVerification,
};
