import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
} from "react-native";
import axios from "axios";
import { SIZES, COLORS } from "../../constants";
import { useNavigation } from "@react-navigation/native";

const Chapter = ({ chapterName, id }) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        backgroundColor: COLORS.primary,
        margin: 5,
        paddingVertical: 15,
        marginHorizontal: 20,
        borderRadius: 15,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Text
        style={{
          padding: 5,
          color: COLORS.white,
          marginLeft: 10,
          fontSize: SIZES.h2,
          width: 150,
        }}
      >
        {chapterName}
      </Text>
      <TouchableOpacity
        onPress={() => {
          try {
            axios
              .get(
                `https://stssodra.dimitris.in/api/chaptersWithQuestions/${id}?email=admin@admin.com&password=admin`
              )
              .then((res) => {
                // console.log(res.data);
                navigation.push("QuizScreen", {
                  quizData: res.data,
                  chapterName: chapterName,
                  id,
                  qID: res.data.chaptersWithQuestions[0].id,
                });
              });
          } catch (error) {
            // alert("Server is not responding, Please try again later");
          }
        }}
      >
        <Text
          style={{
            marginRight: 10,
            backgroundColor: COLORS.white,
            padding: 8,
            borderRadius: 5,
          }}
        >
          Start Test
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const RenderChapters = ({ navigation }) => {
  const [chapters, setChapters] = useState("");
  useEffect(() => {
    getChaptersAsync();
  }, []);
  const getChaptersAsync = async () => {
    await axios
      .get(
        "https://stssodra.dimitris.in/api/getChapters?email=admin@admin.com&password=admin"
      )
      .then((res) => {
        setChapters(res.data);
        //console.log(chapters.allChapters);
      });
  };
  const renderItem = ({ item }) => (
    <Chapter chapterName={item.chapterName} id={item.id} />
  );

  return (
    <View style={{ flex: 1 }}>
      {chapters === "" ? (
        <ActivityIndicator size={"large"} color={"red"} />
      ) : (
        <FlatList
          data={chapters.allChapters}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

export default RenderChapters;

const styles = StyleSheet.create({
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
});
