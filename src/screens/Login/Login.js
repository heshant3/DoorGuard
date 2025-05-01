import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import database from "../../../firebaseConfig"; // Import the database instance
import { ref, get } from "firebase/database"; // Import Firebase database functions
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (email === "a" && password === "1") {
      await AsyncStorage.setItem("loggedInUserId", "admin"); // Save admin ID
      navigation.navigate("AdminHome"); // Navigate to Admin pages
      return;
    }

    const usersRef = ref(database, "users");
    get(usersRef)
      .then(async (snapshot) => {
        if (snapshot.exists()) {
          const users = snapshot.val();
          const userEntry = Object.entries(users).find(
            ([id, u]) => u.email === email && u.password === password
          );

          if (userEntry) {
            const [userId] = userEntry; // Extract user ID
            await AsyncStorage.setItem("loggedInUserId", userId); // Save user ID
            navigation.navigate("UserHome"); // Navigate to UserHome on success
          } else {
            Alert.alert(
              "Invalid Credentials",
              "Please check your email and password."
            );
          }
        } else {
          Alert.alert("Error", "No users found in the database.");
        }
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="lock-closed-outline" size={60} color="#3b82f6" />
        </View>
        <Text style={styles.title}>DoorGuard</Text>
        <Text style={styles.subtitle}>Smart Access Control</Text>
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
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <Text style={styles.signUpText}>
          Don't have an account?{" "}
          <Text
            style={styles.signUpLink}
            onPress={() => navigation.navigate("SignUp")}
          >
            Sign up here
          </Text>
        </Text>
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
  welcomeText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 19,
    marginBottom: 30,
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

export default Login;
