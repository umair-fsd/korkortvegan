import { COLORS } from "../constants/theme";
export const getCheckColor = (answerID, selection) => {
  if (answerID === selection) {
    return COLORS.green;
  }
};
