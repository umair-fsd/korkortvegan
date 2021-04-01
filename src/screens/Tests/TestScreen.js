import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { RadioButton } from "react-native-paper";

const MyComponent = () => {
  const [checked, setChecked] = React.useState("first");

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
      }}
    >
      <Text>Option 1</Text>
      <RadioButton.Group>
        <RadioButton.Item value="first" onPress={() => console.log(checked)} />

        <RadioButton value="second" onPress={() => setChecked("second")} />
      </RadioButton.Group>
    </View>
  );
};

export default MyComponent;
