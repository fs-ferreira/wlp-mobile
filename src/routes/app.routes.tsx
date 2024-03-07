import React from "react";
import Dashboard from "../pages/Dashboard";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Order from "../pages/Order";
import FinishOrder from "../pages/FinishOrder";

export type StackParamsList = {
  Dashboard: undefined,
  Order: {
    table: number | string,
    order_id: string
  },
  FinishOrder: {
    table: number | string,
    order_id: string
  }
}

const Stack = createNativeStackNavigator<StackParamsList>();

function AppRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
      <Stack.Screen name="Order" component={Order} options={{ headerShown: false }} />
      <Stack.Screen name="FinishOrder" component={FinishOrder}
        options={{
          headerTitle: 'Almost done!',
          headerStyle: { backgroundColor: '#121212', },
          headerTintColor: '#fafafa'
        }}
      />
    </Stack.Navigator>
  )

}

export default AppRoutes;