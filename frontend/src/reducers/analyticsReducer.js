
import {
    NET_SALE_FY,
    NET_SALE_MO,
    OUT_OF_STOCK_PRODUCTS,
    LOW_STOCK_PRODUCTS,
    USERS_REGISTERED,
    PROCESSING_ORDERS
} from '../constants/analyticsConstants';

export const analyticsReducer = (
    state = { netSaleFY: 0, netSaleMO: 0, outOfStockProducts: [], lowInStockProducts: [], usersRegistered: 0, processingOrders: 0 },
    action
  ) => {
    switch (action.type) {
        case NET_SALE_FY:
            return {
                ...state,
                netSaleFY: action.payload
            }
        case NET_SALE_MO:
            return {
                ...state,
                netSaleMO: action.payload
            }
        case OUT_OF_STOCK_PRODUCTS:
            return {
                ...state,
                outOfStockProducts: action.payload
            }
        case LOW_STOCK_PRODUCTS:
            return {
                ...state,
                lowInStockProducts: action.payload
            }
        case USERS_REGISTERED:
            return {
                ...state,
                usersRegistered: action.payload
            }
        case PROCESSING_ORDERS:
            return {
                ...state,
                processingOrders: action.payload
            }
        default:
            return state;
        }
}