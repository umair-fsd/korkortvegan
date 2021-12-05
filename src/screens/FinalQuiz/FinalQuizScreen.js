import axios from "axios";
import React, { useEffect, useState } from "react";
import ImageModal from "react-native-image-modal";
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
  Modal,
  ScrollView,
  useWindowDimensions,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import qs from "qs";
import {
  AntDesign,
  MaterialCommunityIcons,
  FontAwesome5,
  Ionicons,
  Entypo,
  FontAwesome,
} from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { SIZES, COLORS } from "../../constants";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer"; //Old Timer lib..
import CountDown from "react-native-countdown-component";
import { Header } from "native-base";
import {
  setProgress,
  setCorrectAnswers,
  setWrongAnswers,
  setUnAnswered,
  updatePagingStatus,
  setPagingStatus,
  setTimer,
  setOptions,
} from "../../redux/actions";
import AppHeader from "../../components/appHeader";
import MyStatusBar from "../../components/myStatusBar";
import Ripple from "react-native-material-ripple";
import { getCheckColor } from "../../utils/getColors";

const FinalQuizScreen = ({ route, navigation }) => {
  const { quizData, chapterName, id, qID, message, doneUntil } = route.params;
  const { height, width } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  ////Timer Hooks///
  var [count, setCount] = useState(3000);
  const [running, setRunning] = useState(true);

  const timerValue = useSelector((state) => state.timerValue);
  //const options = useSelector((state) => state.options);
  const [key, setKey] = useState(0);

  /////End////

  const user = useSelector((state) => state.user);
  const webURL = useSelector((state) => state.webURL);

  const [toggleOverView, setToggleOverView] = useState(false);

  const [options, setOptions] = useState(() => {
    return;
  }); ///// Local State of options

  var [questionIndex, setQuestionIndex] = useState(
    doneUntil == -1 || doneUntil == null ? 0 : doneUntil
  );

  const [counterKey, setCounterKey] = useState(0);
  const [value, setValue] = useState(() => {
    return "";
  });
  const dispatch = useDispatch();

  const [questionID, setQuestionID] = useState(qID);

  console.log("QUIZ DATA", quizData);
  //////////USE EFFECTS////////
  useEffect(() => {
    setCounterKey(counterKey + 1);
    console.log(message);
    message != null ? alert(message) : console.log(message);

    // jumpToQuestion();
  }, []);
  useEffect(() => {
    fetchOptions();
  }, [questionID]);

  const updateDB = async (q, a) => {
    await axios({
      method: "put",
      url: `${webURL}/api/updateUserProgressFinalExam/${user.user_id}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify({
        answersArray: JSON.stringify({
          UserProgress: {
            [q]: a,
          },
        }),
        doneUntil: questionID,
      }),
    })
      .then((res) => {
        console.log(q + "=>" + a);
        // console.log(res.data);
        dispatch(setProgress([]));
      })
      .catch((err) => {
        console.log("Erroor", err.response);
      });
  };

  async function handleNext(v) {
    // if (value == "" || value == null) {
    //   alert("Please Select An Option");
    //   return null;
    // }

    // setIsSelected(true);

    await axios
      .get(`${webURL}/api/getCorrectAnswer/${questionID}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        console.log(res);
        ///check if user is Active
        if (res.data.active == 0) {
          alert(res.data.error);
          setLoading(false);
          navigation.reset({
            routes: [{ name: "Login" }],
          });
          return;
        }
        ///
        if (res.data.CorrectAnswer.id == v) {
          // setAnswerID(res.data.CorrectAnswer.id); //Temp

          updateDB(questionID, v);
          dispatch(
            setProgress({
              [questionID]: v,
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
            Object.keys(quizData.FinalExamQuestions).length - 1
          ) {
            setQuestionIndex(++questionIndex);
            setQuestionID(() => {
              return quizData.FinalExamQuestions[questionIndex].id;
            });
            // setCounterKey((prevKey) => prevKey + 1);
          } else {
            navigation.reset({
              routes: [
                {
                  name: "FinalResultScreen",
                  params: {
                    totalQuestions: Object.keys(quizData.FinalExamQuestions)
                      .length,
                  },
                },
              ],
            });
          }
        } else {
          // alert("False");
          updateDB(questionID, v); //Update Progress
          dispatch(
            setProgress({
              [questionID]: v,
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

          //   console.log(reduxWrongAnswers);
          if (
            questionIndex <
            Object.keys(quizData.FinalExamQuestions).length - 1
          ) {
            setQuestionIndex(++questionIndex);
            setQuestionID(() => {
              return quizData.FinalExamQuestions[questionIndex].id;
            });
            setCounterKey((prevKey) => prevKey + 1);
          } else {
            navigation.reset({
              routes: [
                {
                  name: "FinalResultScreen",
                  params: {
                    totalQuestions: Object.keys(quizData.FinalExamQuestions)
                      .length,
                  },
                },
              ],
            });
          }
          setValue("");
          // console.log(reduxState);
        }
      });
  }
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("@timer");
      const storedChapterName = await AsyncStorage.getItem("@chapterName");

      if (
        storedChapterName !== null &&
        storedChapterName == chapterName &&
        value !== "0"
      ) {
        setCanContinue(true);
      }

      if (value !== null) {
        // value previously stored
        setCount(value);
        dispatch(setTimer(value));
      }
    } catch (e) {
      // error reading value
    }
  };
  ////End Async Storage Functions

  ///Text To Speech ///
  const speak = () => {
    Speech.speak(quizData.FinalExamQuestions[questionIndex].question, {
      language: "sv-SE",
    });
  };

  const fetchOptions = async () => {
    setLoading(true);
    const res = await axios.get(
      `${webURL}/api/getAnswersForFinalQuestion/${questionID}/${user.user_id}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const { data } = res;

    ///check if user is Active
    if (res.data.active == 0) {
      alert(res.data.error);
      setLoading(false);
      navigation.reset({
        routes: [{ name: "Login" }],
      });
      return;
    }
    ///
    setOptions(res.data);
    setValue(res.data.userAnswerID);
    setLoading(false);
    // console.log(questionID);
  };

  const renderItem = ({ item }) => (
    <OptionBox answer={item.answer} answerID={item.id} />
  );

  const OptionBox = ({ answer, answerID, correctAnswerID, userAnswerID }) => {
    return (
      <Ripple
        onPress={() => {
          setValue(answerID);

          handleNext(answerID);
        }}
        rippleDuration={300}
        style={{
          height: 60,
          width: "90%",
          alignSelf: "center",
          backgroundColor: COLORS.white,
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: COLORS.gray,
        }}
      >
        <View
          style={{
            width: 50,
            alignItems: "center",
          }}
        >
          <View
            style={{
              height: 20,
              width: 20,
              borderWidth: 1,
              borderRadius: 10,
              backgroundColor: getCheckColor(value, answerID),
              borderColor: COLORS.green,
              alignItems: "center",
              justifyContent: "center",
            }}
          ></View>
        </View>
        <View
          style={{
            flex: 1,
          }}
        >
          <Text
            style={{
              paddingHorizontal: 10,
            }}
          >
            {answer}
          </Text>
        </View>
      </Ripple>
    );
  };
  return (
    <View style={styles.container}>
      <MyStatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <AppHeader
        navigation={navigation}
        totalQuestions={Object.keys(quizData?.FinalExamQuestions).length || 0}
        currentQuestion={questionIndex + 1}
        screen={"FINALQUIZ"}
        timerValue={timerValue}
        count={count}
        running={running}
        key={key}
        title={chapterName}
        iconName={"chevron-left"}
        onPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={{ alignSelf: "center" }}>
          <ImageModal
            resizeMode="contain"
            imageBackgroundColor="white"
            style={{
              width,
              height: 170,
              marginVertical: 10,
            }}
            source={{
              uri: webURL + quizData?.FinalExamQuestions[questionIndex]?.imgURL,
            }}
          />
        </View>
        <View
          style={{
            flex: 0.5,
            marginTop: -5,
            margin: 5,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          <Text
            style={{
              fontSize: SIZES.h3 + 3,
              alignSelf: "center",
              color: COLORS.black,
              textAlign: "center",
              marginHorizontal: 15,
              fontWeight: "bold",
            }}
          >
            {quizData.FinalExamQuestions[questionIndex]?.question}
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
              color="black"
              style={{ alignSelf: "flex-end" }}
              onPress={speak}
            />
          </View>
        </View>

        <View style={styles.optionsContainer}>
          <FlatList
            data={options?.options}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />
        </View>
      </ScrollView>

      <View
        style={{
          backgroundColor: "transparent",
        }}
      >
        <View
          style={{
            height: 50,
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignSelf: "center",
            alignItems: "center",
            width: "95%",
            backgroundColor: "#28282B",
            borderRadius: 10,
            paddingHorizontal: 10,
            position: "relative",
            bottom: 10,
          }}
        >
          <Ripple
            rippleCentered
            rippleDuration={300}
            onPress={async () => {
              await axios({
                method: "put",
                url: `${webURL}/api/saveQuestion`,
                headers: {
                  Authorization: `Bearer ${user.token}`,
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                data: qs.stringify({
                  user_id: user.user_id,
                  question_id: questionID,
                }),
              })
                .then((res) => {
                  dispatch(
                    updatePagingStatus([
                      {
                        question: questionID,
                        status: "favorite",
                      },
                    ])
                  );
                  alert("Added To Favourites");
                })
                .catch((err) => {
                  console.log("Error", err.response.data);
                });
            }}
            style={{
              height: "100%",
              alignItems: "center",
              justifyContent: "space-evenly",
              flexDirection: "row",
              paddingHorizontal: 10,
            }}
          >
            <Ionicons name="bookmark-outline" size={20} color="white" />
            <Text
              style={{
                color: COLORS.white,
                paddingHorizontal: 10,
                fontWeight: Platform.OS === "ios" ? "600" : "bold",
              }}
            >
              {"Mark"}
            </Text>
          </Ripple>

          <View
            style={{
              height: 35,
              borderColor: COLORS.white,
              borderWidth: 0.5,
            }}
          />

          <Ripple
            rippleCentered
            rippleDuration={300}
            onPress={() => {
              navigation.reset({
                routes: [
                  {
                    name: "FinalResultScreen",
                    params: {
                      totalQuestions: Object.keys(quizData.FinalExamQuestions)
                        .length,
                    },
                  },
                ],
              });
            }}
            style={{
              height: "100%",
              alignItems: "center",
              justifyContent: "space-evenly",
              flexDirection: "row",
            }}
          >
            <Ionicons name="checkmark" size={20} color="white" />
            <Text
              style={{
                color: COLORS.white,
                paddingHorizontal: 5,
                fontWeight: Platform.OS === "ios" ? "600" : "bold",
              }}
            >
              {"Correct test"}
            </Text>
          </Ripple>
        </View>
      </View>
    </View>
  );
};

export default FinalQuizScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray1,
  },
  scroll: {
    flex: 1,
  },
  optionsContainer: {
    marginBottom: 3,
    flex: 1,
  },
  centeredView: {
    position: "absolute",
    width: "80%",
    bottom: "30%",
    left: "10%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: "100%",
    borderRadius: 10,
    margin: 20,
    backgroundColor: "white",

    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    borderRadius: 5,
    color: "white",
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
