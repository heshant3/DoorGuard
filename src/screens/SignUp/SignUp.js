import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import database from "../../../firebaseConfig"; // Import the database instance
import { ref, set, get, child } from "firebase/database"; // Import Firebase database functions

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    const usersRef = ref(database, "users");
    get(usersRef)
      .then((snapshot) => {
        const userCount = snapshot.exists()
          ? Object.keys(snapshot.val()).length
          : 0;
        const newUserId = userCount + 1; // Increment user count for the new ID

        // Get current timestamp in Sri Lanka time (UTC+5:30)
        const now = new Date();
        const sriLankaTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000); // Add 5 hours 30 minutes
        const timestamp = sriLankaTime.toISOString(); // Convert to ISO string

        set(ref(database, `users/${newUserId}`), {
          email,
          password,
          createdAt: timestamp, // Save signup time
        })
          .then(() => {
            Alert.alert("Success", "Account created successfully!");
            navigation.navigate("Login");
          })
          .catch((error) => {
            Alert.alert("Error", error.message);
          });
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="person-add-outline" size={60} color="#3b82f6" />
      </View>
      <Text style={styles.title}>DoorGuard</Text>
      <Text style={styles.subtitle}>Create Your Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm your password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.signUpText}>
          Already have an account? <Text style={styles.signUpLink}>Log In</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
  },
  iconContainer: {
    backgroundColor: "#e0f2fe",
    borderRadius: 50,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 19,
    marginBottom: 20,
    fontSize: 16,
    color: "#374151",
  },
  button: {
    width: "100%",
    backgroundColor: "#3b82f6",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  signUpText: {
    fontSize: 14,
    color: "#6b7280",
  },
  signUpLink: {
    color: "#3b82f6",
    fontWeight: "600",
  },
});

export default SignUp;
