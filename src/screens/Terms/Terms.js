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
import { Header, Right } from "native-base";
import { List } from "react-native-paper";
import { COLORS, SIZES } from "../../constants";
import { useSelector } from "react-redux";
import axios from "axios";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { AlphabetList } from "react-native-section-alphabet-list";

const Terms = () => {
  const [reset, setReset] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [alphabet, setAlphabet] = useState("");
  const user = useSelector((state) => state.user);
  const webURL = useSelector((state) => state.webURL);
  const [loading, setLoading] = useState(true);
  const [nodata, setNoData] = useState(false);
  const [terms, setTerms] = useState("");
  const [searchData, setSearchData] = useState("");
  const [key, setKey] = useState(0);
  let letters = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");
  const handleAlphabetSearch = (value) => {
    const newData = searchData.termList.filter((item) => {
      const itemData = ` ${item.title.charAt(0).toUpperCase()}`;

      const textData = value.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    setTerms({
      termList: newData,
    });
  };
  const handleSearch = (value) => {
    const newData = searchData.termList.filter((item) => {
      const itemData = ` ${item.title.toUpperCase()}`;

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

  const renderAlphabates = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        if (item !== alphabet) {
          setAlphabet(item);

          handleAlphabetSearch(alphabet);
          setKey(key + 1);
          setReset(true);
        } else {
          setInputValue("");
          setAlphabet("");
          handleSearch("");
          setReset(false);
        }
      }}
    >
      <View
        style={{
          ...styles.cardStyle,
          padding: 5,
          borderRadius: 30,
          backgroundColor: alphabet == item ? COLORS.primary : "white",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: alphabet == item ? COLORS.white : "black",
          }}
        >
          {item}
        </Text>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    fetchTerms();
  }, []);
  useEffect(() => {
    !alphabet == "" ? handleAlphabetSearch(alphabet) : null;
  }, [alphabet]);
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
            right: -50,
          }}
        >
          Terms
        </Text>

        <View
          style={{
            width: 100,
            justifyContent: "center",
            alignItems: "center",
            right: 20,
          }}
        >
          {/* <TouchableOpacity
            onPress={() => {
              setInputValue("");
              setAlphabet("");
              handleSearch("");
            }}
          >
            <Text
              style={{
                color: "red",
                backgroundColor: "white",
                padding: 4,
                borderRadius: 5,
              }}
            >
              Clear Filter
            </Text>
          </TouchableOpacity> */}
        </View>
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
              value={inputValue}
              onChangeText={(value) => {
                setInputValue(value);
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
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={{ flex: 2 }}>
              <FlatList
                data={terms.termList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                key={key}
                showsVerticalScrollIndicator={false}
              />
            </View>
            <View style={{ flex: 0.3 }}>
              <FlatList
                data={letters}
                keyExtractor={(item) => item}
                renderItem={renderAlphabates}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
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
