import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { Auth } from "aws-amplify";

export default function Message({ message }) {
  const [isAuthUser, setIsAuthUser] = useState(false);
  const isMyMessage = async () => {
    const authUser = await Auth.currentAuthenticatedUser();
    setIsAuthUser(message.userID == authUser.attributes.sub);
  };
  isMyMessage();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isAuthUser ? "#DCF8C5" : "white",
          alignSelf: isAuthUser ? "flex-end" : "flex-start",
        },
      ]}
    >
      <Text>{message.text}</Text>
      <Text style={styles.time}>{dayjs(message.createdAt).fromNow(true)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 5,
    padding: 10,
    borderRadius: 10,
    maxwidth: "80%",

    shadowColor: "#000",
    shadow0ffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 1,
  },
  time: {
    color: "gray",
    alignSelf: "flex-end",
  },
});
