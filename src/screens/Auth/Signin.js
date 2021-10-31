import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { COLORS, SIZES } from '../../constants';
import AppHeader from '../../components/appHeader'
import InputField from './components/InputField';
import MyButton from './components/MyButton';
import axios from "axios";
import { useDispatch, useSelector, webURL } from "react-redux";
import { initUser, emptyCounters, setPagingStatus } from "../../redux/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyStatusBar from '../../components/myStatusBar';

const SignIn = ({navigation}) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [isdisabled, setIsDisabled] = useState(true);
    const [password, setPassword] = useState("");
    const user = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const webURL = useSelector((state) => state.webURL);
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
    const onSubmit=async () => {
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
            email:email.toLocaleLowerCase(),
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
    }
    return (
        <View style={styles.container}>
            <MyStatusBar 
                barStyle = "dark-content" 
                backgroundColor = {COLORS.white} 
            />
            <AppHeader 
                title={"Sign in"}
s            />
            <ScrollView 
                style={styles.flexGrow}
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}>
                <Text style={styles.txtLogin}>
                    {"Log in with your existing account."}
                </Text>
                <InputField 
                    placeholder={"E-mail"}
                    placeholderTextColor={COLORS.darkGray}
                    onChangeText={(v) => {
                        setEmail(v);
                      }}
                />
                <InputField 
                    secureTextEntry
                    placeholder={"Password"}
                    placeholderTextColor={COLORS.darkGray}
                    onChangeText={(v) => {
                        setPassword(v);
                      }}
                />
                {loading == true ? (
                    <ActivityIndicator size={"large"} color={COLORS.primary} />
                ) : null}
                <View style={styles.row}>
                    <TouchableOpacity style={styles.forgotOpacity}>
                        <Text style={styles.txtForgot}>
                          {"Forgot your password?"}
                        </Text>
                    </TouchableOpacity>
                    <MyButton
                        title={"Signin"}
                        onPress={onSubmit}
                  />
                </View> 
            </ScrollView>
        </View>
    )
    }
    return renderLoginForm();
}

export default SignIn

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:COLORS.white
    },
    flexGrow:{
        flexGrow:1
    },
    scroll:{
        flex:1
    },
    txtLogin:{
        fontSize:17,
        alignSelf:'center',
        marginVertical:50,
        color:COLORS.black
    },
    row:{
      flexDirection:'row',
      justifyContent:'space-between',
      marginHorizontal:20
    },
    forgotOpacity:{
      justifyContent:'center',
      alignItems:'center',
    },
    txtForgot:{
      fontSize:18,
      color:COLORS.green
    }
})
