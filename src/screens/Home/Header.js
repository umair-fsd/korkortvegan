import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SIZES, COLORS } from "../../constants";
import { Header as HeaderTop, Title, Left, Right } from "native-base";
import axios from "axios";
import { useSelector } from "react-redux";

const Header = ({ navigation }) => {
  const webURL = useSelector((state) => state.webURL);
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
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
            setLoading(true);
            try {
              axios
                .get(webURL + `/api/getFinalExamQuestions/${user.user_id}`, {
                  headers: {
                    Authorization: `Bearer ${user.token}`,
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
                  console.log(res.data.message);
                  setLoading(false);
                  navigation.navigate("FinalQuizScreen", {
                    quizData: res.data,
                    message: res.data.message,
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
            {loading == true ? (
              <ActivityIndicator size={"small"} color={"white"} />
            ) : (
              <Text>Final Test</Text>
            )}
          </Text>
        </TouchableOpacity>
      </Right>
    </HeaderTop>
  );
};

export default Header;

const styles = StyleSheet.create({});
