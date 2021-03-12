import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Home,
  Profile,
  Login,
  QuizScreen,
  ResultScreen,
  ProgressScreen,
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
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={"Progress"}
        >
          <Stack.Screen name="Home" component={Tabs} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="QuizScreen" component={QuizScreen} />
          <Stack.Screen name="Results" component={ResultScreen} />
          <Stack.Screen name="Progress" component={ProgressScreen} />

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
