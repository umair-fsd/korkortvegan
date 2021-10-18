import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Button } from "react-native-paper";
import { COLORS, SIZES } from "../../constants";
import axios from "axios";
import { useDispatch, useSelector, webURL } from "react-redux";
import { initUser, emptyCounters, setPagingStatus } from "../../redux/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";

/////TEMP IMPORTS

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [isdisabled, setIsDisabled] = useState(true);
  const [password, setPassword] = useState("");
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const webURL = useSelector((state) => state.webURL);
  const dispatch = useDispatch();
  const renderLoginForm = () => {
    useEffect(() => {
      demoLogin();
    }, []);
    const demoLogin = async () => {
      await axios
        .post(`${webURL}/api/login`, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          email: "demo@user.com",
          password: "khs8AADJYZ",
        })
        .then(async (res) => {
          //console.log(res.status);
          res.status == 200 ? console.log("Demo Account Logged In") : null;
          dispatch(
            initUser({
              user_id: res.data.user_id,
              token: res.data.token,
              email,
              firstName: "John",
              lastName: "Doe",
            })
          );
          setIsDisabled(false);
        });
    };

    ////Store Token and User_ID to Local Storage///
    const storeData = async (token, user_id, email) => {
      try {
        await AsyncStorage.setItem("@token", token);
        await AsyncStorage.setItem("@user_id", user_id.toString());
        await AsyncStorage.setItem("@user_email", email);
      } catch (e) {
        // saving error
      }
    };
    return (
      <>
        <View style={styles.topView}>
          {/* <Image
            source={require("../../assets/metalogo.png")}
            style={{ marginTop: 10, width: "80%", height: 100 }}
          /> */}
          <Text
            style={{
              color: COLORS.primary,
              padding: 5,
              fontSize: SIZES.h1,
              marginTop: -8,
              marginLeft: 10,

              backgroundColor: COLORS.white,
            }}
          >
            korkortvegan
          </Text>
        </View>
        <View style={styles.bottomView}>
          <TextInput
            style={styles.inputStyle}
            placeholder="Email"
            onChangeText={(v) => {
              setEmail(v);
            }}
          />
          <TextInput
            secureTextEntry
            style={styles.inputStyle}
            placeholder="Password"
            onChangeText={(v) => {
              setPassword(v);
            }}
          />
          {loading == true ? (
            <ActivityIndicator size={"large"} color={COLORS.primary} />
          ) : null}
          <Button
            style={styles.btnStyle}
            mode={"outlined"}
            onPress={async () => {
              if (email == "") {
                alert("Email Cannot Be Empty!");
              } else if (password == "") {
                alert("Password Cannot Be Empty");
              } else {
                setLoading(true);
                await axios
                  .post(`${webURL}/api/login`, {
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                    email,
                    password,
                  })
                  .then((res) => {
                    if (res.data.active == 0) {
                      alert(res.data.error);
                      setLoading(false);
                      return;
                    }
                    res.status == 200 ? alert("Welcome") : null;

                    dispatch(
                      initUser({
                        user_id: res.data.user_id,
                        token: res.data.token,
                        email,
                        firstName: res.data.first_name,
                        lastName: res.data.last_name,
                      })
                    );
                    //Store Data To Local
                    storeData(res.data.token, res.data.user_id, email);
                    setEmail("");
                    setPassword("");
                    setLoading(false);
                    navigation.reset({
                      routes: [{ name: "Home" }],
                    });
                  })
                  .catch((err) => {
                    setLoading(false);
                    console.log(err.response.status);
                    alert("Invalid Username / Password");
                  });
              }
            }}
          >
            <Text style={{ color: COLORS.white, fontSize: SIZES.h3 }}>
              Login
            </Text>
          </Button>

          <Button
            disabled={isdisabled}
            style={{
              ...styles.btnStyle,
              backgroundColor: isdisabled == true ? "grey" : COLORS.primary,
            }}
            mode={"outlined"}
            onPress={async () => {
              setLoading(true);
              await axios
                .get(webURL + `/api/getDemoQuestions`, {
                  headers: {
                    Authorization: `Bearer ${user.token}`,
                  },
                })
                .then((res) => {
                  ////initialized local question status array
                  console.log(res.data);
                  var array = [];
                  for (
                    let i = 0;
                    i < Object.values(res.data.DemoQuestions).length;
                    i++
                  ) {
                    array.push({
                      question: res.data.DemoQuestions[i].id,
                      status: null,
                    });
                  } ///end
                  dispatch(emptyCounters()); //reset counters
                  dispatch(setPagingStatus(array)); //pushing status array with all null
                  setLoading(false);
                  res.data.DemoQuestions[0].id;
                  navigation.push("DemoQuizScreen", {
                    quizData: res.data,
                    qID: res.data.DemoQuestions[0].id,
                  });
                })
                .catch((err) => {
                  console.log(err);
                  // alert("Invalid Username / Password");
                });
            }}
          >
            <Text style={{ color: COLORS.white, fontSize: SIZES.h3 }}>
              Try Now!
            </Text>
          </Button>

          <Text
            style={{
              color: COLORS.primary,
              marginTop: 20,
              marginRight: 20,
            }}
          >
            Forgot Password?
          </Text>
          <Text
            style={{
              color: COLORS.primary,
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
    backgroundColor: COLORS.primary,
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
    borderColor: COLORS.primary,
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
    backgroundColor: COLORS.primary,
    tintColor: "white",
  },
});
