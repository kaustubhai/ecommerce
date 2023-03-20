import axios from "axios";
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  APPLY_COUPON,
  REJECT_COUPON,
  DELETE_COUPON,
  ADD_COUPON,
  GET_COUPON,
} from "../constants/cartConstants";

export const addToCart = (id, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/products/${id}`);

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      discount: data.discount,
      brand: data.brand,
      qty,
    },
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  });

  localStorage.setItem("shippingAddress", JSON.stringify(data));
};

export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  });

  localStorage.setItem("paymentMethod", JSON.stringify(data));
};

export const applyCoupon = (coupon, total) => async (dispatch, getState) => {
  try {
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.patch(
      `/api/orders/coupons/${coupon}`,
      { total },
      config
    );

    if (data.discount) {
      let disc;
      if ((total * data.discount) / 100 > data.maximum) disc = data.maximum;
      else disc = (total * data.discount) / 100;
      dispatch({
        type: APPLY_COUPON,
        payload: disc,
      });
    }
  } catch (error) {
    console.log({ error });
    dispatch({
      type: REJECT_COUPON,
      payload: error.response && error.response.data.message,
    });
  }
};

export const getCoupon = () => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState();

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };

  const { data } = await axios.get(`/api/orders/coupons/get`, config);

  dispatch({
    type: GET_COUPON,
    payload: data,
  });
};

export const addCoupon =
  (code, discount, maximum, minimumPrice) => async (dispatch, getState) => {
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(
      `/api/orders/coupons`,
      { code, discount, maximum, minimumPrice },
      config
    );

    dispatch({
      type: ADD_COUPON,
      payload: data,
    });
  };

export const deleteCoupon = (code) => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState();

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };

  await axios.delete(`/api/orders/coupons/${code}`, config);

  dispatch({
    type: DELETE_COUPON,
    payload: code,
  });
};
