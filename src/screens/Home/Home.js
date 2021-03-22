import React, { useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "./Header";
import RenderChapters from "./RenderChapters";

const Home = () => {
  const navigation = useNavigation();
  ////UseEffect////

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <RenderChapters navigation={navigation} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
