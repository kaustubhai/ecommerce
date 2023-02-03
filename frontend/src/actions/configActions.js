import {
    SET_CATEGORY_SCREEN,
    SET_HOMESCREEN,
    SET_LIST_SCREEN,
    SET_OVERALL,
    SET_PRODUCT_SCREEN,
    SET_REGISTER_SCREEN
} from '../constants/configConstants'
import axios from 'axios'

export const getConfig = (screen) => async (dispatch) => {
    try {
        const { data } = axios.get(`/file?file=${screen}`)
        switch (screen) {
            case 'homescreen':
                dispatch({
                    type: SET_HOMESCREEN,
                    payload: data
                })
                break;
            case 'categoryScreen':
                dispatch({
                    type: SET_CATEGORY_SCREEN,
                    payload: data
                })
                break;
            case 'listScreen':
                dispatch({
                    type: SET_LIST_SCREEN,
                    payload: data
                })
                break;
            case 'overall':
                dispatch({
                    type: SET_OVERALL,
                    payload: data
                })
                break;
            case 'productScreen':
                dispatch({
                    type: SET_PRODUCT_SCREEN,
                    payload: data,
                })
                break;
            case 'registerScreen':
                dispatch({
                    type: SET_REGISTER_SCREEN,
                    payload: data,
                })
                break;
            default:
                dispatch({
                    type: SET_OVERALL,
                    payload: data
                })
                break;
        }
    } catch (error) {
        console.log(error);
    }
}