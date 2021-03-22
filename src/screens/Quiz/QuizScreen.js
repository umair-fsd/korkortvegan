import axios from "axios";
import React, { useEffect, useState } from "react";
import { RadioButton } from "react-native-paper";

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
import qs from "qs";
import {
  AntDesign,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { SIZES, COLORS } from "../../constants";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { Header, Title, Right, Left } from "native-base";
import {
  setProgress,
  setCorrectAnswers,
  setWrongAnswers,
  setUnAnswered,
  updatePagingStatus,
  setPagingStatus,
} from "../../redux/actions";

const QuizScreen = ({ route, navigation }) => {
  const reduxState = useSelector((state) => state.userProgress);
  const pagingStatus = useSelector((state) => state.pagingStatus);
  const { quizData, chapterName, id, qID } = route.params;
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState("");
  const [options, setOptions] = useState("");
  const [userProgress, setUserProgress] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [submit, canSubmit] = useState(false);
  const [skip, canSkip] = useState(false);
  var [questionIndex, setQuestionIndex] = useState(0);
  const [questionID, setQuestionID] = useState(qID);
  const [counterKey, setCounterKey] = useState(0);
  const [value, setValue] = React.useState("");
  const dispatch = useDispatch();
  const reduxCorrectAnswers = useSelector((state) => state.correctAnswers);
  const reduxWrongAnswers = useSelector((state) => state.wrongAnswers);
  const reduxUnAnswered = useSelector((state) => state.unAnswered);

  //////////USE EFFECTS////////

  useEffect(() => {
    jumpToQuestion();
  }, []);
  useEffect(() => {
    fetchOptions();
  }, [questionID, userProgress]);

  ////UpdateDB////

  const updateDB = async (q, a) => {
    // const values = reduxState.reduce((r, c) => Object.assign(r, c), {});
    // const finalResult = {
    // UserProgress: values,
    //  };
    await axios({
      method: "put",
      url: "https://stssodra.dimitris.in/api/updateUserProgress/1",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify({
        email: "admin@admin.com",
        password: "admin",
        answersArray: JSON.stringify({
          UserProgress: {
            [q]: a,
          },
        }),
        doneUntil: questionID,
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    })
      .then((res) => {
        console.log(q + "=>" + a);
        // console.log(res.data);
        dispatch(setProgress([]));
      })
      .catch((err) => {
        console.log("Erreeer", err.response);
      });
  };

  ///Text To Speech ///
  const speak = () => {
    Speech.speak(quizData.chaptersWithQuestions[questionIndex].question, {
      language: "sv-SE",
    });
  };

  ///////Fetch Jump To Question///////////

  const jumpToQuestion = async () => {
    setLoading(true);
    await axios
      .get(
        `https://stssodra.dimitris.in/api/getQuestionStatus/1/${id}?email=admin@admin.com&password=admin`
      )
      .then((res) => {
        dispatch(setPagingStatus(res.data.QuestionStatus));
        setLoading(false);
      });
  };

  /////////Header Questions List Rendering Flat List
  const renderListQuestions = ({ item, index }) => (
    <View style={{ flexDirection: "row", alignSelf: "flex-end" }}>
      <TouchableOpacity
        onPress={async () => {
          setLoading(true);
          setQuestionIndex(index);
          setQuestionID(quizData.chaptersWithQuestions[index].id);
          await fetchOptions();
        }}
      >
        <Text
          style={{
            marginHorizontal: 5,

            fontWeight: item.question == questionID ? "bold" : "300",
            color:
              item.status == "correct"
                ? COLORS.primary
                : item.status == "wrong"
                ? "red"
                : "purple",
            fontSize: item.question == questionID ? SIZES.h2 : SIZES.h3,
          }}
        >
          {index + 1}
        </Text>
      </TouchableOpacity>
    </View>
  );

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
        {/* <TouchableOpacity
          onPress={async () => {
            setIsSelected(true);
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
                  } else {[]
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
        > */}
        {/* <Text
            style={{
              marginRight: 10,
              backgroundColor:
                isSelected == true ? COLORS.primary : COLORS.white,
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
          </Text> */}
        <RadioButton.Group
          onValueChange={(value) => {
            setValue(value);
          }}
          value={value}
        >
          <RadioButton.Item
            style={{ marginVertical: -5 }}
            labelStyle={{ fontSize: SIZES.h4, color: COLORS.primary }}
            color={COLORS.primary}
            label={answer}
            value={answerID}
          />
        </RadioButton.Group>
        {/* </TouchableOpacity> */}
      </View>
    );
  };

  //  loading == true ? (
  //   <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
  //     <ActivityIndicator color={COLORS.primary} size={"large"} />
  //     <Text style={{ color: COLORS.primary }}>Loading Question</Text>
  //   </View>
  // ) : (
  return (
    <>
      <Header
        style={{ backgroundColor: "white" }}
        androidStatusBarColor={COLORS.primary}
      >
        <Left style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: SIZES.h2,
              alignSelf: "flex-start",
              fontWeight: "300",
              color: COLORS.primary,
            }}
          >
            {chapterName}
          </Text>
        </Left>

        <>
          <Right style={{ flex: 2 }}>
            {
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={pagingStatus}
                keyExtractor={(item) => item.question.toString()}
                renderItem={renderListQuestions}
                key={questionIndex}
              />
            }
          </Right>
        </>
      </Header>

      {/* <Header title={chapterName} questionIndex={questionIndex} /> */}
      {loading == true ? (
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator color={COLORS.primary} size={"large"} />
          <Text
            style={{
              width: 200,
              textAlign: "center",

              color: COLORS.primary,
              fontSize: SIZES.h2,
              margin: 0,
            }}
          >
            Loading Question
          </Text>
        </View>
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
              flex: 1,
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
                fontSize: SIZES.h2,
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

          {/* End Activity Loader here */}
        </View>
      )}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          backgroundColor: COLORS.white,
          marginBottom: 5,
        }}
      >
        <View>
          <TouchableOpacity
            disabled={questionIndex == 0 ? true : false}
            onPress={() => {
              if (
                questionIndex <
                Object.keys(quizData.chaptersWithQuestions).length - 1
              ) {
                // console.log(questionID);
                setQuestionIndex(--questionIndex);

                setQuestionID(quizData.chaptersWithQuestions[questionIndex].id);

                fetchOptions();
              }
            }}
          >
            <FontAwesome5 name="backward" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={async () => {
              if (value == "") {
                alert("Please Select An Option");
                return null;
              }

              setIsSelected(true);
              //  console.log(answer);
              await axios
                .get(
                  `https://stssodra.dimitris.in/api/getCorrectAnswer/${questionID}?email=admin@admin.com&password=admin`
                )
                .then((res) => {
                  if (res.data.CorrectAnswer.id == value) {
                    //alert("Correct");
                    updateDB(questionID, value);
                    dispatch(
                      setProgress({
                        [questionID]: value,
                      })
                    );
                    dispatch(
                      updatePagingStatus([
                        {
                          question: questionID,
                          status: "correct",
                        },
                      ])
                    );
                    //console.log(Object.keys(userProgress).length);
                    dispatch(setCorrectAnswers());

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
                    updateDB(questionID, value); //Update Progress
                    dispatch(
                      setProgress({
                        [questionID]: value,
                      })
                    );
                    dispatch(
                      updatePagingStatus([
                        {
                          question: questionID,
                          status: "wrong",
                        },
                      ])
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
                    setValue("");
                    console.log(reduxState);
                  }
                });
            }}
          >
            <Text
              style={{
                borderColor: COLORS.primary,
                borderWidth: 1,
                padding: 10,
                borderRadius: 10,
                marginTop: -5,
                color: COLORS.primary,
              }}
            >
              Submit
            </Text>
          </TouchableOpacity>
        </View>
        <View>
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
                updateDB(questionID, null);
                dispatch(
                  updatePagingStatus([
                    {
                      question: questionID,
                      status: null,
                    },
                  ])
                );

                console.log(userProgress);
                // console.log(questionID);
                setQuestionIndex(++questionIndex);

                setQuestionID(quizData.chaptersWithQuestions[questionIndex].id);

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
                updateDB(questionID, null);
                dispatch(setUnAnswered());

                navigation.reset({
                  routes: [{ name: "ResultScreen" }],
                });
              }
            }}
          >
            <FontAwesome5 name="forward" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
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
                setQuestionID(quizData.chaptersWithQuestions[questionIndex].id);
              } else {
                navigation.reset({
                  routes: [{ name: "ResultScreen" }],
                });
              }
            }}
            size={70}
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
                <Text style={{ fontSize: 8, color: COLORS.primary }}>
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
    </>
  );
  // );
};

export default QuizScreen;

const styles = StyleSheet.create({
  bottomBar: {
    flex: 0.2,
    height: 50,
    bottom: 2,
    borderRadius: 1,
    borderColor: COLORS.primary,
    backgroundColor: "white",
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
