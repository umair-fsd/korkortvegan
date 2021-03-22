import { initialState } from "./state";

export function reducer(state = initialState, { type, data }) {
  switch (type) {
    case "SET_PROGRESS":
      return {
        ...state,
        userProgress: data,
      };
    // case "SET_PROGRESS":
    //   return {
    //     ...state,
    //     userProgress: [...state.userProgress, data],
    //   };

    case "EMPTY_PROGRESS":
      return {
        ...state,
        userProgress: [],
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
    case "EMPTY_COUNTERS":
      return {
        ...state,
        unAnswered: 0,
        wrongAnswers: 0,
        correctAnswers: 0,
      };
    case "SET_PAGING":
      return {
        ...state,
        pagingStatus: data,
      };
    case "UPDATE_PAGING":
      state.pagingStatus.map((value) => {
        value.question == data[0].question
          ? (value.status = data[0].status)
          : value;
      });
      return {
        ...state,
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
