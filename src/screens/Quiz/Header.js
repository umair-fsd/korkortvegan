import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { SIZES, COLORS } from "../../constants";
import { Header as HeaderTop, Title, Right } from "native-base";

const Header = ({ title }) => {
  return (
    <HeaderTop
      style={{ backgroundColor: "white" }}
      androidStatusBarColor={COLORS.primary}
    >
      <>
        <Text
          style={{
            fontSize: SIZES.h2,
            alignSelf: "center",
            fontWeight: "300",
            color: COLORS.primary,
          }}
        >
          {title}
        </Text>
        <Right>
          <TouchableOpacity
            onPress={() => {
              if (
                questionIndex <
                Object.keys(quizData.chaptersWithQuestions).length - 1
              ) {
                setQuestionIndex(++questionIndex);

                setQuestionID(quizData.chaptersWithQuestions[questionIndex].id);

                fetchOptions();
                setCounterKey((prevKey) => prevKey + 1);
                setUnAnswered(unAnswered + 1);
                setUserProgress(
                  userProgress.push({
                    ...userProgress,
                    questionID: answer,
                  })
                );
                console.log(userProgress);
              } else {
                navigation.push("ResultScreen", {
                  correctAnswer,
                  wrongAnswer,
                  unAnswered,
                });
              }
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                backgroundColor: COLORS.lightGray,
                padding: 5,
              }}
            >
              SKIP
            </Text>
          </TouchableOpacity>
        </Right>
      </>
    </HeaderTop>
  );
};

export default Header;

const styles = StyleSheet.create({});
