import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Platform,
} from "react-native";
import Header from "./Header";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import qs from "qs";
import { COLORS, SIZES } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { emptyProgress, setProgress } from "../../redux/actions";
import RenderOverView from "../../components/RenderOverView";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import Ripple from "react-native-material-ripple";

const FullFinalResultScreen = ({ route, navigation }) => {
  const [showOverView, setShowOverView] = useState(false);
  const [fill, setFill] = useState(30);
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

  return (
    <View style={{ flex: 1 }}>
      <Header navigation={navigation} />
      <View>
        {/* <View
          style={{
            height: 70,
            width: "100%",
            backgroundColor: COLORS.green,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 10,
          }}
        >
          <Text
            style={{
              color: COLORS.white,
              fontSize: 25,
            }}
          >
            {"PASSED"}
          </Text>
        </View> */}
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Text
            ext
            style={{
              fontSize: 22,
              marginVertical: 10,
              fontWeight: Platform.OS === "ios" ? "700" : "bold",
            }}
          >
            {"Results"}
          </Text>
          <AnimatedCircularProgress
            size={150}
            width={8}
            fill={parseInt(correctAnswers) || 0}
            tintColor={COLORS.green}
            backgroundColor="#3d5875"
          >
            {(fill) => (
              <>
                <Text
                  style={{
                    fontSize: 18,
                  }}
                >
                  {fill + "/" + 70}
                </Text>
              </>
            )}
          </AnimatedCircularProgress>
          <Ripple
            rippleCentered
            rippleDuration={300}
            style={{
              height: 55,
              width: "70%",
              borderRadius: 30,
              backgroundColor: COLORS.green,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            <Text
              style={{
                color: COLORS.white,
                fontSize: 20,
                fontWeight: Platform.OS === "ios" ? "700" : "bold",
              }}
            >
              {"Home"}
            </Text>
          </Ripple>
          <Ripple
            onPress={() => {
              setShowOverView(!showOverView);
            }}
            rippleCentered
            rippleDuration={300}
            style={{
              height: 55,
              width: "70%",
              borderRadius: 30,
              backgroundColor: "#0F3325",
              alignItems: "center",
              justifyContent: "center",
              marginVertical: 15,
            }}
          >
            <Text
              style={{
                color: COLORS.white,
                fontSize: 20,
                fontWeight: Platform.OS === "ios" ? "700" : "bold",
              }}
            >
              {"Review answer question"}
            </Text>
          </Ripple>
        </View>
      </View>
      {showOverView && (
        <View style={styles.overView}>
          <FlatList
            data={overViewData}
            keyExtractor={(item) => item.question_id.toString()}
            renderItem={renderOverView}
          />
        </View>
      )}
    </View>
  );
};

export default FullFinalResultScreen;

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
