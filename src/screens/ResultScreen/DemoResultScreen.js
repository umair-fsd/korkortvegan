import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Header from "./Header";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import qs from "qs";
import { COLORS, SIZES } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { emptyProgress, setProgress } from "../../redux/actions";
import RenderOverView from "../../components/RenderOverView";

const DemoResultScreen = ({ route, navigation }) => {
  const [overViewData, setOverViewData] = useState("");
  const reduxState = useSelector((state) => state.userProgress);
  const dispatch = useDispatch();
  const correctAnswers = useSelector((state) => state.correctAnswers);
  const wrongAnswers = useSelector((state) => state.wrongAnswers);
  const unAnswered = useSelector((state) => state.unAnswered);
  const user = useSelector((state) => state.user);
  const webURL = useSelector((state) => state.webURL);

  useEffect(() => {
    fetchOverView();
    //updateDB();
  }),
    [];

  const fetchOverView = async () => {
    await axios
      .get(webURL + `/api/getDemoStatus/${user.user_id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => setOverViewData(res.data.Overview))
      .catch((err) => console.log(err));
  };
  const renderOverView = ({ item }) => (
    <RenderOverView
      imgURL={item.imgURL}
      question={item.question}
      category={item.category}
      status={item.status}
      question_id={item.question_id}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      {/* <Header navigation={navigation} /> */}
      <View style={{ alignItems: "center" }}>
        <AntDesign
          name="checkcircleo"
          size={50}
          color={COLORS.primary}
          style={{ marginTop: 20 }}
        />
        <Text
          style={{
            fontSize: SIZES.h2,
            color: COLORS.primary,
            width: "100%",
            textAlign: "center",
          }}
        >
          Your quiz has been finished!
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
            <Ionicons name="bar-chart" size={40} color={COLORS.primary} />
            <Text style={{ width: 70, textAlign: "center" }}>Overview</Text>
          </View>
        </TouchableOpacity> */}
      </View>
      <View style={styles.overView}>
        <TouchableOpacity
          onPress={() => {
            navigation.replace("Login");
          }}
        >
          <Text
            style={{
              marginTop: 20,
              backgroundColor: COLORS.primary,
              color: COLORS.white,
              padding: 10,
              paddingHorizontal: 20,
              textAlign: "center",
              borderRadius: 5,
            }}
          >
            Back
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DemoResultScreen;

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
    alignItems: "center",
  },
  cardStyle: {
    flex: 1,
    backgroundColor: "white",
    padding: 5,
    borderRadius: 10,

    margin: 10,
    //box Shaddow
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
