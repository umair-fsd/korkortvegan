import { initialState } from "./state";
// import {
//   getProductsAction,
//   deleteProductAction,
//   getProductsAction,
//   addToCart,
// } from "./actions";
export function reducer(state = initialState, { type, data }) {
  switch (type) {
    case "SET_PROGRESS":
      return {
        ...state,
        userProgress: [...state.userProgress, data],
      };
    case "SET_CORRECT":
      return {
        ...state,
        correctAnswers: state.correctAnswers + 1,
      };
    case "SET_WRONG":
      return {
        ...state,
        wrongAnswers: state.wrongAnswers + 1,
      };
    case "SET_UNANSWERED":
      return {
        ...state,
        unAnswered: state.unAnswered + 1,
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
