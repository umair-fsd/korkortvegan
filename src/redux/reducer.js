import { initialState } from "./state";
// import {
//   getProductsAction,
//   deleteProductAction,
//   getProductsAction,
//   addToCart,
// } from "./actions";
export function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case "GET_PRODUCTS":
      return {
        ...state,
        tests: payload,
      };
    case "ADD_PRODUCT":
      return {
        ...state,
        tests: [...state.todos, payload],
      };
    case "ADD_TO_CART":
      return {
        ...state,
        cart: [...state.cart, payload],
      };
    case "DELETE_TEST":
      return {
        ...state,
        tests: state.tests.filter((test) => test.code !== payload),
      };
    case "UPDATE_CART":
      return {
        cartValue: { ...state.cartValue, payload },
      };
    case "EMPTY_CART":
      return {
        ...state,
        cart: payload,
      };
    case "DELETE_CART_ITEM":
      return {
        ...state,
        cart: state.cart.filter((item) => item.code !== payload),
      };
    case "INIT_USER":
      return {
        ...state,
        currentUser: payload,
      };

    default:
      return state;
  }
}
