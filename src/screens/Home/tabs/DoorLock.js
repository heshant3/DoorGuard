import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ref, set, push, get } from "firebase/database"; // Import Firebase database functions
import database from "../../../../firebaseConfig"; // Ensure the database is imported correctly
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import * as LocalAuthentication from "expo-local-authentication"; // Import Expo Local Authentication
import * as Linking from "expo-linking"; // Import Linking from Expo

const DoorLock = () => {
  const [lockStatus, setLockStatus] = useState("Locked"); // State to track lock status
  const [user, setUser] = useState(null); // State to store user details
  const [camIP, setCamIP] = useState(null); // State to store camera IP

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const loggedInUserId = await AsyncStorage.getItem("loggedInUserId");
        if (loggedInUserId === "admin") {
          // Admin details
          setUser({
            name: "Admin",
            email: "admin@admin.com",
            userId: "Admin",
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
            Alert.alert("Error", "User data not found in the database.");
          }
        } else {
          Alert.alert("Error", "User ID not found in local storage.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        Alert.alert("Error", "An error occurred while fetching user details.");
      }
    };

    const fetchCamIP = async () => {
      try {
        const camIPRef = ref(database, "CamIP"); // Reference to CamIP in Firebase
        const snapshot = await get(camIPRef);
        if (snapshot.exists()) {
          setCamIP(snapshot.val()); // Set the camera IP
        } else {
          console.error("CamIP not found in the database.");
        }
      } catch (error) {
        console.error("Error fetching CamIP:", error);
      }
    };

    fetchUserDetails();
    fetchCamIP();
  }, []);

  const authenticateFingerprint = async () => {
    try {
      // Check if the device supports biometric authentication
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert(
          "Error",
          "Your device does not support biometric authentication."
        );
        return false;
      }

      // Check if biometrics are enrolled
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert(
          "Error",
          "No biometric authentication methods are set up on this device."
        );
        return false;
      }

      // Authenticate the user
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to proceed",
        fallbackLabel: "Use Passcode",
      });

      if (result.success) {
        return true; // Authentication successful
      } else {
        Alert.alert(
          "Authentication Failed",
          "Fingerprint authentication failed."
        );
        return false; // Authentication failed
      }
    } catch (error) {
      console.error("Fingerprint Authentication Error:", error);
      Alert.alert("Error", "An error occurred during authentication.");
      return false;
    }
  };

  const logActivity = async (action) => {
    if (!user) {
      Alert.alert("Error", "User details not found.");
      return;
    }

    // Get current timestamp in Sri Lanka time (UTC+5:30)
    const now = new Date();
    const sriLankaTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000); // Add 5 hours 30 minutes
    const timestamp = sriLankaTime.toISOString(); // Convert to ISO string

    const activityRef = ref(database, `activity/${user.userId}`); // Reference to user's activity node

    const activityData = {
      name: user.name,
      email: user.email,
      action,
      timestamp,
    };

    try {
      await push(activityRef, activityData); // Push activity data to the database
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  };

  const handleLock = async () => {
    const isAuthenticated = await authenticateFingerprint(); // Check fingerprint
    if (!isAuthenticated) return;

    try {
      set(ref(database, "/Lock"), 0) // Update lock status in the database
        .then(() => {
          setLockStatus("Locked");

          logActivity("Locked"); // Log lock activity
        })
        .catch((error) => {
          Alert.alert("Error", "Failed to lock the door.");
          console.error(error);
        });
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleUnlock = async () => {
    const isAuthenticated = await authenticateFingerprint(); // Check fingerprint
    if (!isAuthenticated) return;

    try {
      set(ref(database, "/Lock"), 1) // Update lock status in the database
        .then(() => {
          setLockStatus("Unlocked");

          logActivity("Unlocked"); // Log unlock activity
        })
        .catch((error) => {
          Alert.alert("Error", "Failed to unlock the door.");
          console.error(error);
        });
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleCameraView = () => {
    if (camIP) {
      Linking.openURL(`http://${camIP}`); // Open the camera IP in the browser
    } else {
      Alert.alert("Error", "Camera IP not available.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <View style={styles.outerCircle}>
            <View style={styles.iconBackground}>
              <Ionicons
                name={lockStatus === "Locked" ? "lock-closed" : "lock-open"} // Change icon dynamically
                size={60}
                color="#2563eb" // Keep the color consistent
              />
            </View>
          </View>
        </View>
        <Text style={styles.statusText}>Door {lockStatus}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.lockButton]}
            onPress={handleLock}
          >
            <Ionicons name="lock-closed" size={20} color="#fff" />
            <Text style={styles.buttonText}>Lock Door</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.unlockButton]}
            onPress={handleUnlock}
          >
            <Ionicons name="lock-open" size={20} color="#fff" />
            <Text style={styles.buttonText}>Unlock Door</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={handleCameraView}
        >
          <Text style={styles.cameraButtonText}>Camera View</Text>
        </TouchableOpacity>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  userDetails: {
    marginBottom: 20,
    alignItems: "center",
  },
  userDetailText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  content: {
    flex: 1, // Allow content to take up remaining space
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapper: {
    marginBottom: 30,
  },
  outerCircle: {
    width: 190,
    height: 190,
    borderRadius: 100,
    backgroundColor: "#e6f1ff",
    justifyContent: "center",
    alignItems: "center",
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  statusText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  button: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 23,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 10,
    gap: 10,
  },
  lockButton: {
    backgroundColor: "#ef4444",
  },
  unlockButton: {
    backgroundColor: "#10b981",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  cameraButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 50,
  },
  cameraButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DoorLock;
