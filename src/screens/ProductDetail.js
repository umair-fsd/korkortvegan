import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
} from "react-native";
import { COLORS, SIZES, dummyData } from "../constants/";
import {
  Ionicons,
  SimpleLineIcons,
  Octicons,
  Feather,
} from "@expo/vector-icons";
import { set } from "react-native-reanimated";

const ProductDetail = (props) => {
  const [qty, setqty] = useState(1);
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
          <TouchableOpacity onPress={() => props.navigation.push("Home")}>
            <Ionicons name="arrow-back" size={30} color="black" />
          </TouchableOpacity>
        </View>
        <View>
          <Ionicons name="cart" size={30} color="black" />
        </View>
      </SafeAreaView>
    );
  };
  const renderProductImage = () => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../../assets/pot.png")}
          style={{ width: 250, height: 250 }}
        />
      </View>
    );
  };
  const renderProductInfo = () => {
    return (
      <View
        style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          flex: 1,
          margin: 20,
          padding: 10,
          borderRadius: 30,
          marginBottom: 10,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={{ fontSize: SIZES.h1, marginTop: 20 }}>
              Master Pot
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontSize: SIZES.h3,
                marginTop: 20,
                backgroundColor: COLORS.green,
                color: COLORS.white,
                padding: 10,
                borderTopLeftRadius: 20,
                borderBottomLeftRadius: 20,
                marginRight: -10,
              }}
            >
              Rs. 3000
            </Text>
          </View>
        </View>
        <Text style={{ marginTop: 20, marginLeft: 5, fontWeight: "bold" }}>
          Description
        </Text>
        <Text style={{ textAlign: "left", marginLeft: 5 }}>
          Succulent Plantis one of the most popular and beautiful species that
          will produce clumpms. The storage of water often gives succulent
          plants a more swollen or fleshy appearance than other plants, a
          characteristic known as succulence.
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 5,
            marginTop: 30,
          }}
        >
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <TouchableOpacity
              onPress={() => {
                console.log(qty);
                if (qty <= 1) {
                  setqty(1);
                } else setqty(qty - 1);
              }}
            >
              <Octicons
                name="dash"
                size={24}
                color="black"
                style={{
                  borderWidth: 1,
                  paddingHorizontal: 22,
                  borderRadius: 5,
                  paddingBottom: 3,
                }}
              />
            </TouchableOpacity>
            <Text style={{ marginHorizontal: 10, fontSize: SIZES.h2 }}>
              {qty}
            </Text>
            <TouchableOpacity
              onPress={() => {
                console.log(qty);
                setqty(qty + 1);
              }}
            >
              <Feather
                name="plus"
                size={24}
                color="black"
                style={{
                  borderWidth: 1,
                  paddingHorizontal: 20,
                  borderRadius: 5,
                }}
              />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity>
              <Text
                style={{
                  backgroundColor: COLORS.green,
                  paddingVertical: 10,
                  paddingHorizontal: 40,
                  fontSize: SIZES.h3,
                  borderRadius: 20,
                  color: COLORS.white,
                }}
              >
                Buy
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {renderHeader()}
      {renderProductImage()}
      {renderProductInfo()}
    </SafeAreaView>
  );
};

export default ProductDetail;

const styles = StyleSheet.create({});
