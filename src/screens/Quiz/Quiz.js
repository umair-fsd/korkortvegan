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
  Platform
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
  FontAwesome
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
import AppHeader from '../../components/appHeader'
import MyStatusBar from '../../components/myStatusBar';
import Ripple from 'react-native-material-ripple';


const Quiz = ({ route, navigation }) => {
const { height, width } = useWindowDimensions();
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
            <Ripple 
                onPress={() => {
                    setValue(answerID);
                }}
                rippleDuration={300}
                style={{
                height:60,
                width:'90%',
                alignSelf:'center',
                backgroundColor:COLORS.white,
                flexDirection:'row',
                alignItems:'center',
                borderBottomWidth:1,
                borderBottomColor:COLORS.gray,
            }}>
                <View style={{
                    width:50,
                    alignItems:'center',
                }}>
                  {/* <View style={{
                        height:20,
                        width:20,
                        borderWidth:1,
                        borderRadius:10,
                        borderColor: COLORS.red,
                        alignItems:'center',
                        justifyContent:'center'
                    }}>
                    <Entypo 
                        name="cross" 
                        size={15} 
                        color={COLORS.red} 
                    /> 
                  </View> */}
                  {/* correct */}
                  {/* <View style={{
                        height:20,
                        width:20,
                        borderWidth:1,
                        borderRadius:10,
                        borderColor: COLORS.green,
                        alignItems:'center',
                        justifyContent:'center'
                    }}>
                    <Entypo 
                        name="check" 
                        size={15} 
                        color={COLORS.green} 
                    /> 
                  </View> */}
                  
                  {/* default */}
                    <View style={{
                        height:20,
                        width:20,
                        borderWidth:1,
                        borderRadius:10,
                        borderColor: COLORS.green,
                        alignItems:'center',
                        justifyContent:'center',
                    }}> 
                    </View>
                </View>
                <View style={{
                      flex:1,
                    }}>
                  <Text style={{
                      paddingHorizontal:10
                    }}>
                      {answer}
                  </Text>                
                  </View>
            </Ripple>
    );
  };
    return (
        <View style={styles.container}>
            <MyStatusBar 
                barStyle = "dark-content" 
                backgroundColor = {COLORS.white} 
            />
            <AppHeader 
                title={chapterName}
                iconName={"chevron-left"}
                onPress={()=>navigation.goBack()}
            />
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={{ alignSelf: "center" }}>
                    <ImageModal
                        resizeMode="contain"
                        imageBackgroundColor="white"
                        style={{
                        width,
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
                        fontSize: SIZES.h2,
                        alignSelf: "center",
                        color: COLORS.black,
                        textAlign: "center",
                        marginHorizontal: 15,
                        fontWeight: Platform.OS==='ios' ? '700'  : 'bold'
                    }}>
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
                        color="black"
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
            </ScrollView>
          <View style={{
                backgroundColor:'transparent'
              }}>
            <View
                style={{
                      height:50,
                      flexDirection: "row",
                      justifyContent:'space-evenly',
                      alignSelf:'center',
                      alignItems:'center',
                      width:'95%',
                      backgroundColor: "#28282B",
                      borderRadius:10,
                      paddingHorizontal:10,
                      position:'absolute',
                      bottom:30
                  }}>
                  <Ripple 
                     rippleCentered
                     rippleDuration={300}
                    style={{
                      height:'100%',
                      alignItems:'center',
                      justifyContent:'space-evenly',
                      flexDirection:'row',
                    }}>
                    <FontAwesome name="calendar-check-o" size={20} color="white" />
                      <Text style={{
                        color:COLORS.white,
                        paddingHorizontal:10,
                        fontWeight:Platform.OS==='ios' ? '600' : 'bold'
                      }}>
                        {"Answered \n question"}
                      </Text>
                  </Ripple>
                      
                      <View style={{
                        height:35, 
                        borderColor:COLORS.white,
                        borderWidth:0.5
                      }} />

                  <Ripple 
                    rippleCentered
                    rippleDuration={300}
                    style={{
                      height:'100%',
                      alignItems:'center',
                      justifyContent:'space-evenly',
                      flexDirection:'row',
                      paddingHorizontal:10,
                    }}>
                    <Ionicons name="bookmark-outline" size={20} color="white" />
                      <Text style={{
                        color:COLORS.white,
                        paddingHorizontal:10,
                        fontWeight:Platform.OS==='ios' ? '600' : 'bold'
                      }}>
                        {"Mark"}
                      </Text>
                  </Ripple>
                      
                      <View style={{
                        height:35, 
                        borderColor:COLORS.white,
                        borderWidth:0.5
                      }} />

                  <Ripple 
                      rippleCentered
                      rippleDuration={300}
                      style={{
                        height:'100%',
                        alignItems:'center',
                        justifyContent:'space-evenly',
                        flexDirection:'row',
                      }}>
                    <Ionicons name="checkmark" size={20} color="white" />
                      <Text style={{
                        color:COLORS.white,
                        paddingHorizontal:10,
                        fontWeight:Platform.OS==='ios' ? '600' : 'bold'
                      }}>
                        {"Correct test"}
                      </Text>
                  </Ripple>
                  
                </View>
            </View>
        </View>
    )
}

export default Quiz

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:COLORS.lightGray1
    },
    scroll:{
        flex:1,
    },
    optionsContainer: {
        marginBottom: 3,
        flex: 1,
    },
})
