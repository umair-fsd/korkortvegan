import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TextInput,
} from "react-native";
import { Button } from "react-native-paper";

import { COLORS, SIZES } from "../constants/";

const Login = () => {
  const renderLoginForm = () => {
    return (
      <>
        <View style={styles.topView}>
          <Image
            source={require("../../assets/metalogo.png")}
            style={{ marginTop: 10, width: "80%", height: 100 }}
          />
          <Text
            style={{
              color: COLORS.green,
              padding: 3,
              fontSize: SIZES.h3,
              marginTop: -8,
              marginLeft: 10,

              backgroundColor: COLORS.white,
            }}
          >
            Pakistan's Largest Plastic Pot Makers
          </Text>
        </View>
        <View style={styles.bottomView}>
          <TextInput style={styles.inputStyle} placeholder="Username" />
          <TextInput style={styles.inputStyle} placeholder="Password" />
          <Button style={styles.btnStyle} mode={"outlined"}>
            <Text style={{ color: COLORS.white, fontSize: SIZES.h2 }}>
              Login
            </Text>
          </Button>
          <Text
            style={{
              color: COLORS.green,
              marginTop: 20,
              marginRight: 20,
            }}
          >
            Forgot Password?
          </Text>
          <Text
            style={{
              color: COLORS.green,
              marginTop: 20,
              marginRight: 20,
              fontWeight: "bold",
            }}
          >
            Create An Account
          </Text>
        </View>
      </>
    );
  };
  return renderLoginForm();
};

export default Login;

const styles = StyleSheet.create({
  topView: {
    flex: 1,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  headingStyle: { fontSize: SIZES.h1, color: COLORS.white, fontWeight: "300" },
  ////////Bottom View///////
  bottomView: {
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    flex: 2,

    alignItems: "center",
  },
  inputStyle: {
    borderColor: 1,
    borderWidth: 1,
    borderColor: COLORS.green,
    padding: 10,
    width: Dimensions.get("window").width / 1.2,
    fontSize: SIZES.h3,
    margin: 10,
    borderRadius: 10,
  },
  btnStyle: {
    marginTop: 10,
    padding: 5,
    width: Dimensions.get("window").width / 1.5,
    borderRadius: 10,
    backgroundColor: COLORS.green,
    tintColor: "white",
  },
});
