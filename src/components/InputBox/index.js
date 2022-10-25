import { StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { createMessage, updateChatRoom } from "../../graphql/mutations";

export default function InputBox({ chatroom }) {
  const [text, setText] = useState("");
  async function onSend() {
    console.warn("Sending a new message: ", text);
    const authUser = await Auth.currentAuthenticatedUser();
    const newMessage = {
      chatroomID: chatroom.id,
      text,
      userID: authUser.attributes.sub,
    };
    const newMesageData = await API.graphql(
      graphqlOperation(createMessage, { input: newMessage })
    );
    setText("");
    await API.graphql(
      graphqlOperation(updateChatRoom, {
        input: {
          _version: chatroom._version,
          chatRoomLastMessageId: newMesageData.data.createMessage.id,
          id: chatroom.id,
        },
      })
    );
  }
  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <AntDesign name="plus" size={20} color="royalblue" />
      <TextInput
        value={text}
        onChangeText={setText}
        style={styles.input}
        placeholder="Type your message..."
      />
      <MaterialIcons
        style={styles.send}
        name="send"
        size={16}
        color="white"
        onPress={onSend}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "whitesmoke",
    padding: 5,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    padding: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderRadius: 50,
    borderColor: "lightgray",
    borderWidth: StyleSheet.hairlineWidth,
  },
  send: {
    backgroundColor: "royalblue",
    padding: 7,
    borderRadius: 15,
    overflow: "hidden",
  },
});
