import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import DoorLock from "../Home/tabs/DoorLock";
import Profile from "../Home/tabs/Profile";

const Tab = createBottomTabNavigator();

const UserHome = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="DoorLock"
        component={DoorLock}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="lock-closed-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default UserHome;
