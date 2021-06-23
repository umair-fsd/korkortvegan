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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import qs from "qs";
import {
  AntDesign,
  MaterialCommunityIcons,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { SIZES, COLORS } from "../../constants";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer"; //Old Timer lib..
import CountDown from "react-native-countdown-component";
import { Header, Title, Right, Left } from "native-base";
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

const QuizScreen = ({ route, navigation }) => {
  ////Timer Hooks///
  var [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);
  const [modalVisible, setModalVisible] = useState(true);
  const timerValue = useSelector((state) => state.timerValue);
  //const options = useSelector((state) => state.options);
  const [key, setKey] = useState(0);
  const [contuniue, setCanContinue] = useState(false);

  /////End////
  const [answerID, setAnswerID] = useState("");
  const user = useSelector((state) => state.user);
  const webURL = useSelector((state) => state.webURL);
  const reduxState = useSelector((state) => state.userProgress);
  const pagingStatus = useSelector((state) => state.pagingStatus);
  const { quizData, chapterName, id, qID, doneUntil } = route.params;
  const [loading, setLoading] = useState(true);
  const [toggleOverView, setToggleOverView] = useState(false);
  const [questions, setQuestions] = useState("");
  const [options, setOptions] = useState(() => {
    return;
  }); ///// Local State of options
  const [userProgress, setUserProgress] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [submit, canSubmit] = useState(false);
  const [skip, canSkip] = useState(false);
  var [questionIndex, setQuestionIndex] = useState(() => {
    return doneUntil == -1 ? 0 : doneUntil;
  });
  const [questionID, setQuestionID] = useState(() => {
    return qID;
  });
  const [counterKey, setCounterKey] = useState(0);
  const [value, setValue] = useState(() => {
    return "";
  });
  const dispatch = useDispatch();
  const reduxCorrectAnswers = useSelector((state) => state.correctAnswers);
  const reduxWrongAnswers = useSelector((state) => state.wrongAnswers);
  const reduxUnAnswered = useSelector((state) => state.unAnswered);

  //////////USE EFFECTS////////

  useEffect(() => {
    fetchOptions();
    getData();
    setModalVisible(true);
    jumpToQuestion();
  }, []);
  useEffect(() => {
    fetchOptions();
  }, [questionID]);

  //////Store And Get Timer From Async Storage////
  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("@timer", value);
      await AsyncStorage.setItem("@chapterName", chapterName);
    } catch (e) {
      // saving error
    }
  };

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
        console.log(value);
      }
    } catch (e) {
      // error reading value
    }
  };
  ////End Async Storage Functions

  ////UpdateDB////

  const updateDB = async (q, a) => {
    // const values = reduxState.reduce((r, c) => Object.assign(r, c), {});
    // const finalResult = {
    // UserProgress: values,
    //  };
    await axios({
      method: "put",
      url: `${webURL}/api/updateUserProgress/${user.user_id}`,
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
        //  console.log(q + "=>" + a);
        console.log(res.data);
        console.log("DoneUntil: " + questionID);
        dispatch(setProgress([]));
      })
      .catch((err) => {
        console.log("Error", err.response);
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
      .get(`${webURL}/api/getQuestionStatus/${user.user_id}/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        dispatch(setPagingStatus(res.data.ChapterQuestionStatus));
        console.log(Object.keys(res.data.ChapterQuestionStatus).length);
        setLoading(false);
      });
  };

  /////////Header Questions List Rendering Flat List
  const renderListQuestions = ({ item, index }) =>
    toggleOverView == true ? (
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "white",
          marginVertical: 5,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            console.log(index);
            setQuestionID(() => {
              return quizData.chaptersWithQuestions[index].id;
            });
            setLoading(true);
            setQuestionIndex(index);

            //fetchOptions();
          }}
        >
          <View
            style={{
              marginHorizontal: 3,

              borderRadius: 100,
              width: 30,
              height: 30,

              justifyContent: "center",

              backgroundColor:
                item.status == "correct"
                  ? COLORS.primary
                  : item.status == "wrong"
                  ? "#e74c3c"
                  : item.status == "favorite"
                  ? "#9b59b6"
                  : "#3498db",
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: item.question == questionID ? SIZES.h2 : SIZES.h4,
                fontWeight: item.question == questionID ? "bold" : "300",
              }}
            >
              {index + 1}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    ) : null;

  const fetchOptions = async () => {
    console.log("Question ID is : " + questionID);
    setLoading(true);
    const res = await axios
      .get(
        `${webURL}/api/getAnswersForQuestion/${questionID}/${user.user_id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
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
        setOptions(() => {
          return res.data;
        });
        console.log(options);

        setValue(res.data.userAnswerID);

        setLoading(false);
      });
    console.log("value ====" + value);
    // console.log(questionID);
  };
  const renderItem = ({ item }) => (
    <OptionBox
      answer={item.answer}
      answerID={item.id}
      correctAnswerID={options.correctAnswerID}
      userAnswerID={options.userAnswerID}
    />
  );

  const OptionBox = ({ answer, answerID, correctAnswerID, userAnswerID }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setValue(answerID);
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={
              toggleOverView == true
                ? {
                    marginRight: 10,
                    backgroundColor:
                      answerID == correctAnswerID && userAnswerID !== null
                        ? COLORS.primary
                        : answerID == userAnswerID
                        ? userAnswerID == correctAnswerID
                          ? COLORS.primary
                          : COLORS.red
                        : value == answerID
                        ? COLORS.selectionColor
                        : COLORS.white,
                    marginVertical: 8,
                    textAlign: "center",
                    fontSize: SIZES.h4,
                    alignSelf: "center",
                    width: "90%",
                    borderWidth: value == answerID ? 2 : 1,
                    padding: 8,
                    borderRadius: 5,
                    color:
                      answerID == userAnswerID && value == answerID
                        ? COLORS.white
                        : value == answerID
                        ? COLORS.white
                        : "black",

                    borderRadius: 10,
                    borderColor:
                      value == answerID ? COLORS.primary : COLORS.primary,
                  }
                : {
                    ////if toggle false //
                    marginRight: 10,
                    backgroundColor:
                      value == answerID ? COLORS.selectionColor : COLORS.white,
                    marginVertical: 8,
                    textAlign: "center",
                    fontSize: SIZES.h4,
                    alignSelf: "center",
                    width: "90%",
                    borderWidth: value == answerID ? 2 : 1,
                    padding: 8,
                    borderRadius: 5,
                    color:
                      answerID == userAnswerID && value == answerID
                        ? COLORS.white
                        : value == answerID
                        ? COLORS.white
                        : "black",

                    borderRadius: 10,
                    borderColor:
                      value == answerID ? COLORS.primary : COLORS.primary,
                  }
            }
          >
            {answer}
          </Text>
          {/* <RadioButton.Group
          value={value}
          onValueChange={(value) => {
            setValue(value);
          }}
        >
          <RadioButton.Item
            style={{
              marginVertical: -5,
              padding: 3,
              borderWidth: 1,
              borderColor:
                userAnswerID == answerID ? "rgba(0,0,0,0.1)" : "white",
            }}
            labelStyle={{
              textAlign: "center",
              padding: 3,
              fontSize: SIZES.h4,
              color:
                userAnswerID == null
                  ? COLORS.primary
                  : correctAnswerID == answerID
                  ? "green"
                  : "red",
            }}
            color={COLORS.primary}
            label={answer}
            value={answerID}
            status={answerID == userAnswerID ? "checked" : "unchecked"}
          />
        </RadioButton.Group> */}
        </View>
      </TouchableOpacity>
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
        style={{ backgroundColor: COLORS.primary }}
        androidStatusBarColor={COLORS.primary}
      >
        <Ionicons
          onPress={() => {
            navigation.navigate("Home");
          }}
          style={{ alignSelf: "center", left: 5 }}
          name="arrow-back-circle-outline"
          size={35}
          color="white"
        />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              fontSize: SIZES.h2,

              fontWeight: "bold",
              color: "white",
            }}
          >
            {chapterName}
          </Text>
        </View>

        <></>
      </Header>
      <Modal
        style={{ position: "absolute" }}
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Start Chapter With Timer? </Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{
                  ...styles.openButton,
                  backgroundColor: "green",
                  marginHorizontal: 5,
                }}
                onPress={() => {
                  storeData("3000");
                  dispatch(setTimer(3000));
                  setCount(3000);
                  setRunning(true);
                  setKey(key + 1);
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.openButton,
                  backgroundColor: "red",
                  marginLeft: 30,
                }}
                onPress={async () => {
                  try {
                    await AsyncStorage.setItem("@timer", "0");
                  } catch (e) {
                    // saving error
                  }
                  dispatch(setTimer(0));
                  setCount(0);
                  setRunning(false);
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>No</Text>
              </TouchableOpacity>
            </View>
            {contuniue == true ? (
              <TouchableOpacity
                onPress={async () => {
                  const val = await AsyncStorage.getItem("@timer");
                  console.log(val);
                  storeData(val);
                  dispatch(setTimer(val));
                  setCount(0);
                  setRunning(true);
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={{ marginTop: 20 }}>
                  <Text style={{ color: COLORS.primary }}>
                    Continue with old timer
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View>
        </View>
      </Modal>

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
            justifyContent: "center",
          }}
        >
          {quizData.chaptersWithQuestions[questionIndex].imgURL == null ? (
            <View style={{ marginTop: 20 }}></View>
          ) : (
            //  <Image
            //             source={{
            //               uri:
            //                 webURL + quizData.chaptersWithQuestions[questionIndex].imgURL,
            //             }}
            //             style={{
            //               width: 200,
            //               height: 200,
            //               marginTop: 5,
            //               bottom: 5,
            //               resizeMode: "contain",
            //               alignSelf: "center",
            //             }}
            //           />
            <View style={{ alignSelf: "center" }}>
              <ImageModal
                resizeMode="contain"
                imageBackgroundColor="white"
                style={{
                  width: 250,
                  height: 220,

                  marginVertical: 10,
                }}
                source={{
                  uri:
                    webURL +
                    quizData.chaptersWithQuestions[questionIndex].imgURL,
                }}
              />
            </View>
          )}
          <View
            style={{
              flex: 0.5,
              backgroundColor: COLORS.primary,
              // opacity: "rgba(255,255,255,0.5)",

              marginTop: -5,
              margin: 5,
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

          {/* End Activity Loader here */}
        </View>
      )}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          backgroundColor: "white",

          paddingBottom: 20,
        }}
      >
        <View>
          <TouchableOpacity
            disabled={questionIndex == 0 ? true : false}
            onPress={async () => {
              if (
                questionIndex <
                Object.keys(quizData.chaptersWithQuestions).length - 1
              ) {
                // console.log(questionID);
                setQuestionIndex(--questionIndex);

                setQuestionID(() => {
                  return quizData.chaptersWithQuestions[questionIndex].id;
                });

                // await fetchOptions();
              }
            }}
          >
            <FontAwesome5 name="backward" size={30} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              setToggleOverView(!toggleOverView);
            }}
          >
            <Text
              style={{
                borderColor: COLORS.primary,
                borderWidth: 1,
                padding: 10,
                borderRadius: 10,
                bottom: 5,
                backgroundColor: COLORS.primary,
                color: "white",
              }}
            >
              {toggleOverView == true ? "Hide" : "Show"} Overview
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={async () => {
              if (value == "" || value == null) {
                // if (
                //   questionIndex <
                //   Object.keys(quizData.chaptersWithQuestions).length - 1
                // ) {
                //   // console.log(questionID);
                //   setQuestionIndex(++questionIndex);

                //   setQuestionID(
                //     quizData.chaptersWithQuestions[questionIndex].id
                //   );

                //   fetchOptions();
                //   setCounterKey((prevKey) => prevKey + 1);
                //   dispatch(setUnAnswered());
                // } else {
                //   dispatch(setUnAnswered());

                //   navigation.reset({
                //     routes: [{ name: "ResultScreen" }],
                //   });
                // }

                alert("Please Select An Option");
                return null;
              }

              setIsSelected(true);
              //  console.log(answer);
              await axios
                .get(`${webURL}/api/getCorrectAnswer/${questionID}`, {
                  headers: {
                    Authorization: `Bearer ${user.token}`,
                  },
                })
                .then((res) => {
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
                  if (res.data.CorrectAnswer.id == value) {
                    setAnswerID(res.data.CorrectAnswer.id); //Temp
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
                      setQuestionID(() => {
                        return quizData.chaptersWithQuestions[questionIndex].id;
                      });
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

                    //   console.log(reduxWrongAnswers);
                    if (
                      questionIndex <
                      Object.keys(quizData.chaptersWithQuestions).length - 1
                    ) {
                      setQuestionIndex(++questionIndex);
                      setQuestionID(() => {
                        return quizData.chaptersWithQuestions[questionIndex].id;
                      });
                      setCounterKey((prevKey) => prevKey + 1);
                    } else {
                      navigation.reset({
                        routes: [{ name: "ResultScreen" }],
                      });
                    }
                    setValue("");
                    // console.log(reduxState);
                  }
                });
            }}
          >
            <FontAwesome5 name="forward" size={30} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ backgroundColor: "white" }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={pagingStatus}
          keyExtractor={(item) => item.question.toString()}
          renderItem={renderListQuestions}
          key={questionIndex}
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
          {/* Old Timer */}
          {/* <CountdownCircleTimer
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
              [COLORS.primary, 0.4],
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
          </CountdownCircleTimer> */}
          <CountDown
            until={parseInt(count)}
            onChange={() => {
              dispatch(setTimer(timerValue - 1));
              storeData(String(timerValue));
            }}
            //onFinish={() => alert("finished")}
            // onPress={() => {
            //   console.log("userAnswer :  " + options.userAnswerID);
            //   console.log("correctAnswerID :  " + options.correctAnswerID);
            // }}
            timeToShow={["M", "S"]}
            digitStyle={{
              backgroundColor: COLORS.primary,
              borderWidth: 2,
              borderColor: COLORS.primary,
            }}
            digitTxtStyle={{ color: "white", fontSize: 30 }}
            size={20}
            running={running}
            key={key}
          />
        </View>
        <TouchableOpacity
          style={{ alignSelf: "center" }}
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
        >
          <AntDesign
            name="heart"
            size={24}
            color={"#e74c3c"}
            style={{ marginRight: 10, alignSelf: "center" }}
          />
        </TouchableOpacity>
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
