import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import { api } from "../../services/api";
import Toast from "react-native-toast-message";

type RouteDetailParams = {
  FinishOrder: {
    table: number | string,
    order_id: string
  }
}

type FinishOrderRouteProps = RouteProp<RouteDetailParams, 'FinishOrder'>

export default function FinishOrder() {
  const route = useRoute<FinishOrderRouteProps>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

  async function handleFinishOrder() {
    try {
      await api.put('/order/send', {
        id: route.params.order_id
      })
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Order send to kitchen!',
        text2Style: { fontSize: 13 }
      });
      navigation.popToTop()
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Fail on send order!',
        text2Style: { fontSize: 13 }
      });
    }

  }

  return (
    <View style={styles.container}>
      <Text style={styles.confirmationText}>
        Do you want to finish the order?
      </Text>
      <Text style={styles.tableText}>
        Table: {route.params?.table}
      </Text>
      <TouchableOpacity style={styles.buttonContainer} onPress={handleFinishOrder}>
        <Feather name="shopping-cart" size={22} color="#fafafa" />
        <Text style={styles.buttonText}>
          Finish order
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    gap: 16,
    paddingHorizontal: '4%',
    paddingVertical: '5%',
    alignItems: "center",
    justifyContent: "center"
  },
  confirmationText: {
    color: '#fafafa',
    fontSize: 20,
    fontWeight: 'bold'
  },
  tableText: {
    color: '#fafafa',
    fontSize: 32,
    fontWeight: 'bold'
  },
  buttonContainer: {
    flexDirection: "row",
    backgroundColor: "#dc2626",
    width: '60%',
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  buttonText: {
    color: '#fafafa',
    fontSize: 20,
    fontWeight: 'bold'
  }
})