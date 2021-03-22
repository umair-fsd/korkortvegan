import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { SIZES, COLORS } from "../../constants";
import { Header as HeaderTop, Title, Left, Right } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { setProgress, emptyProgress, emptyCounters } from "../../redux/actions";

const Header = ({ navigation }) => {
  const dispatch = useDispatch();

  return (
    <HeaderTop
      style={{
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      androidStatusBarColor={COLORS.primary}
    >
      <Left>
        <Ionicons
          name="home-sharp"
          size={24}
          color={COLORS.primary}
          onPress={() => {
            dispatch(emptyProgress());
            dispatch(emptyCounters());

            navigation.reset({
              routes: [{ name: "Home" }],
            });
          }}
        />
      </Left>
      <Title style={{ alignSelf: "center", marginLeft: 50 }}>
        <Text
          style={{
            fontSize: SIZES.h1,
            fontWeight: "300",
            color: COLORS.primary,
          }}
        >
          Your Result
        </Text>
      </Title>
      <Right></Right>
    </HeaderTop>
  );
};

export default Header;

const styles = StyleSheet.create({});
