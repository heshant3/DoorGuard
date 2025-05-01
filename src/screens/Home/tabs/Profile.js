import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { CommonActions } from "@react-navigation/native"; // Import CommonActions
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import database from "../../../../firebaseConfig"; // Import Firebase database instance
import { ref, get } from "firebase/database"; // Import Firebase database functions

const Profile = ({ navigation }) => {
  const [user, setUser] = useState(null); // State to store user details
  const [loading, setLoading] = useState(true); // State to manage loading state

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const loggedInUserId = await AsyncStorage.getItem("loggedInUserId");
        if (loggedInUserId === "admin") {
          // Admin details
          setUser({
            name: "Admin",
            email: "admin@admin.com",
            userId: "12",
          });
        } else if (loggedInUserId) {
          // Fetch user details from Firebase
          const userRef = ref(database, `users/${loggedInUserId}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUser({
              name: userData.name || "User", // Default name if not provided
              email: userData.email,
              userId: loggedInUserId,
            });
          } else {
            console.error("User not found in the database.");
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    // Reset the navigation stack and navigate to Login
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  };

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
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name[0].toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>User ID:</Text>
            <Text style={styles.detailValue}>{user.userId}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Email:</Text>
            <Text style={styles.detailValue}>{user.email}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#e0f2fe",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2563eb",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#6b7280",
  },
  detailsContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 30,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Profile;
