import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Added import for icons

const NotificationList = ({ notifications }) => {
  return (
    <View style={styles.container}>
      {notifications.map((notification) => (
        <View key={notification.id} style={styles.notification}>
          <Icon
            name="notifications"
            size={20}
            color="#2b2b2b"
            style={styles.icon}
          />
          <View style={styles.textContainer}>
            <Text style={styles.message}>{notification.message}</Text>
            <Text style={styles.timestamp}>{notification.timestamp}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
  },
  notification: {
    flexDirection: "row", // Added to align icon and text
    alignItems: "center", // Center align items
    padding: 10,
    borderRadius: 8,
  },
  icon: {
    marginRight: 10, // Added margin to separate icon from text
  },
  textContainer: {
    flex: 1, // Added to wrap text content
  },
  message: {
    color: "#2b2b2b",
    fontSize: 16,
    fontWeight: "bold",
  },
  timestamp: {
    color: "#525252",
    fontSize: 12,
    marginTop: 5,
  },
});

export default NotificationList;
