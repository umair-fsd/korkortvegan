import React from "react";
import { StyleSheet, Text, View } from "react-native";

import ImageModal from "react-native-image-modal";
const TestScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: "red",
        alignSelf: "center",
      }}
    >
      <ImageModal
        resizeMode="contain"
        imageBackgroundColor="#000000"
        style={{
          width: 250,
          height: 250,
        }}
        source={{
          uri: "https://cdn.pixabay.com/photo/2019/07/25/18/58/church-4363258_960_720.jpg",
        }}
      />
    </View>
  );
};

export default TestScreen;

const styles = StyleSheet.create({});
