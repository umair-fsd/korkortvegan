import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
} from "react-native";
import axios from "axios";
import { SIZES, COLORS } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setPagingStatus, emptyCounters } from "../../redux/actions";
import { Ionicons, AntDesign } from '@expo/vector-icons';

const Chapter = ({ chapterName, id }) => {
  const [loading, setLoading] = useState(false);
  const [loadingResetProgress, setLoadingResetProgress] = useState(false);
  const webURL = useSelector((state) => state.webURL);
  const user = useSelector((state) => state.user);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  return (
    <View
      style={{
        backgroundColor: COLORS.primary,
        margin: 5,
        paddingVertical: 15,
        marginHorizontal: 5,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Text
        style={{
          padding: 5,
          color: COLORS.white,
          marginLeft: 10,
          fontSize: SIZES.h3,
          width: 150,
        }}
      >
        {chapterName}
      </Text>
      <TouchableOpacity
        onPress={async () => {
          setLoadingResetProgress(true);
          await axios
            .get(`${webURL}/api/resetQuestionStatus/${user.user_id}/${id}`, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              res.status == 200 ? alert("Progress reset successful! ") : null;
              setLoadingResetProgress(false);
            })
            .catch((err) => {
              setLoadingResetProgress(false);
              console.log(err);
              alert("Cannot reset the progress, Try agin later!");
            });
        }}
      >
        {loadingResetProgress == true ? (
          <ActivityIndicator
            size={"large"}
            color={COLORS.white}
            style={{ right: 10 }}
          />
        ) : (
          <Text
            style={{
              marginRight: 10,
              backgroundColor: COLORS.white,
              padding: 7,
              borderRadius: 5,
              fontSize: 11,
            }}
          >
            Reset Progress
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={async () => {
          setLoading(true);
          try {
            await axios
              .get(
                `${webURL}/api/chaptersWithQuestions/${user.user_id}/${id}`,
                {
                  headers: {
                    Authorization: `Bearer ${user.token}`,
                  },
                }
              )
              .then((res) => {
                ///check if user is Active
                if (res.data.active == 0) {
                  alert(res.data.error);
                  setLoading(false);
                  navigation.reset({
                    routes: [{ name: "Login" }],
                  });
                }
                ///
                var doneUntil = res.data.chaptersWithQuestions.findIndex(
                  (s) => s.id == res.data.doneUntil
                );
                console.log(doneUntil);
                var array = [];

                ////initialized local question status array
                for (
                  let i = 0;
                  i < Object.values(res.data.chaptersWithQuestions).length;
                  i++
                ) {
                  array.push({
                    question: i,
                    status: null,
                  });
                } ///end
                dispatch(emptyCounters()); //reset counters
                dispatch(setPagingStatus(array)); //pushing status array with all null
                setLoading(false);
                navigation.push("QuizScreen", {
                  quizData: res.data,
                  chapterName: chapterName,
                  id,
                  doneUntil,
                  qID: res.data.chaptersWithQuestions[
                    doneUntil == -1 ? 0 : doneUntil
                  ].id,
                });
              });
          } catch (error) {
            alert("Server is not responding, Please try again later");
            setLoading(false);
          }
        }}
      >
        {loading == true ? (
          <ActivityIndicator
            size={"large"}
            color={COLORS.white}
            style={{ right: 10 }}
          />
        ) : (
          <Text
            style={{
              marginRight: 10,
              backgroundColor: COLORS.white,
              padding: 7,
              borderRadius: 5,
              fontSize: 11,
            }}
          >
            Start Test
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const QuizChapter=({ chapterName, id })=>{
  const [loading, setLoading] = useState(false);
  const [loadingResetProgress, setLoadingResetProgress] = useState(false);
  const webURL = useSelector((state) => state.webURL);
  const user = useSelector((state) => state.user);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  return (
    <View>
      <View
        style={{
          backgroundColor: COLORS.white,
          paddingVertical: 15,
          marginHorizontal: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottomWidth: 0.3,
          borderBottomColor: COLORS.darkGray,
        }}
      >
        <View
          style={{
            flex: 1,
          }}
        >
          <Text
            style={{
              padding: 5,
              color: COLORS.black,
              marginLeft: 10,
              fontSize: SIZES.h3,
              width: 150,
            }}
          >
            {chapterName}
          </Text>
        </View>
        <TouchableOpacity
          onPress={async () => {
            setLoadingResetProgress(true);
            await axios
              .get(`${webURL}/api/resetQuestionStatus/${user.user_id}/${id}`, {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              })
              .then((res) => {
                res.status == 200 ? alert("Progress reset successful! ") : null;
                setLoadingResetProgress(false);
              })
              .catch((err) => {
                setLoadingResetProgress(false);
                console.log(err);
                alert("Cannot reset the progress, Try agin later!");
              });
          }}
        >
          {loadingResetProgress == true ? (
            <ActivityIndicator
              size={"large"}
              color={COLORS.white}
              style={{ right: 10 }}
            />
          ) : (
            <AntDesign
              name="reload1"
              size={20}
              color={COLORS.green}
              style={{
                marginHorizontal: 10,
                marginTop: 3,
              }}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            setLoading(true);
            try {
              await axios
                .get(
                  `${webURL}/api/chaptersWithQuestions/${user.user_id}/${id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${user.token}`,
                    },
                  }
                )
                .then((res) => {
                  ///check if user is Active
                  if (res.data.active == 0) {
                    alert(res.data.error);
                    setLoading(false);
                    navigation.reset({
                      routes: [{ name: "Login" }],
                    });
                  }
                  ///
                  var doneUntil = res.data.chaptersWithQuestions.findIndex(
                    (s) => s.id == res.data.doneUntil
                  );
                  console.log(doneUntil);
                  var array = [];

                  ////initialized local question status array
                  for (
                    let i = 0;
                    i < Object.values(res.data.chaptersWithQuestions).length;
                    i++
                  ) {
                    array.push({
                      question: i,
                      status: null,
                    });
                  } ///end
                  dispatch(emptyCounters()); //reset counters
                  dispatch(setPagingStatus(array)); //pushing status array with all null
                  setLoading(false);
                  navigation.push("QuizScreen", {
                    quizData: res.data,
                    chapterName: chapterName,
                    id,
                    doneUntil,
                    qID: res.data.chaptersWithQuestions[
                      doneUntil == -1 ? 0 : doneUntil
                    ].id,
                  });
                });
            } catch (error) {
              alert("Server is not responding, Please try again later");
              setLoading(false);
            }
          }}
        >
          {loadingResetProgress == true ? (
            <ActivityIndicator
              size={"large"}
              color={COLORS.white}
              style={{ right: 10 }}
            />
          ) : (
            <Ionicons
              name="play"
              size={25}
              color={COLORS.green}
              style={{
                marginHorizontal: 10,
              }}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const RenderChapters = ({ navigation }) => {
  const webURL = useSelector((state) => state.webURL);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [chapters, setChapters] = useState("");
  useEffect(() => {
    getChaptersAsync();
  }, []);
  const getChaptersAsync = async () => {
    await axios
      .get(webURL + "/api/getChapters", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setChapters(res.data);
        //console.log(chapters.allChapters);
      });
  };
  const renderItem = ({ item }) => (
      <QuizChapter chapterName={item.chapterName} id={item.id} />
  );

  const loadingView = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} color={COLORS.primary} />
        <Text style={{ color: COLORS.primary, fontSize: SIZES.h2 }}>
          Loading...
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {chapters === "" ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size={"large"} color={COLORS.primary} />
          <Text style={{ color: COLORS.primary, fontSize: SIZES.h2 }}>
            Loading Chapters
          </Text>
        </View>
      ) : (
        <FlatList
          data={chapters.allChapters}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{marginVertical:10,}}
        />
      )}
    </View>
  );
};

export default RenderChapters;

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
