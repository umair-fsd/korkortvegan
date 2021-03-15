export const setProgress = (data) => ({
  type: "SET_PROGRESS",
  data,
});
export const setCorrectAnswers = () => ({
  type: "SET_CORRECT",
});
export const setWrongAnswers = () => ({
  type: "SET_WRONG",
});
export const setUnAnswered = () => ({
  type: "SET_UNANSWERED",
});

export const initUser = (user) => ({
  type: "INIT_USER",
  payload: user,
});
