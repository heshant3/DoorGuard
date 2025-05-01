import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const DoorLock = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <View style={styles.outerCircle}>
            <View style={styles.iconBackground}>
              <Ionicons name="lock-closed-outline" size={60} color="#2563eb" />
            </View>
          </View>
        </View>
        <Text style={styles.statusText}>Door Locked</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.lockButton]}>
            <Ionicons name="lock-closed-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Lock Door</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.unlockButton]}>
            <Ionicons name="lock-open-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Unlock Door</Text>
          </TouchableOpacity>
        </View>
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
});

export default DoorLock;
