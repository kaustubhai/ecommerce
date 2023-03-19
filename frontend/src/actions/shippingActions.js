import axios from "axios"
import { SET_CITY, SET_ERROR, SET_LOADING, SET_PINCODE } from "../constants/shippingConstants"
import { USER_UPDATE_PROFILE_FAIL, USER_UPDATE_PROFILE_REQUEST, USER_UPDATE_PROFILE_SUCCESS } from "../constants/userConstants"


export const checkDelivery = (pincode) => async (dispatch, getState) => {
    try {
        dispatch({
            type: SET_LOADING
        })
      const {
        userLogin: { userInfo },
      } = getState()
  
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
      dispatch({
        type: SET_PINCODE,
        payload: pincode
      })
        const { data } = await axios.post(`/api/orders/courier/service`, {pincode}, config)
            dispatch({
                type: SET_CITY,
                payload: { city: data[0].city, state: data[0].state, delivery: data[0].estimated_delivery_days }
            })
    } catch (error) {
        dispatch({
            type: SET_ERROR,
            payload: 'Pincode is not serviceable'
        })
    }
  }

  export const updatePhone = (phone) => async (dispatch, getState) => {
    try {
      dispatch({
        type: SET_LOADING
      })
      dispatch({
        type: USER_UPDATE_PROFILE_REQUEST
      })
      const {
        userLogin: { userInfo },
      } = getState()
  
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
      const { data } = await axios.put(`/api/users/update/phone`, { phone }, config)
      dispatch({
        type: USER_UPDATE_PROFILE_SUCCESS,
        payload: data
      })
  } catch (error) {
      console.log(error)
      dispatch({
        type: USER_UPDATE_PROFILE_FAIL,
        payload: 'Phone number is already registered'
      })
  }
}