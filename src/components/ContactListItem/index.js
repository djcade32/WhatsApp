import { Text, Image, StyleSheet, Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

function ContactListItem({ user }) {
  const navigation = useNavigation();
  return (
    <Pressable style={styles.container} onPress={() => {}}>
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
