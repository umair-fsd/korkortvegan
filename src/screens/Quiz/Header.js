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

const Header = ({ title }) => {
  return (
    <HeaderTop
      style={{ backgroundColor: "white" }}
      androidStatusBarColor={COLORS.primary}
    >
      <Text
        style={{
          fontSize: SIZES.h2,
          alignSelf: "center",
          fontWeight: "300",
          color: COLORS.primary,
        }}
      >
        {title}
      </Text>
    </HeaderTop>
  );
};

export default Header;

const styles = StyleSheet.create({});
