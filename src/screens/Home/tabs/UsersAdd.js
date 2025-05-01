import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Animated,
} from "react-native";

const UsersAdd = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0)); // Initialize fade animation

  const users = [
    {
      id: "1",
      name: "John Anderson",
      userId: "USER28491",
      email: "john@example.com",
    },
    {
      id: "2",
      name: "Sarah Miller",
      userId: "USER28492",
      email: "sarah@example.com",
    },
    {
      id: "3",
      name: "Michael Chen",
      userId: "USER28493",
      email: "michael@example.com",
    },
    {
      id: "4",
      name: "Emily Johnson",
      userId: "USER28494",
      email: "emily@example.com",
    },
    {
      id: "5",
      name: "David Wilson",
      userId: "USER28495",
      email: "david@example.com",
    },
    {
      id: "6",
      name: "Lisa Brown",
      userId: "USER28496",
      email: "lisa@example.com",
    },
  ];

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
        <Text style={styles.userId}>#{item.userId}</Text>
      </View>
      <TouchableOpacity
        style={styles.viewMoreButton}
        onPress={() => handleOpenModal(item)}
      >
        <Text style={styles.viewMoreText}>View More</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>User Add</Text>
        </View>
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
                <Text style={styles.detailText}>Name: {selectedUser.name}</Text>
                <Text style={styles.detailText}>
                  User ID: {selectedUser.userId}
                </Text>
                <Text style={styles.detailText}>
                  Email: {selectedUser.email}
                </Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.acceptButton}>
                    <Text style={styles.buttonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.declineButton}
                    onPress={handleCloseModal}
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
});

export default UsersAdd;
