import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Header } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { emptyCounters, setPagingStatus } from "../../redux/actions";
import { COLORS, SIZES } from "../../constants";
import { useSelector } from "react-redux";
import axios from "axios";
import { Ionicons, Entypo } from "@expo/vector-icons";
import qs from "qs";

const Favourites = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);
  const webURL = useSelector((state) => state.webURL);
  const [loading, setLoading] = useState(true);
  const [nodata, setNoData] = useState(false);
  const [savedQuestions, setSavedQuestions] = useState("");

  const fetchSavedQuerstions = async () => {
    await axios
      .get(`${webURL}/api/getSavedQuestions/${user.user_id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        Object.keys(res.data.SavedQuestions).length == 0
          ? setNoData(true)
          : setNoData(nodata);
        setSavedQuestions(res.data.SavedQuestions);
        setLoading(false);
      })
      .catch((err) => {
        setNoData(true);
      });
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardStyle}>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: SIZES.h3,
            padding: 5,
            fontWeight: "bold",
            textAlign: "left",
          }}
        >
          Q: {item.question}
        </Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <View
          style={{
            flex: 1,
            // borderWidth: 1,
            borderColor: COLORS.primary,
            margin: 5,
            alignItems: "center",
            borderRadius: 10,
          }}
        >
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={async () => {
              setLoading(true);
              try {
                await axios
                  .get(
                    `${webURL}/api/chaptersWithQuestions/${user.user_id}/${item.chapter_id}`,
                    {
                      headers: {
                        Authorization: `Bearer ${user.token}`,
                      },
                    }
                  )
                  .then((res) => {
                    var doneUntil = res.data.chaptersWithQuestions.findIndex(
                      (s) => s.id == item.id
                    );
                    console.log("DoneUntill: " + doneUntil);
                    var array = [];

                    ////initialized local question status array
                    for (
                      let i = 0;
                      i < Object.values(res.data.chaptersWithQuestions).length;
                      i++
                    ) {
                      array.push({
                        question: i,
                        status: null,
                      });
                    } ///end
                    dispatch(emptyCounters()); //reset counters
                    dispatch(setPagingStatus(array)); //pushing status array with all null
                    setLoading(false);
                    navigation.push("QuizScreen", {
                      quizData: res.data,
                      chapterName: "Kapitel " + item.chapter_id,
                      id: item.chapter_id,
                      doneUntil,
                      qID:
                        res.data.chaptersWithQuestions[
                          doneUntil == -1 ? 0 : doneUntil
                        ].id,
                    });
                  });
              } catch (error) {
                console.log(error);
                // alert("Server is not responding, Please try again later");
              }
            }}
          >
            <Ionicons
              name="caret-forward-circle-sharp"
              size={30}
              color={COLORS.primary}
            />
            <Text
              style={{ color: COLORS.primary, textAlign: "center", width: 100 }}
            >
              Goto Question
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            // borderWidth: 1,
            borderColor: "#e74c3c",
            alignItems: "center",
            margin: 5,
            borderRadius: 10,
          }}
        >
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() => {
              deleteSaved(item.id);
            }}
          >
            <Entypo name="circle-with-cross" size={30} color="#e74c3c" />
            <Text style={{ color: "#e74c3c" }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  const deleteSaved = async (question_id) => {
    await axios({
      method: "delete",
      url: `${webURL}/api/deleteSavedQuestion`,
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify({
        user_id: user.user_id,
        question_id,
      }),
    })
      .then((res) => {
        alert("Question Deleted");
      })
      .catch((err) => {
        console.log("Error", err.response);
      });
    fetchSavedQuerstions();
  };

  useEffect(() => {
    fetchSavedQuerstions();
  }, []);
  return (
    <View style={styles.container}>
      <Header
        style={{ backgroundColor: COLORS.primary }}
        androidStatusBarColor={COLORS.primary}
      >
        <Text
          style={{
            width: 300,
            textAlign: "center",
            color: COLORS.white,
            fontSize: SIZES.h2,
            alignSelf: "center",
          }}
        >
          Saved Questions
        </Text>
      </Header>
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
            Loading
          </Text>
        </View>
      ) : nodata == false ? (
        <FlatList
          data={savedQuestions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              width: 300,
              textAlign: "center",

              color: COLORS.primary,
              fontSize: SIZES.h2,
              margin: 0,
            }}
          >
            No Saved Questions...
          </Text>
        </View>
      )}
    </View>
  );
};

export default Favourites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
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
