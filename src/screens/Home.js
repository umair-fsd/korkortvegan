import React from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Input, Item, Icon } from "native-base";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";

import { COLORS, SIZES, dummyData } from "../constants/";
import { Product } from "../components";
import { useSelector, useDispatch } from "react-redux";

const Home = ({ navigation }) => {
  const cartQty = useSelector((state) => state.cart);
  const Products = useSelector((state) => state.products);
  console.log(Products);
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
          <Text style={{ fontSize: SIZES.h2, fontWeight: "bold" }}>
            Welcome To
          </Text>
          <Text
            style={{
              fontSize: SIZES.h1 + 10,
              color: COLORS.green,
              marginTop: 3,
              fontWeight: "bold",
            }}
          >
            Metaplas
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Cart");
          }}
        >
          <View>
            {Object.keys(cartQty).length >= 1 ? (
              <Text
                style={{
                  position: "absolute",
                  marginLeft: 0,
                  marginTop: 17,
                  fontSize: 12,
                  backgroundColor: COLORS.green,
                  color: COLORS.white,
                  padding: 3,
                  borderRadius: 30,
                  zIndex: 999,
                  fontWeight: "bold",
                  paddingHorizontal: 7,
                }}
              >
                {cartQty ? Object.keys(cartQty).length : 0}
              </Text>
            ) : null}

            <Ionicons name="cart" size={40} color="black" />
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    );
  };
  const renderSearch = () => {
    return (
      <View
        style={{
          marginTop: 15,
          flexDirection: "row",
          justifyContent: "center",

          height: 50,
          marginBottom: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "rgba(255,255,255,0.8)",
            borderRadius: 10,
            padding: 5,
            marginHorizontal: 5,
            height: 50,
          }}
        >
          <Ionicons
            name="search"
            size={24}
            color="black"
            style={{ alignSelf: "center", marginRight: 5 }}
          />
          <TextInput
            placeholder={"Search"}
            style={{
              width: 250,
              marginRight: 5,
            }}
          />
        </View>
        <View
          style={{
            backgroundColor: COLORS.green,
            paddingVertical: 5,
            paddingHorizontal: 8,
            justifyContent: "center",

            borderRadius: 10,
            height: 50,
          }}
        >
          <TouchableOpacity>
            <SimpleLineIcons name="equalizer" size={30} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const renderProducts = () => {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        onPress={() => {
          navigation.push("ProductDetail");
        }}
      >
        <Product title={item.title} price={item.price} image={item.image} />
      </TouchableOpacity>
    );
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <FlatList
          columnWrapperStyle={{
            alignSelf: "center",
          }}
          showsVerticalScrollIndicator={false}
          key={"_"}
          data={Products}
          numColumns={2}
          renderItem={renderItem}
          keyExtractor={(item) => item.price}
        />
      </View>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      {renderHeader()}
      {renderSearch()}

      {renderProducts()}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
