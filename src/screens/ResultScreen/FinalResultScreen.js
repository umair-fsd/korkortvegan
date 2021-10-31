import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Header from "./Header";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import qs from "qs";
import { COLORS, SIZES } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { emptyProgress, setProgress } from "../../redux/actions";
import RenderOverView from "../../components/RenderOverView";
const FinalResultScreen = ({ route, navigation }) => {
  const [overViewData, setOverViewData] = useState("");
  const reduxState = useSelector((state) => state.userProgress);
  const dispatch = useDispatch();
  const correctAnswers = useSelector((state) => state.correctAnswers);
  const wrongAnswers = useSelector((state) => state.wrongAnswers);
  const unAnswered = useSelector((state) => state.unAnswered);
  const user = useSelector((state) => state.user);
  const webURL = useSelector((state) => state.webURL);
  const [loadingResetProgress, setLoadingResetProgress] = useState(false);

  useEffect(() => {
    fetchOverView();
    //updateDB();
  }, []);
  const fetchOverView = async () => {
    await axios
      .get(webURL + `/api/getFinalQuestionStatus/${user.user_id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/x-www-form-urlencoded",
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
        setOverViewData(res.data.FinalQuestionStatus);
      })
      .catch((err) => console.log(err));
  };
  const renderOverView = ({ item }) => (
    <RenderOverView
      imgURL={item.imgURL}
      question={item.question}
      category={item.category}
      status={item.status}
      question_id={item.question_id}
      chapter_id={item.chapter_id}
    />
  );
  // const updateDB = async () => {
  //   const values = reduxState.reduce((r, c) => Object.assign(r, c), {});
  //   const finalResult = {
  //     UserProgress: values,
  //   };
  //   await axios({
  //     method: "put",
  //     url: "https://stssodra.dimitris.in/api/updateUserProgressFinalExam/1",
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //     data: qs.stringify({
  //       email: "admin@admin.com",
  //       password: "admin",
  //       answersArray: JSON.stringify(finalResult),
  //       doneUntil: 66,
  //     }),
  //     headers: {
  //       "content-type": "application/x-www-form-urlencoded;charset=utf-8",
  //     },
  //   })
  //     .then((res) => {
  //       console.log(res.data);
  //       dispatch(emptyProgress());
  //     })
  //     .catch((err) => {
  //       console.log("Error", err.response);
  //     });
  // };
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
          Your quiz has been finished!
        </Text>
        <TouchableOpacity
          onPress={async () => {
            setLoadingResetProgress(true);
            await axios
              .get(`${webURL}/api/resetQuestionStatusFinal/${user.user_id}`, {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              })
              .then((res) => {
                res.status == 200 ? alert("Progress reset successful! ") : null;
                setLoadingResetProgress(false);
              })
              .catch((err) => {
                setLoadingResetProgress(false);
                console.log(err);
                alert("Cannot reset the progress, Try agin later!");
              });
          }}
        >
          {loadingResetProgress == true ? (
            <ActivityIndicator
              size={"large"}
              color={COLORS.primary}
              style={{ right: 10 }}
            />
          ) : (
            <Text
              style={{
                marginRight: 10,
                backgroundColor: COLORS.white,
                padding: 7,
                borderRadius: 5,
                fontSize: 11,
                borderColor: "red",
                borderWidth: 1,
                color: "red",
                marginTop: 10,
              }}
            >
              Reset Progress
            </Text>
          )}
        </TouchableOpacity>
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
          {/* <View>
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
          </View> */}
        </View>
        {/* <TouchableOpacity>
          <View style={{ marginTop: 20, alignItems: "center" }}>
            <Ionicons
              name="bar-chart"
              size={40}
              color={COLORS.primary}
              onPress={updateDB}
            />
            <Text>Overview</Text>
          </View>
        </TouchableOpacity> */}
      </View>
      <View style={styles.overView}>
        <FlatList
          data={overViewData}
          keyExtractor={(item) => item.question_id.toString()}
          renderItem={renderOverView}
        />
      </View>
    </View>
  );
};

export default FinalResultScreen;

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
  overView: {
    flex: 1,
    marginTop: 2,
  },
});
