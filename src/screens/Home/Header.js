import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { SIZES, COLORS } from "../../constants";
import { Header as HeaderTop, Title, Left, Right } from "native-base";
import axios from "axios";
import { useSelector } from "react-redux";

const Header = ({ navigation }) => {
  const webURL = useSelector((state) => state.webURL);
  const user = useSelector((state) => state.user);
  return (
    <HeaderTop
      style={{
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
      }}
      androidStatusBarColor={COLORS.primary}
    >
      <Left style={{ flex: 1 }}></Left>
      <Text
        style={{
          flex: 1,
          fontSize: SIZES.h1,
          alignSelf: "center",
          fontWeight: "bold",
          color: COLORS.primary,
        }}
      >
        Quizes
      </Text>
      <Right>
        <TouchableOpacity
          onPress={() => {
            try {
              axios
                .get(webURL + `/api/getFinalExamQuestions/${user.user_id}`, {
                  headers: {
                    Authorization: `Bearer ${user.token}`,
                  },
                })
                .then((res) => {
                  console.log(res.data);
                  navigation.push("FinalQuizScreen", {
                    quizData: res.data,
                    // id,
                    qID: res.data.FinalExamQuestions[0].id,
                  });
                });
            } catch (error) {
              alert("Server is not responding, Please try again later");
            }
          }}
        >
          <Text
            style={{
              width: 100,
              textAlign: "center",
              alignSelf: "flex-end",
              fontSize: SIZES.h3,
              backgroundColor: COLORS.primary,
              padding: 10,
              borderRadius: 10,
              color: COLORS.white,
              fontWeight: "bold",
            }}
          >
            Final Test
          </Text>
        </TouchableOpacity>
      </Right>
    </HeaderTop>
  );
};

export default Header;

const styles = StyleSheet.create({});
