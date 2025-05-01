import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";
import DoorLock from "./tabs/DoorLock";
import UsersAdd from "./tabs/UsersAdd";
import ActivityCheck from "./tabs/ActivityCheck";
import Profile from "./tabs/Profile";

const Tab = createBottomTabNavigator();

const Home = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="DoorLock"
        component={DoorLock}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="lock" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="UsersAdd"
        component={UsersAdd}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-add" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ActivityCheck"
        component={ActivityCheck}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="history" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Home;
