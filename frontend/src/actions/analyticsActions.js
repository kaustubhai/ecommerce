import axios from 'axios';
import {
    LOW_STOCK_PRODUCTS,
    NET_SALE_FY,
    NET_SALE_MO,
    OUT_OF_STOCK_PRODUCTS,
    PROCESSING_ORDERS,
    USERS_REGISTERED 
} from '../constants/analyticsConstants';

export const getNetSaleThisFY = () => async (dispatch, getState) => {
    try {

        const {
          userLogin: { userInfo },
        } = getState()
    
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        }

        const { data } = await axios.get('/api/analytics/net-sale-this-fy', config);
        dispatch({
            type: NET_SALE_FY,
            payload: data
        })       
    } catch (error) {
        console.log({ error })
    }
}

export const getNetSaleThisMonth = () => async (dispatch, getState) => {
    try {

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

        const { data } = await axios.get('/api/analytics/net-sale-this-month', config);
        dispatch({
            type: NET_SALE_MO,
            payload: data
        })       
    } catch (error) {
        console.log({ error })
    }
}

export const getOutOfStockProducts = () => async (dispatch, getState) => {
    try {

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

        const { data } = await axios.get('/api/analytics/out-of-stock-products', config);
        dispatch({
            type: OUT_OF_STOCK_PRODUCTS,
            payload: data
        })       
    } catch (error) {
        console.log({ error })
    }
}

export const getLowInStockProducts = () => async (dispatch, getState) => {
    try {

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

        const { data } = await axios.get('/api/analytics/low-in-stock-products', config);
        dispatch({
            type: LOW_STOCK_PRODUCTS,
            payload: data
        })       
    } catch (error) {
        console.log({ error })
    }
}

export const getNewUserOnboardedThisMonth = () => async (dispatch, getState) => {
    try {

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

        const { data } = await axios.get('/api/analytics/new-user-onboarded-this-month', config);
        dispatch({
            type: USERS_REGISTERED,
            payload: data
        })       
    } catch (error) {
        console.log({ error })
    }
}

export const getProcessingOrderCount = () => async (dispatch, getState) => {
    try {

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

        const { data } = await axios.get('/api/analytics/processing-order-count', config);
        dispatch({
            type: PROCESSING_ORDERS,
            payload: data
        })       
    } catch (error) {
        console.log({ error })
    }
}