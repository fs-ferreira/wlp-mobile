import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import React, { useContext, useState } from "react"
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native"
import { AuthContext } from "../../contexts/AuthContexts"
import { StackParamsList } from "../../routes/app.routes"
import { api } from "../../services/api"

export default function Dashboard() {
  const { signOut } = useContext(AuthContext)
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>()

  const [table, setTable] = useState('')

  async function handleOpenOrder() {
    if(!table.length){
      return
    }
    const response = await api.post('/order', {
      table: Number(table)
    })

    navigation.navigate('Order', {table, order_id: response.data.id})
    setTable('')
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>New order</Text>
      <TextInput
        placeholder="Table's number"
        placeholderTextColor="#a3a3a3" 
        style={styles.input}
        keyboardType="numeric"
        value={table}
        onChangeText={setTable}
        />
      <TouchableOpacity style={styles.button} onPress={handleOpenOrder}>
        <Text style={styles.buttonText}>Open table</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    gap: 16
  },
  title: {
    fontSize: 32,
    color: '#fafafa',
    fontWeight: 'bold'
  },
  input: {
    width: '90%',
    height: 48,
    backgroundColor: 'transparent',
    color: '#fafafa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333333',
    paddingHorizontal: 12,
    textAlign: 'center',
    fontSize: 16
  },
  button: {
    width: '90%',
    height: 48,
    backgroundColor: "#dc2626",
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: "#fef2f2"
  }
})