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
  Alert,
} from "react-native";
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
import { CountdownCircleTimer } from "react-native-countdown-circle-timer"; //Old Timer Lib
import CountDown from "react-native-countdown-component";
import { Header, Title, Right, Left } from "native-base";
import {
  setProgress,
  setCorrectAnswers,
  setWrongAnswers,
  setUnAnswered,
  updatePagingStatus,
  setPagingStatus,
} from "../../redux/actions";

const FinalQuizScreen = ({ route, navigation }) => {
  const user = useSelector((state) => state.user);
  const webURL = useSelector((state) => state.webURL);
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

  useEffect(() => {}, []);
  useEffect(() => {
    fetchOptions();
  }, [questionID]);

  ////UpdateDB////

  const updateDB = async (q, a) => {
    // const values = reduxState.reduce((r, c) => Object.assign(r, c), {});
    // const finalResult = {
    // UserProgress: values,
    //  };
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

  ///Text To Speech ///
  const speak = () => {
    Speech.speak(quizData.DemoQuestions[questionIndex].question, {
      language: "sv-SE",
    });
  };

  ///////Fetch Jump To Question///////////

  // const jumpToQuestion = async () => {
  //   setLoading(true);
  //   await axios
  //     .get(`${webURL}/api/getQuestionStatus/${user.user_id}/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     })
  //     .then((res) => {
  //       dispatch(setPagingStatus(res.data.QuestionStatus));
  //       console.log(Object.keys(res.data.QuestionStatus).length);
  //       setLoading(false);
  //     });
  // };

  /////////Header Questions List Rendering Flat List
  const renderListQuestions = ({ item, index }) => (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "white",
        marginVertical: 5,
      }}
    >
      <TouchableOpacity
        onPress={async () => {
          setLoading(true);
          setQuestionIndex(index);
          setQuestionID(quizData.DemoQuestions[index].id);
          // await fetchOptions();
          console.log("index is :" + index);
          console.log("item is :" + item.question);
          console.log("questionID is :" + questionID);
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
  );

  const fetchChapterQuestions = async () => {
    await axios
      .get(
        `${webURL}/api/DemoQuestions/${id}?email=admin@admin.com&password=admin`
      )
      .then((res) => {
        setLoading(true);
        // console.log(res.status);

        setQuestions(res.data);
        //console.log(questions.DemoQuestions[0]);
        setLoading(false);
      });

    // console.log(questions.DemoQuestions[1].id);
    // console.log(questions.DemoQuestions[0].id);

    if (!questions == "") setQuestionID(questions.DemoQuestions[0].id);
    // console.log(questions.DemoQuestions);

    //fetchOptions();
  };

  const fetchOptions = async () => {
    setLoading(true);
    const res = await axios.get(
      `${webURL}/api/getAnswersForQuestion/${questionID}/${user.user_id}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
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
          onPress={() => {
            setValue(answerID);
          }}
        >
          <Text
            style={{
              marginRight: 10,
              // backgroundColor:
              //   answerID == userAnswerID && value == answerID
              //     ? COLORS.primary
              //     : value == answerID
              //     ? COLORS.primary
              //     : "white",

              backgroundColor:
                value == answerID
                  ? COLORS.primary
                  : value == answerID
                  ? COLORS.primary
                  : "white",
              marginVertical: 8,
              textAlign: "center",
              fontSize: SIZES.h4,
              alignSelf: "center",
              width: "90%",
              borderWidth: 2,
              padding: 8,
              borderRadius: 5,
              color:
                value == answerID
                  ? COLORS.white
                  : value == answerID
                  ? COLORS.white
                  : "black",
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
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="home-sharp"
            size={24}
            color={COLORS.white}
            onPress={() => {
              navigation.reset({
                routes: [{ name: "Login" }],
              });
            }}
          />
          <Text
            style={{
              fontSize: SIZES.h2,

              fontWeight: "bold",
              color: "white",
            }}
          >
            Demo
          </Text>
          <Text
            style={{
              fontSize: SIZES.h2,

              fontWeight: "bold",
              color: "white",
            }}
          >
            {""}
          </Text>
        </View>

        <></>
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
            justifyContent: "center",
          }}
        >
          {quizData.DemoQuestions[questionIndex].imgURL == null ? (
            <Image
              source={require("../../../assets/placeHolder.jpeg")}
              style={{
                width: 200,
                height: 200,
                // marginTop: 5,

                resizeMode: "contain",
                alignSelf: "center",
              }}
            />
          ) : (
            <Image
              source={{
                uri: webURL + quizData.DemoQuestions[questionIndex].imgURL,
              }}
              style={{
                width: 200,
                height: 200,
                marginTop: 5,
                bottom: 5,
                resizeMode: "contain",
                alignSelf: "center",
              }}
            />
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
              {quizData.DemoQuestions[questionIndex].question}
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
            onPress={() => {
              if (
                questionIndex <
                Object.keys(quizData.DemoQuestions).length - 1
              ) {
                // console.log(questionID);
                setQuestionIndex(--questionIndex);

                setQuestionID(quizData.DemoQuestions[questionIndex].id);

                //  fetchOptions();
              }
            }}
          >
            <FontAwesome5 name="backward" size={30} color={COLORS.primary} />
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
                .get(`${webURL}/api/getCorrectAnswer/${questionID}`, {
                  headers: {
                    Authorization: `Bearer ${user.token}`,
                  },
                })
                .then((res) => {
                  if (res.data.CorrectAnswer.id == value) {
                    //alert("Correct");
                    // updateDB(questionID, value);
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
                    setValue("");

                    /////if questions quiz is completed?
                    if (
                      questionIndex <
                      Object.keys(quizData.DemoQuestions).length - 1
                    ) {
                      setQuestionIndex(++questionIndex);
                      setQuestionID(quizData.DemoQuestions[questionIndex].id);
                      // setCounterKey((prevKey) => prevKey + 1);
                    } else {
                      navigation.reset({
                        routes: [{ name: "DemoResultScreen" }],
                      });
                    }
                  } else {
                    // alert("False");
                    // updateDB(questionID, value); //Update Progress
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
                      Object.keys(quizData.DemoQuestions).length - 1
                    ) {
                      setQuestionIndex(++questionIndex);
                      setQuestionID(quizData.DemoQuestions[questionIndex].id);
                      setCounterKey((prevKey) => prevKey + 1);
                    } else {
                      navigation.reset({
                        routes: [{ name: "DemoResultScreen" }],
                      });
                    }
                    setValue("");
                    console.log(reduxState);
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
          {questionIndex + 1}/{Object.keys(quizData.DemoQuestions).length}
        </Text>
        <View style={styles.timer}>
          {/*  <CountdownCircleTimer
            //key={counterKey}
            onComplete={() => {
              if (
                questionIndex <
                Object.keys(quizData.DemoQuestions).length - 1
              ) {
                setQuestionIndex(++questionIndex);
                setQuestionID(quizData.DemoQuestions[questionIndex].id);
              } else {
                navigation.reset({
                  routes: [{ name: "DemoResultScreen" }],
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
            until={3000}
            // onChange={() => {
            //   dispatch(setTimer(timerValue - 1));
            //   storeData(String(timerValue));
            // }}
            onFinish={() => {
              alert("Time's Up!");
              navigation.reset({
                routes: [{ name: "DemoResultScreen" }],
              });
            }}
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
            // running={running}
            // key={key}
          />
        </View>
        <AntDesign
          onPress={() => alert("Not available in demo")}
          name="heart"
          size={24}
          color={"#e74c3c"}
          style={{ marginRight: 10, alignSelf: "center" }}
        />
      </View>
    </>
  );
  // );
};

export default FinalQuizScreen;

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
