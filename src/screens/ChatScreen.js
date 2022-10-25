import {
  KeyboardAvoidingView,
  ImageBackground,
  StyleSheet,
  FlatList,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import Message from "../components/Message";

import bg from "../../assets/images/BG.png";
import messages from "../../assets/data/messages.json";
import InputBox from "../components/InputBox";
import { API, graphqlOperation } from "aws-amplify";
import { getChatRoom } from "../graphql/queries";

export default function ChatScreen() {
  const [chatRoom, setChatRoom] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();
  const chatroomID = route.params.id;

  useEffect(() => {
    API.graphql(graphqlOperation(getChatRoom, { id: chatroomID })).then(
      (result) => setChatRoom(result.data?.getChatRoom)
    );
  }, []);

  useEffect(() => {
    navigation.setOptions({ title: route.params.name });
  }, [route.params.name]);
  if (!chatRoom) {
    return <ActivityIndicator />;
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.bg}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 90}
    >
      <ImageBackground source={bg} style={styles.bg}>
        <FlatList
          data={chatRoom.Messages.items}
          renderItem={({ item }) => <Message message={item} />}
          style={styles.list}
          inverted
        />
        <InputBox chatroom={chatRoom} />
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  list: {
    padding: 10,
  },
});
