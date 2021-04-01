import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Header } from "native-base";
import { List } from "react-native-paper";
import { COLORS, SIZES } from "../../constants";
import { useSelector } from "react-redux";
import axios from "axios";
import { Ionicons, Entypo } from "@expo/vector-icons";

const Terms = () => {
  const user = useSelector((state) => state.user);
  const webURL = useSelector((state) => state.webURL);
  const [loading, setLoading] = useState(true);
  const [nodata, setNoData] = useState(false);
  const [savedQuestions, setSavedQuestions] = useState("");
  const termsData = [
    {
      id: 1,
      title: "First Title",
      desc: "A Quick Brown Fox Jumps Over The Lazy Dog",
    },
    {
      id: 2,
      title: "Second Title",
      desc: "A Quick Brown Fox Jumps Over The Lazy Dog",
    },
    {
      id: 3,
      title: "Third Title",
      desc: "A Quick Brown Fox Jumps Over The Lazy Dog",
    },
    {
      id: 4,
      title: "Fourth Title",
      desc: "A Quick Brown Fox Jumps Over The Lazy Dog",
    },
  ];

  const fetchSavedQuerstions = async () => {
    await axios
      .get(`${webURL}/api/getTerms`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        Object.keys(res.data).length == 0 ? setNoData(true) : setNoData(nodata);
        setSavedQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setNoData(true);
      });
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardStyle}>
      <List.AccordionGroup>
        <List.Accordion
          descriptionNumberOfLines={50}
          titleStyle={{ fontSize: SIZES.h3 }}
          title={item.title}
          id="1"
          left={(props) => (
            <List.Icon {...props} icon="information" color={COLORS.primary} />
          )}
        >
          <Text>{item.desc}</Text>
        </List.Accordion>
      </List.AccordionGroup>
    </View>
  );

  useEffect(() => {
    fetchSavedQuerstions();
    // console.log(savedQuestions.termList);
  }, []);
  return (
    <View style={styles.container}>
      <Header
        style={{ backgroundColor: COLORS.primary }}
        androidStatusBarColor={COLORS.primary}
      >
        <Text
          style={{
            width: 300,
            textAlign: "center",
            color: COLORS.white,
            fontSize: SIZES.h2,
            alignSelf: "center",
          }}
        >
          Terms
        </Text>
      </Header>
      {loading == true ? (
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator color={COLORS.primary} size={"large"} />
          <Text
            style={{
              width: 200,
              textAlign: "center",

              color: COLORS.primary,
              fontSize: SIZES.h2,
              margin: 0,
            }}
          >
            Loading
          </Text>
        </View>
      ) : nodata == false ? (
        <View>
          <FlatList
            data={termsData}
            keyExtractor={(item, index) => item.title}
            renderItem={renderItem}
          />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              width: 300,
              textAlign: "center",

              color: COLORS.primary,
              fontSize: SIZES.h2,
              margin: 0,
            }}
          >
            No Saved Questions...
          </Text>
        </View>
      )}
    </View>
  );
};

export default Terms;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  cardStyle: {
    marginVertical: 3,
    flex: 1,
    backgroundColor: "white",
    padding: 5,
    borderRadius: 10,

    margin: 10,
    //box Shaddow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});
