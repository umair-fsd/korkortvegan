export const setProgress = (data) => ({
  type: "SET_PROGRESS",
  data,
});
export const emptyProgress = () => ({
  type: "EMPTY_PROGRESS",
});
export const emptyCounters = () => ({
  type: "EMPTY_COUNTERS",
});
export const setPagingStatus = (data) => ({
  type: "SET_PAGING",
  data,
});
export const updatePagingStatus = (data) => ({
  type: "UPDATE_PAGING",
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
  data: user,
});
