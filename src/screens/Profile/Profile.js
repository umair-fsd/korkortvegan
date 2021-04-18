import React, { useState, useEffect } from "react";
import qs from "qs";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TextInput,
} from "react-native";
import { Button } from "react-native-paper";
import { COLORS, SIZES } from "../../constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { FontAwesome, Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

/////TEMP IMPORTS

const Profile = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [toggleView, setToggleView] = useState(false);
  const user = useSelector((state) => state.user);
  const webURL = useSelector((state) => state.webURL);
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  const changePassword = async () => {
    if (oldPassword == "" || newpassword == "" || cpassword == "") {
      alert("Pleasae Fill All Fields!");
    } else if (cpassword !== newpassword) {
      alert("New Password & Confirm Password does not match!");
    } else if (newpassword.length < 6 || cpassword.length < 6) {
      alert("The new password must be at least 6 characters! ");
    } else if (oldPassword == newpassword) {
      alert("New Password Must Be Different From Old Password!");
    } else {
      await axios({
        method: "put",
        url: `${webURL}/api/changePassword/${user.user_id}`,
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: qs.stringify({
          old_password: oldPassword,
          new_password: newpassword,
          confirm_password: cpassword,
        }),
      })
        .then((res) => {
          //  console.log(q + "=>" + a);
          alert(res.data.message);
          setOldPassword("");
          setNewPassword("");
          setCPassword("");
        })
        .catch((err) => {
          console.log("Error", err.response);
        });
    }
  };
  const renderProfile = () => {
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
            }}
          >
            <FontAwesome name="user-circle-o" size={100} color="white" />
          </Text>
          <Text
            style={{ fontSize: SIZES.h1, color: "white", fontWeight: "bold" }}
          >
            {user.firstName + " " + user.lastName}
          </Text>
          <Text
            style={{ fontSize: SIZES.h3, color: "white", fontWeight: "300" }}
          >
            {user.email}
          </Text>
        </View>
        <View style={styles.bottomView}>
          <TouchableOpacity
            onPress={() => {
              setToggleView(!toggleView);
            }}
          >
            <View
              style={{
                width: 300,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather
                style={{
                  alignSelf: "flex-end",
                }}
                name={toggleView == true ? "eye" : "eye-off"}
                size={24}
                color={COLORS.primary}
              />
              <Text style={{ color: COLORS.primary, left: 10 }}>
                {toggleView == true ? "Show Passwords" : "Hide Passwords"}
              </Text>
            </View>
          </TouchableOpacity>

          <TextInput
            secureTextEntry={toggleView}
            style={styles.inputStyle}
            placeholder="Old Password"
            value={oldPassword}
            onChangeText={(v) => {
              setOldPassword(v);
            }}
          />
          <TextInput
            secureTextEntry={toggleView}
            style={styles.inputStyle}
            placeholder="New Password"
            value={newpassword}
            onChangeText={(v) => {
              setNewPassword(v);
            }}
          />
          <TextInput
            secureTextEntry={toggleView}
            style={styles.inputStyle}
            placeholder="Confirm New Password"
            value={cpassword}
            onChangeText={(v) => {
              setCPassword(v);
            }}
          />
          <Button
            style={styles.btnStyle}
            mode={"outlined"}
            onPress={changePassword}
          >
            <Text style={{ color: COLORS.white, fontSize: SIZES.h3 }}>
              Change Password
            </Text>
          </Button>

          <Button
            style={styles.btnLogOutStyle}
            mode={"outlined"}
            onPress={async () => {
              await axios
                .get(`${webURL}/api/logout/${user.user_id}`, {
                  headers: {
                    Authorization: `Bearer ${user.token}`,
                  },
                })
                .then(async (res) => {
                  console.log(res);
                  alert("Logged Out");
                  try {
                    await AsyncStorage.removeItem("@token");
                    await AsyncStorage.removeItem("@user_id");
                    await AsyncStorage.removeItem("@user_email");
                  } catch (e) {
                    // remove error
                  }

                  console.log("Done.");
                  navigation.reset({
                    routes: [{ name: "Login" }],
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            <Text style={{ color: COLORS.white, fontSize: SIZES.h3 }}>
              Log Out
            </Text>
          </Button>
        </View>
      </>
    );
  };
  return renderProfile();
};

export default Profile;

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
  btnLogOutStyle: {
    marginTop: 10,
    padding: 5,
    width: Dimensions.get("window").width / 1.5,
    borderRadius: 10,
    backgroundColor: "#e74c3c",
    tintColor: "white",
  },
});
