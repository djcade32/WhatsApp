import { FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import ContactListItem from "../components/ContactListItem";
import { API, graphqlOperation } from "aws-amplify";
import { listUsers } from "../graphql/queries";

export default function ContactsScreen() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.graphql(graphqlOperation(listUsers)).then((results) => {
      console.log(results);
      setUsers(results.data?.listUsers?.items);
    });
  }, []);
  return (
    <FlatList
      data={users}
      renderItem={({ item }) => <ContactListItem user={item} />}
      style={{ backgroundColor: "white" }}
    />
  );
}
