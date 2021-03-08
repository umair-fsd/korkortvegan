import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from "react-native";
import {
  AntDesign,
  Feather,
  Octicons,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";
import { COLORS, SIZES } from "../constants";
import CartItems from "../components/CartItems";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react/cjs/react.development";

const Cart = ({ navigation }) => {
  ///Redux Selector////
  const cartItems = useSelector((state) => state.cart);
  console.log(cartItems);
  const [tempstate, setTempState] = useState({
    title: "Pot Title",
    image: require("../../assets/pot.jpg"),
    price: 135,
    qty: 2,
  });

  const renderHeader = () => {
    return (
      <SafeAreaView
        style={{
          marginTop: StatusBar.currentHeight + 30,
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 20,
        }}
      >
        <View>
          <TouchableOpacity onPress={() => navigation.push("Home")}>
            <Ionicons name="arrow-back" size={30} color="black" />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Ionicons name="cart" size={30} color="black" />
          <Text style={{ fontSize: SIZES.h2 }}>Cart</Text>
        </View>
        <View></View>
      </SafeAreaView>
    );
  };
  const renderCart = () => {
    const renderItem = ({ item }) => (
      <CartItems
        title={item.title}
        image={item.image}
        price={item.price}
        qty={item.qty}
      />
    );
    return (
      <>
        <FlatList
          showsVerticalScrollIndicator={false}
          key={"_"}
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.price}
        />
      </>
    );
  };
  const renderTotal = () => {
    return (
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
        <View
          style={{
            backgroundColor: "#fbd01f",
            alignSelf: "flex-end",
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Text
            style={{
              fontSize: SIZES.h2,
              fontWeight: "300",
              paddingVertical: 10,
            }}
          >
            Rs.332
          </Text>
          <Text
            style={{
              fontSize: SIZES.h2,
              fontWeight: "300",
              paddingVertical: 10,
              marginLeft: 100,
            }}
          >
            Confirm Order
          </Text>
          <AntDesign
            style={{ fontWeight: "300", marginLeft: -30, paddingVertical: 10 }}
            name="arrowright"
            size={30}
            color="black"
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {renderHeader()}
      {renderCart()}

      {renderTotal()}
    </SafeAreaView>
  );
};

export default Cart;

const styles = StyleSheet.create({});
