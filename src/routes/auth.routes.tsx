import React from "react";
import SignIn from "../pages/Signin";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

function AuthRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

export default AuthRoutes;