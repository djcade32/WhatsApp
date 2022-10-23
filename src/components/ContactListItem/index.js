import { Text, Image, StyleSheet, Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { createChatRoom, createUserChatRoom } from "../../graphql/mutations";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

function ContactListItem({ user }) {
  const navigation = useNavigation();

  async function onPress() {
    const newChatRoomData = await API.graphql(
      graphqlOperation(createChatRoom, { input: {} })
    );
    if (!newChatRoomData.data?.createChatRoom) {
      console.log("Error creating the chat room");
    }
    const newChatRoom = newChatRoomData.data?.createChatRoom;
    // Add the clicked user to the chat room
    await API.graphql(
      graphqlOperation(createUserChatRoom, {
        input: { chatRoomID: newChatRoom.id, userID: user.id },
      })
    );

    // Add the current auth user to the chat room
    const authUser = await Auth.currentAuthenticatedUser();
    await API.graphql(
      graphqlOperation(createUserChatRoom, {
        input: { chatRoomID: newChatRoom.id, userID: authUser.attributes.sub },
      })
    );

    navigation.navigate("Chat", { id: newChatRoom.id });
  }
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Image
        source={{
          uri: user.image,
        }}
        style={styles.image}
      />
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text numberOfLines={1} style={styles.name}>
            {user.name}
          </Text>
          <Text numberOfLines={2} style={styles.subTitle}>
            {user.status}
          </Text>
        </View>
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
  name: {
    fontWeight: "bold",
  },
  content: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "gray",
    flex: 1,
  },
  textContainer: {
    justifyContent: "center",
    flex: 1,
  },
  subTitle: {
    color: "gray",
  },
});

export default ContactListItem;
