import React, { useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "./Header";
import RenderChapters from "./RenderChapters";

const Home = () => {
  const navigation = useNavigation();
  ////UseEffect////

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <RenderChapters navigation={navigation} />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
