import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/Login/Login";
import Home from "../screens/Home/Home"; // Admin Home
import UserHome from "../screens/UserHome/UserHome"; // User Home
import SignUp from "../screens/SignUp/SignUp";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        {/* Admin Pages */}
        <Stack.Screen name="AdminHome" component={Home} />
        {/* User Pages */}
        <Stack.Screen name="UserHome" component={UserHome} />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
