import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  FlatList,
} from "react-native";
import {
  Container,
  Header,
  Content,
  ListItem,
  Radio,
  Right,
  Left,
} from "native-base";
import { RadioButton } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import {
  setPagingStatus,
  updatePagingStatus,
  setProgress,
  emptyProgress,
} from "../../redux/actions";

let testProgress = 5;

const TestScreen = () => {
  const arrayLength = 70;
  const dispatch = useDispatch();
  const userProgress = useSelector((state) => state.userProgress);
  const [value, setValue] = React.useState("");
  const [renderKey, setRenderKey] = useState(0);
  var testProgress = [
    {
      5: "sd",
      4: "dfds",
      7: "dsfs",
      55: "sdfs",
      78: "sdfs",
    },
  ];

  useEffect(() => {}, []);
  const btnPress = () => {
    dispatch(
      setProgress({
        9: null,
      })
    );
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TextInput
        style={{ borderWidth: 1, width: 300, padding: 20 }}
        onChangeText={(value) => {
          setValue({
            Color: value,
          });
        }}
      />
      <Button
        title={"Init Value"}
        onPress={() => {
          // console.log(array);
          dispatch(
            setProgress({
              7: "testValue",
            })
          );
        }}
      />
      <Button title={"Push Value"} onPress={btnPress} />
      <Button
        title={"Empty Progress"}
        onPress={() => dispatch(emptyProgress())}
      />
      <Button
        title={"Show Status"}
        onPress={() => {
          //console.log(userProgress)
          var keys = Object.keys(testProgress[0]);
          var values = Object.values(testProgress[0]);
          console.log(userProgress);
          // //  console.log(keys);
          // keys.forEach((v, i) => {
          //   v == 5 ? console.log("Yes") : console.log("No");
          //   console.log(i);
          // });
        }}
      />
    </View>
  );
};

export default TestScreen;

const styles = StyleSheet.create({});
