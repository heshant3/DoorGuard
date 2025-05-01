import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const ActivityCheck = () => {
  const activityData = [
    {
      id: "1",
      name: "Tony Stark",
      userId: "USR001",
      time: "09:41 AM",
      date: "Today, Feb 15, 2024",
    },
    {
      id: "2",
      name: "Steve Rogers",
      userId: "USR002",
      time: "08:30 AM",
      date: "Today, Feb 15, 2024",
    },
    {
      id: "3",
      name: "Bruce Banner",
      userId: "USR003",
      time: "07:15 AM",
      date: "Today, Feb 15, 2024",
    },
    {
      id: "4",
      name: "Natasha Romanoff",
      userId: "USR004",
      time: "06:45 AM",
      date: "Today, Feb 15, 2024",
    },
    {
      id: "5",
      name: "Peter Parker",
      userId: "USR005",
      time: "Yesterday",
      date: "Feb 14, 2024",
    },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.activityItem}>
      <View style={styles.avatarWrapper}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </Text>
        </View>
        <Ionicons
          name="lock-closed-outline"
          size={14}
          color="#10b981"
          style={styles.lockIcon}
        />
      </View>
      <View style={styles.activityDetails}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.userId}>ID: {item.userId}</Text>
      </View>
      <View style={styles.activityTime}>
        <Text style={styles.time}>{item.time}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Activity Log</Text>
          <TouchableOpacity>
            <Ionicons name="refresh-outline" size={24} color="#2563eb" />
          </TouchableOpacity>
        </View>
        <Text style={styles.subHeader}>Door Access History</Text>
        <FlatList
          data={activityData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  subHeader: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e0f2fe",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563eb",
  },
  lockIcon: {
    position: "absolute",
    bottom: -4,
    right: 13,
    borderRadius: 8,
    padding: 2,
  },
  activityDetails: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
  },
  userId: {
    fontSize: 14,
    color: "#6b7280",
  },
  activityTime: {
    alignItems: "flex-end",
  },
  time: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f2937",
  },
  date: {
    fontSize: 12,
    color: "#6b7280",
  },
});

export default ActivityCheck;
