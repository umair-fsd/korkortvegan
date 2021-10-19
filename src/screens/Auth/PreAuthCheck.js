import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Button,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initUser, emptyCounters, setPagingStatus } from "../../redux/actions";
import { COLORS, SIZES } from "../../constants";

const PreAuthCheck = ({ navigation }) => {
  const webURL = useSelector((state) => state.webURL);
  const [token, setToken] = useState("");
  const [user_id, setUserID] = useState("");
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (user_id !== "") {
      checkAuth();
    }
  }, [user_id]);

  ///Get Local Stored Token / User ID///

  const getData = async () => {
    try {
      const localToken = await AsyncStorage.getItem("@token");
      const localUser_id = await AsyncStorage.getItem("@user_id");
      const localemail = await AsyncStorage.getItem("@user_email");
      if (localToken !== null && user_id !== null) {
        // value previously stored
        setToken(localToken);
        setUserID(parseInt(localUser_id));
        setEmail(parseInt(localemail));
      } else {
        console.log("No Data Available");
        navigation.reset({
          routes: [{ name: "Login" }],
        });
      }
    } catch (e) {
      console.log("Error Fetching Data");
    }
  };

  const checkAuth = async () => {
    await axios
      .get(`${webURL}/api/checkToken/${user_id},`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.status);

        if (res.data) {
          dispatch(
            initUser({
              user_id,
              token,
              email,
              firstName: "John",
              lastName: "Doe",
            })
          );
          navigation.reset({
            routes: [{ name: "Home" }],
          });
        } else {
          console.log("User Not Authenticated");
          navigation.reset({
            routes: [{ name: "Login" }],
          });
        }
      })
      .catch((err) => {
        console.log(err.response.status);
        // if (err.response.status == 401) {
        navigation.reset({
          routes: [{ name: "Login" }],
        });
        //   console.log(err.response.data.message);
        // }
      });
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size={"large"} color={COLORS.primary} />
      <Text
        style={{
          textAlign: "center",
          color: COLORS.primary,
          fontSize: SIZES.h2,
        }}
      >
        Authenticating
      </Text>
    </View>
  );
};

export default PreAuthCheck;

const styles = StyleSheet.create({});
