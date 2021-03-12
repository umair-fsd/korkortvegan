import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { SIZES, COLORS } from "../../constants";
import { Header as HeaderTop, Title } from "native-base";

const Header = () => {
  return (
    <HeaderTop
      style={{ backgroundColor: "white" }}
      androidStatusBarColor={COLORS.primary}
    >
      <Text
        style={{
          fontSize: SIZES.h1,
          alignSelf: "center",
          fontWeight: "bold",
          color: COLORS.primary,
        }}
      >
        Quizes
      </Text>
    </HeaderTop>
    // <View
    //   style={{
    //     marginTop: StatusBar.currentHeight + 30,
    //     flexDirection: "row",
    //     justifyContent: "space-between",
    //     marginHorizontal: 20,
    //   }}
    // >
    //   <View>
    //     <Text style={{ fontSize: SIZES.h2, fontWeight: "bold" }}>
    //       Welcome To
    //     </Text>
    //     <Text
    //       style={{
    //         fontSize: SIZES.h1 + 10,
    //         color: COLORS.green,
    //         marginTop: 3,
    //         fontWeight: "bold",
    //       }}
    //     >
    //       Metaplas
    //     </Text>
    //   </View>
    //   <TouchableOpacity>
    //     <View></View>
    //   </TouchableOpacity>
    // </View>
  );
};

export default Header;

const styles = StyleSheet.create({});
