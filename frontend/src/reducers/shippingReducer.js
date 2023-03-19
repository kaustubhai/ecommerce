import {
    SET_ERROR,
    SET_CITY,
    SET_PINCODE,
    SET_LOADING
} from '../constants/shippingConstants'

export const shippingReducer = (state = { pincode: '', city: '', state: '', deliveryDays: 0, error: '', loading: false }, action) => {
    switch(action.type) {
        case SET_CITY:
            return {
                ...state,
                city: action.payload.city,
                state: action.payload.state,
                deliveryDays: parseInt(action.payload.delivery) + 3,
                error: '',
                loading: false
            }
        case SET_PINCODE:
            return {
                ...state,
                deliveryDays: 0,
                pincode: action.payload,
            }
        case SET_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false
            }
        case SET_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state
        }
}
