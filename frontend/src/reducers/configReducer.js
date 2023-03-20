import {
  SET_CATEGORY_SCREEN,
  SET_HOMESCREEN,
  SET_LIST_SCREEN,
  SET_OVERALL,
  SET_PRODUCT_SCREEN,
  SET_REGISTER_SCREEN,
} from "../constants/configConstants";

const initialState = {
  homeScreen: null,
  categoryScreen: null,
  listScreen: null,
  registerScreen: null,
  overall: null,
  productScreen: null,
};

export const configReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_HOMESCREEN:
      return {
        ...state,
        homeScreen: action.payload,
      };
    case SET_CATEGORY_SCREEN:
      return {
        ...state,
        categoryScreen: action.payload,
      };
    case SET_LIST_SCREEN:
      return {
        ...state,
        listScreen: action.payload,
      };
    case SET_REGISTER_SCREEN:
      return {
        ...state,
        registerScreen: action.payload,
      };
    case SET_OVERALL:
      return {
        ...state,
        overall: action.payload,
      };
    case SET_PRODUCT_SCREEN:
      return {
        ...state,
        productScreen: action.payload,
      };
    default:
      return state;
  }
};
