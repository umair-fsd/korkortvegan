import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { COLORS, SIZES } from "../constants";

import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setPagingStatus, emptyCounters } from "../redux/actions";

const RenderOverView = ({
  question,
  question_id,
  category,
  status,
  imgURL,
  chapter_id,
}) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const webURL = useSelector((state) => state.webURL);

  return (
    <View style={styles.cardStyle}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ borderBottomWidth: 1, borderColor: COLORS.colorBorder }}>
          <Image
            source={{ uri: webURL + imgURL }}
            style={{
              width: 80,
              height: 80,
              resizeMode: "center",
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            borderColor: COLORS.colorBorder,
            borderBottomWidth: 1,
          }}
        >
          <Text style={{ padding: 3, fontWeight: "bold", fontSize: SIZES.h3 }}>
            {question}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View
          style={{
            borderColor: COLORS.colorBorder,
            borderRightWidth: 1,
            width: 90,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontWeight: "bold" }}>{category}</Text>
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 5,
          }}
        >
          {status == "correct" ? (
            <AntDesign name="checkcircle" size={24} color={COLORS.primary} />
          ) : status == "wrong" ? (
            <Entypo name="circle-with-cross" size={24} color={COLORS.red} />
          ) : (
            <AntDesign name="questioncircle" size={24} color="orange" />
          )}
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              try {
                axios
                  .get(`${webURL}/api/getFinalExamQuestions/${user.user_id}`, {
                    headers: {
                      Authorization: `Bearer ${user.token}`,
                    },
                  })
                  .then((res) => {
                    //console.log(res.data.FinalExamQuestions);
                    var doneUntil = res.data.FinalExamQuestions.findIndex(
                      (s) => s.id == question_id
                    );
                    console.log("chapter id:" + chapter_id);
                    console.log("Question : " + question_id);
                    console.log("GOTO Question: " + doneUntil);
                    var array = [];

                    ////initialized local question status array
                    for (
                      let i = 0;
                      i < Object.values(res.data.FinalExamQuestions).length;
                      i++
                    ) {
                      array.push({
                        question: i,
                        status: null,
                      });
                    } ///end
                    dispatch(emptyCounters()); //reset counters
                    dispatch(setPagingStatus(array)); //pushing status array with all null

                    navigation.push("FinalQuizScreen", {
                      quizData: res.data,
                      // chapterName: chapterName,
                      // id,
                      doneUntil,
                      qID:
                        res.data.FinalExamQuestions[
                          doneUntil == -1 ? 0 : doneUntil
                        ].id,
                    });
                  });
              } catch (error) {
                console.log(error);
              }
            }}
          >
            <Ionicons
              name="arrow-forward-circle"
              size={30}
              color="#418bca"
              style={{ alignSelf: "center", marginTop: 5 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RenderOverView;

const styles = StyleSheet.create({
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
