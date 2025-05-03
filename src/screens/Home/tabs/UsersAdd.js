import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Animated,
  ActivityIndicator,
  Alert,
} from "react-native";
import { ref, onValue, update } from "firebase/database"; // Replace get with onValue
import database from "../../../../firebaseConfig"; // Import the database instance
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for the close icon
import Notification from "./Notification"; // Import Notification component

const UsersAdd = () => {
  const [users, setUsers] = useState([]); // State to store users
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0)); // Initialize fade animation
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [notifications, setNotifications] = useState([]); // State for notifications

  useEffect(() => {
    const usersRef = ref(database, "users"); // Reference to the users node
    const unsubscribe = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const usersList = Object.keys(usersData).map((userId) => ({
          id: userId,
          ...usersData[userId], // Spread user details
        }));
        setUsers(usersList); // Set the fetched users
      } else {
        setUsers([]); // Clear data if no users exist
      }
      setLoading(false); // Stop loading
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const triggerNotification = (message) => {
    const newNotification = {
      id: Date.now().toString(),
      message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setNotifications([newNotification]); // Replace existing notifications with the new one
  };

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedUser(null);
    });
  };

  const handleStatusChange = (userId, status) => {
    const userRef = ref(database, `users/${userId}`); // Reference to the specific user
    update(userRef, { status }) // Update the status field
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, status } : user
          )
        ); // Update the local state to reflect the new status

        const statusMessage = status === 1 ? "Accepted" : "Declined";
        triggerNotification(`User ${statusMessage}`); // Trigger notification

        handleCloseModal(); // Close the modal after updating
      })
      .catch((error) => {
        console.error("Error updating user status:", error);
        Alert.alert("Error", "Failed to update user status.");
      });
  };

  const renderItem = ({ item }) => (
    <View style={styles.userItem}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </Text>
      </View>
      <View style={styles.userDetails}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.userId}>#{item.id}</Text>
        <Text style={styles.status}>
          Status:{" "}
          {item.status === 1
            ? "Accepted"
            : item.status === 0
            ? "Declined"
            : "Pending"}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.viewMoreButton}
        onPress={() => handleOpenModal(item)}
      >
        <Text style={styles.viewMoreText}>View More</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      </SafeAreaView>
    );
  }

  if (users.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Users Data</Text>
          </View>
          <Text style={styles.subHeader}>User Account History</Text>
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No users found.</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Notification notifications={notifications} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>User Account</Text>
        </View>
        <Text style={styles.subHeader}>User Account History</Text>
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
        {selectedUser && (
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="none"
            onRequestClose={handleCloseModal}
          >
            <View style={styles.modalContainer}>
              <Animated.View
                style={[styles.modalContent, { opacity: fadeAnim }]}
              >
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleCloseModal}
                >
                  <Ionicons name="close" size={24} color="#1f2937" />
                </TouchableOpacity>
                <Text style={styles.detailText}>Name: {selectedUser.name}</Text>
                <Text style={styles.detailText}>
                  User ID: {selectedUser.id}
                </Text>
                <Text style={styles.detailText}>
                  Email: {selectedUser.email}
                </Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => handleStatusChange(selectedUser.id, 1)}
                  >
                    <Text style={styles.buttonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.declineButton}
                    onPress={() => handleStatusChange(selectedUser.id, 0)}
                  >
                    <Text style={styles.buttonText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </View>
          </Modal>
        )}
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
  userItem: {
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
  userDetails: {
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
  status: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 5,
  },
  viewMoreButton: {
    backgroundColor: "#e0f2fe",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563eb",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  detailText: {
    fontSize: 16,
    color: "#1f2937",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  acceptButton: {
    backgroundColor: "#10b981",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  declineButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: 16,
    color: "#6b7280",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UsersAdd;
