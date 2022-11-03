import { View, Text, FlatList } from "react-native";
import React from "react";
import ChatListItem from "../../components/ChatListItem";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { listChatRooms } from "./queries";
import { useEffect, useState } from "react";

export default function ChatsScreen() {
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      const response = await API.graphql(
        graphqlOperation(listChatRooms, { id: authUser.attributes.sub })
      );
      const rooms = response.data.getUser.ChatRooms.items;
      const sortedRooms = rooms.sort((r1, r2) => {
        new Date(r1.chatRoom.updatedAt) - new Date(r2.chatRoom.updatedAt);
      });
      setChatRooms(sortedRooms);
    };
    fetchChatRooms();
  }, []);

  return (
    <FlatList
      data={chatRooms}
      renderItem={({ item }) => <ChatListItem chat={item.chatRoom} />}
      style={{ backgroundColor: "white" }}
    />
  );
}
