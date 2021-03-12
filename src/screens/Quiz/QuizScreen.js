import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { SIZES, COLORS } from "../../constants";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import Header from "./Header";

const QuizScreen = ({ route, navigation }) => {
  const { quizData, chapterName, id, qID } = route.params;
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState("");
  const [options, setOptions] = useState("");

  var [questionIndex, setQuestionIndex] = useState(0);
  const [questionID, setQuestionID] = useState(qID);
  const [counterKey, setCounterKey] = useState(0);

  //////////USE EFFECTS////////

  useEffect(() => {
    // fetchChapterQuestions();

    fetchOptions();
  }, [questionID]);

  ///Text To Speech ///
  const speak = () => {
    Speech.speak(quizData.chaptersWithQuestions[questionIndex].question, {
      language: "sv-SE",
    });

    // Speech.speak("Hello");
  };

  const fetchChapterQuestions = async () => {
    await axios
      .get(
        `https://stssodra.dimitris.in/api/chaptersWithQuestions/${id}?email=admin@admin.com&password=admin`
      )
      .then((res) => {
        setLoading(true);
        // console.log(res.status);

        setQuestions(res.data);
        //console.log(questions.chaptersWithQuestions[0]);
        setLoading(false);
      });

    // console.log(questions.chaptersWithQuestions[1].id);
    // console.log(questions.chaptersWithQuestions[0].id);

    if (!questions == "") setQuestionID(questions.chaptersWithQuestions[0].id);
    // console.log(questions.chaptersWithQuestions);

    fetchOptions();
  };

  const fetchOptions = async () => {
    const res = await axios.get(
      `https://stssodra.dimitris.in/api/getAnswersForQuestion/${questionID}?email=admin@admin.com&password=admin`
    );
    const { data } = res;
    setOptions(res.data);
    // console.log(questionID);
  };
  const renderItem = ({ item }) => <OptionBox answer={item.answer} />;
  const OptionBox = ({ answer }) => {
    return (
      <View style={{}}>
        <TouchableOpacity
          onPress={async () => {
            console.log(answer);
            await axios
              .get(
                `https://stssodra.dimitris.in/api/getCorrectAnswer/${questionID}?email=admin@admin.com&password=admin`
              )
              .then((res) => {
                if (res.data.CorrectAnswer.answer == answer) {
                  alert("Correct");
                  /////if questions quiz is completed?
                  if (
                    questionIndex <
                    Object.keys(quizData.chaptersWithQuestions).length - 1
                  ) {
                    setQuestionIndex(++questionIndex);
                    setQuestionID(
                      quizData.chaptersWithQuestions[questionIndex].id
                    );
                    setCounterKey((prevKey) => prevKey + 1);
                  } else {
                    navigation.push("Results");
                  }
                } else {
                  alert("False");
                  if (
                    questionIndex <
                    Object.keys(quizData.chaptersWithQuestions).length - 1
                  ) {
                    setQuestionIndex(++questionIndex);
                    setQuestionID(
                      quizData.chaptersWithQuestions[questionIndex].id
                    );
                    setCounterKey((prevKey) => prevKey + 1);
                  } else {
                    navigation.push("Results");
                  }
                }
              });
          }}
        >
          <Text
            style={{
              marginRight: 10,
              // backgroundColor: COLORS.primary,
              marginVertical: 5,
              textAlign: "center",
              fontSize: SIZES.h4,
              alignSelf: "center",
              width: "90%",
              borderWidth: 1,
              padding: 8,
              borderRadius: 5,
              color: COLORS.primary,
              borderColor: COLORS.primary,
              borderRadius: 20,
            }}
          >
            {answer}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <Header title={chapterName} />
      {quizData == "" ? (
        <ActivityIndicator size={"large"} color={"red"} />
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            justifyContent: "space-between",
          }}
        >
          {quizData.chaptersWithQuestions[questionIndex].imgURL == null ? (
            <Image
              source={require("../../../assets/placeHolder.jpeg")}
              style={{
                width: 150,
                height: 150,
                marginTop: 10,

                resizeMode: "contain",
                alignSelf: "center",
              }}
            />
          ) : (
            <Image
              source={{
                uri:
                  "https://stssodra.dimitris.in" +
                  quizData.chaptersWithQuestions[questionIndex].imgURL,
              }}
              style={{
                width: 200,
                height: 150,
                marginTop: 10,

                resizeMode: "contain",
                alignSelf: "center",
              }}
            />
          )}
          <View
            style={{
              height: 150,
              backgroundColor: COLORS.primary,
              // opacity: "rgba(255,255,255,0.5)",

              marginTop: -5,
              margin: 10,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              padding: 5,
            }}
          >
            <Text
              style={{
                fontSize: SIZES.h2,
                alignSelf: "center",
                color: COLORS.white,
                textAlign: "center",
                marginHorizontal: 10,
              }}
            >
              {quizData.chaptersWithQuestions[questionIndex].question}
            </Text>
            <View
              style={{
                alignSelf: "flex-end",
                position: "absolute",
                bottom: 10,
                right: 10,
              }}
            >
              <MaterialCommunityIcons
                name="account-voice"
                size={24}
                color="white"
                style={{ alignSelf: "flex-end" }}
                onPress={speak}
              />
            </View>
          </View>

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
              } else {
                navigation.push("Results");
              }
            }}
          >
            <Text>Next</Text>
          </TouchableOpacity>
          <View style={styles.optionsContainer}>
            <FlatList
              data={options.options}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
            />
          </View>

          <View style={styles.bottomBar}>
            <Text
              style={{
                fontSize: SIZES.h2,
                color: COLORS.primary,
                alignSelf: "center",
                marginLeft: 10,
                fontWeight: "bold",
              }}
            >
              {questionIndex + 1}/
              {Object.keys(quizData.chaptersWithQuestions).length}
            </Text>
            <View style={styles.timer}>
              <CountdownCircleTimer
                key={counterKey}
                onComplete={() => {
                  if (
                    questionIndex <
                    Object.keys(quizData.chaptersWithQuestions).length - 1
                  ) {
                    setQuestionIndex(++questionIndex);
                    setQuestionID(
                      quizData.chaptersWithQuestions[questionIndex].id
                    );
                    setCounterKey((prevKey) => prevKey + 1);
                  } else {
                    navigation.push("Results");
                  }
                }}
                size={80}
                isPlaying={false}
                strokeWidth={8}
                duration={10}
                colors={[
                  ["#004777", 0.4],
                  ["#F7B801", 0.4],
                  ["#A30000", 0.2],
                ]}
              >
                {({ remainingTime, animatedColor }) => (
                  <Animated.Text
                    style={{ color: animatedColor, fontSize: SIZES.h1 }}
                  >
                    {remainingTime}
                  </Animated.Text>
                )}
              </CountdownCircleTimer>
            </View>
            <AntDesign
              name="heart"
              size={24}
              color={COLORS.primary}
              style={{ marginRight: 10, alignSelf: "center" }}
            />
          </View>
        </View>
      )}
    </>
  );
};

export default QuizScreen;

const styles = StyleSheet.create({
  bottomBar: {
    justifyContent: "space-between",

    flexDirection: "row",
  },
  timer: {
    alignSelf: "center",
    marginTop: -20,
    marginRight: 15,
    marginBottom: 5,
  },
  optionsContainer: {
    marginBottom: 20,
  },
});
