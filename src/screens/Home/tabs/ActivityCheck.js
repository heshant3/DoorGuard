import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import database from "../../../../firebaseConfig"; // Import Firebase database instance
import { ref, get } from "firebase/database"; // Import Firebase database functions

const ActivityCheck = () => {
  const [activityData, setActivityData] = useState([]); // State to store activity data
  const [loading, setLoading] = useState(true); // State to manage loading state

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        const activityRef = ref(database, "activity"); // Reference to the activity node
        const snapshot = await get(activityRef);

        if (snapshot.exists()) {
          const activities = [];
          const activityUsers = snapshot.val();

          // Iterate through user IDs and their activities
          Object.keys(activityUsers).forEach((userId) => {
            const userActivities = activityUsers[userId];
            Object.keys(userActivities).forEach((activityId) => {
              activities.push({
                id: activityId,
                userId,
                ...userActivities[activityId], // Spread activity details
              });
            });
          });

          setActivityData(activities); // Set the fetched activity data
        } else {
          console.error("No activity data found in the database.");
        }
      } catch (error) {
        console.error("Error fetching activity data:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchActivityData();
  }, []);

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
          name={
            item.action === "Unlocked"
              ? "lock-open-outline"
              : "lock-closed-outline"
          }
          size={14}
          color={item.action === "Unlocked" ? "#10b981" : "#ef4444"}
          style={styles.lockIcon}
        />
      </View>
      <View style={styles.activityDetails}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.userId}>ID: {item.userId}</Text>
        <Text style={styles.action}>Action: {item.action}</Text>
      </View>
      <View style={styles.activityTime}>
        <Text style={styles.time}>
          {new Date(item.timestamp).toLocaleTimeString()}
        </Text>
        <Text style={styles.date}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Activity Log</Text>
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
  action: {
    fontSize: 14,
    color: "#6b7280",
  },
});

export default ActivityCheck;
