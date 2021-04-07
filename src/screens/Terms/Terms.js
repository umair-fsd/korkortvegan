import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
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
  const [terms, setTerms] = useState("");
  const [searchData, setSearchData] = useState("");
  const handleSearch = (value) => {
    const newData = searchData.termList.filter((item) => {
      const itemData = ` ${item.title.toUpperCase()} ${item.desc}`;

      const textData = value.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    setTerms({
      termList: newData,
    });
  };
  const fetchTerms = async () => {
    await axios
      .get(`${webURL}/api/getTerms`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        Object.keys(res.data).length == 0 ? setNoData(true) : setNoData(nodata);
        setTerms(res.data);
        setSearchData(res.data);
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
    fetchTerms();
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
        <View style={{ flex: 1 }}>
          <View>
            <TextInput
              onChangeText={(value) => {
                handleSearch(value);
              }}
              style={{
                borderWidth: 1,
                width: "80%",
                alignSelf: "center",
                marginVertical: 10,
                fontSize: SIZES.h2,
                padding: 10,
                borderRadius: 10,
                borderColor: COLORS.primary,
                color: COLORS.primary,
              }}
              placeholder={"Search"}
            />
          </View>
          <FlatList
            data={terms.termList}
            keyExtractor={(item) => item.id.toString()}
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
            No Saved Terms...
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
