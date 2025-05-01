import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import database from "../../../../firebaseConfig";
import { ref, get, update } from "firebase/database";

const Profile = ({ navigation }) => {
  const [user, setUser] = useState(null); // State to store user details
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [isChangingPassword, setIsChangingPassword] = useState(false); // State to toggle password change mode
  const [updatedName, setUpdatedName] = useState(""); // State for updated name
  const [updatedEmail, setUpdatedEmail] = useState(""); // State for updated email
  const [originalName, setOriginalName] = useState(""); // State to store original name
  const [originalEmail, setOriginalEmail] = useState(""); // State to store original email
  const [newPassword, setNewPassword] = useState(""); // State for new password
  const [confirmNewPassword, setConfirmNewPassword] = useState(""); // State for confirming new password

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
            setUpdatedName(userData.name || "User");
            setUpdatedEmail(userData.email);
            setOriginalName(userData.name || "User");
            setOriginalEmail(userData.email);
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

  const handleSave = async () => {
    if (!updatedName || !updatedEmail) {
      Alert.alert("Error", "Name and email cannot be empty.");
      return;
    }

    try {
      const userRef = ref(database, `users/${user.userId}`);
      await update(userRef, { name: updatedName, email: updatedEmail });
      setUser((prevUser) => ({
        ...prevUser,
        name: updatedName,
        email: updatedEmail,
      }));
      setOriginalName(updatedName);
      setOriginalEmail(updatedEmail);
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  const handleCancel = () => {
    setUpdatedName(originalName); // Revert to original name
    setUpdatedEmail(originalEmail); // Revert to original email
    setIsEditing(false); // Exit edit mode
  };

  const handleSavePassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      Alert.alert("Error", "Password fields cannot be empty.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      const userRef = ref(database, `users/${user.userId}`);
      await update(userRef, { password: newPassword });
      setIsChangingPassword(false);
      setNewPassword("");
      setConfirmNewPassword("");
      Alert.alert("Success", "Password updated successfully.");
    } catch (error) {
      console.error("Error updating password:", error);
      Alert.alert("Error", "Failed to update password.");
    }
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setNewPassword("");
    setConfirmNewPassword("");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.name[0].toUpperCase()}
              </Text>
            </View>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
          <View style={styles.detailsContainer}>
            {isEditing ? (
              <>
                <TextInput
                  style={styles.input}
                  value={updatedName}
                  onChangeText={setUpdatedName}
                  placeholder="Enter your name"
                />
                <TextInput
                  style={styles.input}
                  value={updatedEmail}
                  onChangeText={setUpdatedEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                />
              </>
            ) : (
              <>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>User ID:</Text>
                  <Text style={styles.detailValue}>{user.userId}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>User Name:</Text>
                  <Text style={styles.detailValue}>{user.name}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Email:</Text>
                  <Text style={styles.detailValue}>{user.email}</Text>
                </View>
              </>
            )}
          </View>
          {!isEditing &&
            !isChangingPassword &&
            user.userId !== "12" && ( // Show Edit button only for non-admin users
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            )}
          {user.userId !== "12" &&
            !isChangingPassword && ( // Hide Security section for admin
              <View style={styles.detailsContainer}>
                <Text style={styles.securityHeader}>Security</Text>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Password:</Text>
                  <Text style={styles.detailValue}>****</Text>
                </View>
              </View>
            )}

          {user.userId !== "12" &&
            !isEditing &&
            !isChangingPassword && ( // Show Change Password button only for non-admin users
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsChangingPassword(true)}
              >
                <Text style={styles.editButtonText}>Change Password</Text>
              </TouchableOpacity>
            )}
          {isChangingPassword && (
            <View style={styles.passwordChangeContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                secureTextEntry
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
              />
              <View style={styles.editActions}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSavePassword}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancelPasswordChange}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {isEditing && (
            <View style={styles.editActions}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
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
    justifyContent: "space-between", // Ensure content and logout button are spaced
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  content: {
    flex: 1, // Allow content to take up remaining space
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
    backgroundColor: "#2c7aff",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  logoutButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    width: "100%",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#374151",
  },
  editButton: {
    borderWidth: 1,
    borderColor: "#3b82f6",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  editButtonText: {
    color: "#3b82f6",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    borderWidth: 1,
    borderColor: "#3b82f6",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  saveButtonText: {
    color: "#3b82f6",
    fontSize: 16,
    fontWeight: "600",
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#ef4444",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButtonText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "600",
  },
  passwordChangeContainer: {
    marginTop: 20,
  },
  changePasswordButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  changePasswordButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Profile;
