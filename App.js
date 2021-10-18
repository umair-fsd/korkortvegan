import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  PreAuthCheck,
  Login,
  Home,
<<<<<<< HEAD
  Profile,
  Favourites,
  QuizScreen,
  FinalQuizScreen,
  ResultScreen,
  ProgressScreen,
  FinalResultScreen,
  DemoResultScreen,
  DemoQuizScreen,
  Terms,
  TestScreen,
=======
  Login,
>>>>>>> 294ea46a4fa71a5253ed253772c528a0fb37b6ac

  ///Remove on Final Build
} from "./src/screens";

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import { Provider } from "react-redux";
import { store } from "./src/redux/store";

import Tabs from "./src/navigation/tabs";

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar hidden />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={"PreAuthCheck"}
        >
          <Stack.Screen name="Home" component={Tabs} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="PreAuthCheck" component={PreAuthCheck} />
          <Stack.Screen name="QuizScreen" component={QuizScreen} />
          <Stack.Screen name="ResultScreen" component={ResultScreen} />
          <Stack.Screen name="DemoResultScreen" component={DemoResultScreen} />
          <Stack.Screen name="Terms" component={Terms} />
          <Stack.Screen
            name="FinalResultScreen"
            component={FinalResultScreen}
          />
          <Stack.Screen name="ProgressScreen" component={ProgressScreen} />
          <Stack.Screen name="TestScreen" component={TestScreen} />
          <Stack.Screen name="FinalQuizScreen" component={FinalQuizScreen} />
          <Stack.Screen name="DemoQuizScreen" component={DemoQuizScreen} />
          <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
