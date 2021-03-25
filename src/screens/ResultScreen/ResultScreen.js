import React, { useEffect } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import Header from "./Header";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import qs from "qs";
import { COLORS, SIZES } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { emptyCounters, setProgress } from "../../redux/actions";
const ResultScreen = ({ route, navigation }) => {
  const reduxState = useSelector((state) => state.userProgress);
  const dispatch = useDispatch();
  const correctAnswers = useSelector((state) => state.correctAnswers);
  const wrongAnswers = useSelector((state) => state.wrongAnswers);
  const unAnswered = useSelector((state) => state.unAnswered);

  useEffect(() => {
    console.log(unAnswered);
    //updateDB();
  }),
    [];
  const fetchDB = async () => {
    await axios
      .get(
        "https://stssodra.dimitris.in/api/getUserProgress/1?email=admin@admin.com&password=admin"
      )
      .then((res) => console.log(Object.keys(res.data.UserProgress).length));
  };
  const updateDB = async () => {
    const values = reduxState.reduce((r, c) => Object.assign(r, c), {});
    const finalResult = {
      UserProgress: values,
    };
    await axios({
      method: "put",
      url: "https://stssodra.dimitris.in/api/updateUserProgress/1",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify({
        email: "admin@admin.com",
        password: "admin",
        answersArray: JSON.stringify(finalResult),
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        console.log(res.data);
        dispatch(setProgress([]));
      })
      .catch((err) => {
        console.log("Erreeer", err.response);
      });
  };
  return (
    <View style={{ flex: 1 }}>
      <Header navigation={navigation} />
      <View style={{ alignItems: "center" }}>
        <AntDesign
          name="checkcircleo"
          size={50}
          color={COLORS.primary}
          style={{ marginTop: 20 }}
        />
        <Text style={{ fontSize: SIZES.h2, color: COLORS.primary }}>
          Your quiz has been submitted!
        </Text>
        <View style={styles.scoreCard}>
          <View>
            <View
              style={{
                height: 60,
                width: 60,
                borderRadius: 50,
                backgroundColor: COLORS.primary,
                alignSelf: "center",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 5,
              }}
            >
              <Text style={{ fontSize: SIZES.h2, color: COLORS.white }}>
                {correctAnswers}
              </Text>
            </View>

            <Text>Correct Answers</Text>
          </View>
          <View>
            <View
              style={{
                height: 60,
                width: 60,
                borderRadius: 50,
                backgroundColor: COLORS.primary,
                alignSelf: "center",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 5,
              }}
            >
              <Text style={{ fontSize: SIZES.h2, color: COLORS.white }}>
                {wrongAnswers}
              </Text>
            </View>

            <Text>Wrong Answers</Text>
          </View>
          <View>
            <View
              style={{
                height: 60,
                width: 60,
                borderRadius: 50,
                backgroundColor: COLORS.primary,
                alignSelf: "center",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 5,
              }}
            >
              <Text style={{ fontSize: SIZES.h2, color: COLORS.white }}>
                {unAnswered}
              </Text>
            </View>

            <Text>Not Answered</Text>
          </View>
        </View>
        <TouchableOpacity>
          <View style={{ marginTop: 20, alignItems: "center" }}>
            <Ionicons
              name="bar-chart"
              size={40}
              color={COLORS.primary}
              onPress={() => {
                dispatch(emptyCounters());
              }}
            />
            <Text>View Progress</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ResultScreen;

const styles = StyleSheet.create({
  scoreCard: {
    backgroundColor: COLORS.white,
    width: "95%",
    height: 150,
    borderRadius: 20,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    //Box Shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});
