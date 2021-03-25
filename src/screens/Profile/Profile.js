import React, { useState, useEffect } from "react";
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
import { useDispatch, useSelector, webURL } from "react-redux";

import { FontAwesome } from "@expo/vector-icons";

/////TEMP IMPORTS

const Profile = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const user = useSelector((state) => state.user);
  const webURL = useSelector((state) => state.webURL);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(user.token);
  }, []);
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
          <TextInput
            editable={false}
            style={styles.inputStyle}
            placeholder="Old Password"
            onChangeText={(v) => {
              setEmail(v);
            }}
          />
          <TextInput
            editable={false}
            secureTextEntry
            style={styles.inputStyle}
            placeholder="New Password"
            onChangeText={(v) => {
              setPassword(v);
            }}
          />
          <TextInput
            editable={false}
            secureTextEntry
            style={styles.inputStyle}
            placeholder="Confirm New Password"
            onChangeText={(v) => {
              setPassword(v);
            }}
          />
          <Button style={styles.btnStyle} mode={"outlined"} disabled>
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
                .then((res) => {
                  console.log(res);
                  alert("Logged Out");
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
