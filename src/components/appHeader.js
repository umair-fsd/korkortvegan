import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";
import CountDown from "react-native-countdown-component";
import { useDispatch } from "react-redux";
import { setTimer } from "../redux/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const AppHeader = ({
  navigation,
  title,
  onPress,
  iconName,
  count,
  running,
  key,
  timerValue,
  screen,
  currentQuestion,
  totalQuestions,
}) => {
  const dispatch = useDispatch();
  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("@timer", value);
      await AsyncStorage.setItem("@chapterName", chapterName);
    } catch (e) {
      // saving error
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <FontAwesome5 name={iconName} color={COLORS.black} size={20} />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        {screen === "QUIZ" || screen === "FINALQUIZ" ? (
          <Text style={styles.title}>
            {currentQuestion + "/" + totalQuestions}
          </Text>
        ) : (
          <Text style={styles.title}>{title}</Text>
        )}
      </View>
      {screen === "QUIZ" || screen === "FINALQUIZ" ? (
        <CountDown
          until={parseInt(count)}
          onChange={() => {
            dispatch(setTimer(timerValue - 1));
            if (storeData) {
              storeData(String(timerValue));
            }
          }}
          onFinish={async () => {
            if (screen === "FINALQUIZ") {
              await axios
                .get(`${webURL}/api/resetQuestionStatusFinal/${user.user_id}`, {
                  headers: {
                    Authorization: `Bearer ${user.token}`,
                  },
                })
                .then((res) => {
                  res.status == 200 ? alert("Time's Up! ") : null;

                  navigation.navigate("FinalResultScreen");
                })
                .catch((err) => {
                  console.log(err);
                  // alert("Cannot reset the progress, Try agin later!");
                });
            }
          }}
          // onPress={() => {
          //   console.log("userAnswer :  " + options.userAnswerID);
          //   console.log("correctAnswerID :  " + options.correctAnswerID);
          // }}
          timeToShow={["M", "S"]}
          timeLabels={{ m: "", s: "" }}
          showSeparator
          digitStyle={
            {
              // backgroundColor: COLORS.primary,
              //   borderWidth: 2,
              //borderColor: COLORS.primary,
            }
          }
          digitTxtStyle={{ color: "black", fontSize: 14 }}
          size={10}
          running={running}
          key={key}
        />
      ) : null}
      {screen === "QUIZ" || screen === "FINALQUIZ" ? (
        <MaterialIcons name="timer" size={20} color="black" />
      ) : null}
    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === "ios" ? 81 : 71,
    width: "100%",
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    elevation: 3,
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === "ios" ? 20 : 10,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    marginLeft: 50,
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
  },
});
