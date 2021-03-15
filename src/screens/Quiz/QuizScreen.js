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
import { useDispatch, useSelector } from "react-redux";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { SIZES, COLORS } from "../../constants";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { Header, Title, Right } from "native-base";
import {
  setProgress,
  setCorrectAnswers,
  setWrongAnswers,
  setUnAnswered,
} from "../../redux/actions";

const QuizScreen = ({ route, navigation }) => {
  const reduxState = useSelector((state) => state.userProgress);

  const { quizData, chapterName, id, qID } = route.params;
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState("");
  const [options, setOptions] = useState("");
  const [userProgress, setUserProgress] = useState([]);

  var [questionIndex, setQuestionIndex] = useState(0);
  const [questionID, setQuestionID] = useState(qID);
  const [counterKey, setCounterKey] = useState(0);
  // const [correctAnswer, setCorrectAnswer] = useState(0);
  // const [wrongAnswer, setWrongAnswer] = useState(0);
  // var [unAnswered, setUnAnswered] = useState(0);
  const dispatch = useDispatch();
  const reduxCorrectAnswers = useSelector((state) => state.correctAnswers);
  const reduxWrongAnswers = useSelector((state) => state.wrongAnswers);
  const reduxUnAnswered = useSelector((state) => state.unAnswered);
  //////////USE EFFECTS////////

  useEffect(() => {
    // console.log(
    //   quizData.chaptersWithQuestions[
    //     Object.keys(quizData.chaptersWithQuestions).length - 1
    //   ].id
    // );

    // fetchChapterQuestions();

    fetchOptions();
  }, [questionID, userProgress]);

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
    setLoading(true);
    const res = await axios.get(
      `https://stssodra.dimitris.in/api/getAnswersForQuestion/${questionID}?email=admin@admin.com&password=admin`
    );
    const { data } = res;
    setOptions(res.data);
    setLoading(false);
    // console.log(questionID);
  };
  const renderItem = ({ item }) => (
    <OptionBox answer={item.answer} answerID={item.id} />
  );

  const OptionBox = ({ answer, answerID }) => {
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={async () => {
            //  console.log(answer);
            await axios
              .get(
                `https://stssodra.dimitris.in/api/getCorrectAnswer/${questionID}?email=admin@admin.com&password=admin`
              )
              .then((res) => {
                if (res.data.CorrectAnswer.answer == answer) {
                  // alert("Correct");
                  dispatch(
                    setProgress({
                      [questionID]: answerID,
                    })
                  );
                  //console.log(Object.keys(userProgress).length);
                  dispatch(setCorrectAnswers());
                  console.log(reduxCorrectAnswers);
                  /////if questions quiz is completed?
                  if (
                    questionIndex <
                    Object.keys(quizData.chaptersWithQuestions).length - 1
                  ) {
                    setQuestionIndex(++questionIndex);
                    setQuestionID(
                      quizData.chaptersWithQuestions[questionIndex].id
                    );
                    // setCounterKey((prevKey) => prevKey + 1);
                  } else {
                    navigation.reset({
                      routes: [{ name: "ResultScreen" }],
                    });
                  }
                } else {
                  // alert("False");
                  dispatch(
                    setProgress({
                      [questionID]: answerID,
                    })
                  );

                  //console.log(Object.keys(userProgress).length);
                  dispatch(setWrongAnswers());
                  console.log(reduxWrongAnswers);
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
                    navigation.reset({
                      routes: [{ name: "ResultScreen" }],
                    });
                  }
                }
              });
          }}
        >
          <Text
            style={{
              marginRight: 10,
              backgroundColor: COLORS.white,
              marginVertical: 2,
              textAlign: "center",
              fontSize: SIZES.h4,
              alignSelf: "center",
              width: "90%",
              borderWidth: 1,
              padding: 8,
              borderRadius: 5,
              color: COLORS.primary,
              borderColor: COLORS.primary,
              borderRadius: 10,
            }}
          >
            {answer}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return loading == true ? (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator color={COLORS.primary} size={"large"} />
      <Text style={{ color: COLORS.primary }}>Loading Question</Text>
    </View>
  ) : (
    <>
      <Header
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
            {chapterName}
          </Text>
          <Right>
            <Text>
              {questionID}/
              {
                quizData.chaptersWithQuestions[
                  Object.keys(quizData.chaptersWithQuestions).length - 1
                ].id
              }
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (
                  questionIndex <
                  Object.keys(quizData.chaptersWithQuestions).length - 1
                ) {
                  dispatch(
                    setProgress({
                      [questionID]: null,
                    })
                  );

                  console.log(userProgress);
                  // console.log(questionID);
                  setQuestionIndex(++questionIndex);

                  setQuestionID(
                    quizData.chaptersWithQuestions[questionIndex].id
                  );

                  fetchOptions();
                  setCounterKey((prevKey) => prevKey + 1);
                  dispatch(setUnAnswered());
                } else {
                  console.log(reduxUnAnswered);

                  dispatch(
                    setProgress({
                      [questionID]: null,
                    })
                  );

                  navigation.reset({
                    routes: [{ name: "ResultScreen" }],
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
      </Header>
      {/* <Header title={chapterName} questionIndex={questionIndex} /> */}
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
                width: 130,
                height: 130,
                marginTop: 5,

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
                width: 130,
                height: 130,
                marginTop: 5,
                bottom: 5,
                resizeMode: "contain",
                alignSelf: "center",
              }}
            />
          )}
          <View
            style={{
              flex: 0.7,
              backgroundColor: COLORS.primary,
              // opacity: "rgba(255,255,255,0.5)",

              marginTop: -5,
              margin: 10,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              padding: 0,

              //Box Shadow
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              shadowRadius: 1.41,
              elevation: 2,
            }}
          >
            <Text
              style={{
                fontSize: SIZES.h3,
                alignSelf: "center",
                color: COLORS.white,
                textAlign: "center",
                marginHorizontal: 15,
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
                //key={counterKey}
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
                    navigation.reset({
                      routes: [{ name: "ResultScreen" }],
                    });
                  }
                }}
                size={80}
                isPlaying={true}
                strokeWidth={8}
                duration={3000}
                colors={[
                  ["#004777", 0.4],
                  ["#F7B801", 0.4],
                  ["#A30000", 0.2],
                ]}
              >
                {({ remainingTime, animatedColor }) => (
                  <>
                    <Animated.Text
                      style={{ color: COLORS.primary, fontSize: SIZES.h2 }}
                    >
                      {Math.floor(remainingTime / 60)}
                    </Animated.Text>
                    <Text style={{ fontSize: 10, color: COLORS.primary }}>
                      Minutes
                    </Text>
                  </>
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
    flex: 0.5,
    height: 50,
    bottom: 2,
    borderRadius: 1,
    borderColor: COLORS.primary,

    justifyContent: "space-between",

    flexDirection: "row",
  },
  timer: {
    alignSelf: "center",

    marginRight: 15,
  },
  optionsContainer: {
    marginBottom: 3,
    flex: 1,
  },
});
