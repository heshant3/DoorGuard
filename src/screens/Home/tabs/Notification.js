import React, { useState, useEffect } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native"; // Import Easing for smooth animations
import { ref, onValue } from "firebase/database"; // Import Firebase database functions
import database from "../../../../firebaseConfig"; // Import Firebase configuration
import NotificationList from "../../../components/NotificationList";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [slideAnim] = useState(new Animated.Value(-100)); // Animation for sliding notifications
  const [isAdmin, setIsAdmin] = useState(false); // State to check if the user is admin

  useEffect(() => {
    const checkAdmin = async () => {
      const loggedInUserId = await AsyncStorage.getItem("loggedInUserId");
      setIsAdmin(loggedInUserId === "admin"); // Set isAdmin to true if the user is admin
    };

    checkAdmin();

    if (isAdmin) {
      let isInitial = true; // Flag to ignore the initial value
      const lockRef = ref(database, "/Lock"); // Reference to the Lock value in the database
      const unsubscribe = onValue(lockRef, (snapshot) => {
        if (snapshot.exists()) {
          if (isInitial) {
            isInitial = false; // Ignore the first value
            return;
          }

          const lockValue = snapshot.val();
          const message =
            lockValue === 0
              ? "Door Locked"
              : lockValue === 1
              ? "Door Unlocked"
              : null;

          if (message) {
            triggerNotification(message); // Trigger notification based on lock value
          }
        }
      });

      return () => unsubscribe(); // Clean up the listener on unmount
    }
  }, [isAdmin]);

  const triggerNotification = (message) => {
    const newNotification = {
      id: Date.now().toString(),
      message: message.toString(), // Ensure message is a string
      timestamp: new Date().toLocaleTimeString(),
    };
    setNotifications([newNotification]); // Replace existing notifications with the new one

    slideAnim.setValue(-100); // Start position above the screen
    Animated.timing(slideAnim, {
      toValue: 40, // Slide to the visible position
      duration: 500,
      easing: Easing.out(Easing.quad), // Apply easing for smooth animation
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100, // Slide back up after display
          duration: 500,
          easing: Easing.in(Easing.quad), // Apply easing for smooth animation
          useNativeDriver: true,
        }).start(() => setNotifications([])); // Clear notifications
      }, 3000); // Display notification for 3 seconds
    });
  };

  return (
    <Animated.View
      style={[
        styles.notificationOverlay,
        { transform: [{ translateY: slideAnim }] }, // Apply slide animation
      ]}
    >
      <NotificationList notifications={notifications} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  notificationOverlay: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android
    zIndex: 1000, // Ensure it appears above all other content
    color: "#282828",
  },
});

export default Notification;
