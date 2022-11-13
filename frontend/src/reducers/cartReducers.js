import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  CART_CLEAR_ITEMS,
  APPLY_COUPON,
  GET_COUPON,
  ADD_COUPON,
  DELETE_COUPON
} from '../constants/cartConstants'

export const cartReducer = (
  state = { cartItems: [], shippingAddress: {}, discount: 0 },
  action
) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload

      const existItem = state.cartItems.find((x) => x.product === item.product)

      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x.product === existItem.product ? item : x
          ),
        }
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        }
      }
    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter((x) => x.product !== action.payload),
      }
    case CART_SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload,
      }
    case CART_SAVE_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload,
      }
    case CART_CLEAR_ITEMS:
      return {
        ...state,
        cartItems: [],
      }

    case APPLY_COUPON:
      return {
        ...state,
        discount: action.payload,
        error: action.payload === 0 ? 'Invalid Coupon' : null
      }
    default:
      return state
  }
}


export const couponListReducer = (state = { coupons: [] }, action) => {
  switch (action.type) {
    case GET_COUPON:
      return { coupons: action.payload }
    case ADD_COUPON:
      return { coupons: [...state.coupons, {discount: action.payload.discount, code: action.payload.code}] }
    case DELETE_COUPON:
      return { coupons: state.coupons.filter(coupon => coupon.code !== action.payload) }
    default:
      return state
  }
}