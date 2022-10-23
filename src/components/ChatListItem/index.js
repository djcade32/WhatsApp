import { Text, View, Image, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { Auth } from "aws-amplify";
import { useEffect, useState } from "react";

function ChatListItem({ chat }) {
  const [authUser, setAuthUser] = useState({});
  const navigation = useNavigation();
  useEffect(() => {
    const fetchUser = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      console.log("User: ", authUser.attributes.sub);
      setAuthUser(authUser);
    };
    fetchUser();
  }, []);
  const user =
    chat.users.items[0].user.id === authUser.attributes.sub
      ? chat.users.items[1].user
      : chat.users.items[0].user;
  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        navigation.navigate("Chat", { id: chat.id, name: user?.name })
      }
    >
      <Image
        source={{
          uri: user?.image,
        }}
        style={styles.image}
      />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text numberOfLines={1} style={styles.name}>
            {user?.name}
          </Text>
          <Text style={styles.subTitle}>
            {dayjs(chat.lastMessage?.createdAt).fromNow(true)}
          </Text>
        </View>
        <Text numberOfLines={2} style={styles.subTitle}>
          {chat.lastMessage?.text}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  content: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "gray",
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  name: {
    flex: 1,
    fontWeight: "bold",
  },
  subTitle: {
    color: "gray",
  },
});

export default ChatListItem;
