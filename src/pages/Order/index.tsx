import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native'
import Feather from '@expo/vector-icons/Feather';
import { api } from "../../services/api";
import Toast from "react-native-toast-message";
import { Select } from "../../components/Select";

type RouteDetailParams = {
  Order: {
    table: number | string,
    order_id: string
  }
}

export type CategoryProps = {
  id: string,
  name: string
}

type OrderRouteProps = RouteProp<RouteDetailParams, 'Order'>

export default function Order() {
  const route = useRoute<OrderRouteProps>();
  const navigation = useNavigation();

  const [categories, setCategories] = useState<CategoryProps[]>([])
  const [selectedCategory, setSelectedCategory] = useState<CategoryProps | null>()
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)

  const [amount, setAmount] = useState('')

  useEffect(() => {
    async function loadCategories() {
      const response = await api.get('/category')
      setCategories(response.data)
    }

    loadCategories()
  }, [])

  async function handleCloseOrder() {
    try {
      const response = await api.delete(`/order/${route.params?.order_id}`)
      Toast.show({
        type: 'success',
        text1: 'Done!',
        text2: 'Order successfully closed!',
        text2Style: { fontSize: 13 }
      });
      navigation.goBack()
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Fail on close order!',
        text2Style: { fontSize: 13 }
      });
    }
  }

  function handleSelectCategory(item: CategoryProps) {
    setSelectedCategory(item)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Table {route.params.table}</Text>
        <TouchableOpacity>
          <Feather name="trash-2" size={28} color="#7f1d1d" onPress={handleCloseOrder} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.select} onPress={() => setIsCategoriesOpen(true)}>
        <Text style={{ color: selectedCategory ? '#fafafa' : '#a3a3a3' }}>
          {selectedCategory
            ? selectedCategory?.name
            : 'Select a category'
          }
        </Text>
        <Feather 
        style={{display: selectedCategory?.name ? 'flex': 'none'}}
        name="x" 
        size={24} 
        color="#7f1d1d" 
        onPress={() => setSelectedCategory(null)} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.select}>
        <Text style={{ color: '#a3a3a3' }}>Pizzas</Text>
      </TouchableOpacity>
      <View style={styles.amountContainer}>
        <Text style={styles.amountText}>Amount</Text>
        <TextInput
          placeholder="0"
          placeholderTextColor="#a3a3a3"
          style={[styles.select, { width: '65%', textAlign: "center" }]}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        visible={isCategoriesOpen}
        animationType="slide"
      >
        <Select
          handleClose={() => setIsCategoriesOpen(false)}
          options={categories}
          onSelect={handleSelectCategory}
        />
      </Modal>
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
  },
  header: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginRight: 'auto',
    paddingLeft: 20
  },
  title: {
    fontSize: 26,
    color: '#fafafa',
    fontWeight: 'bold'
  },
  select: {
    width: '90%',
    height: 48,
    backgroundColor: 'transparent',
    color: '#fafafa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333333',
    paddingHorizontal: 12,
    textAlign: 'center',
    fontSize: 16,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection:"row"
  },
  amountContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  amountText: {
    fontSize: 24,
    color: '#fafafa',
    fontWeight: 'bold'
  },
  actions: {
    flexDirection: "row",
    width: '90%',
    justifyContent: "space-between",
    height: 48
  },
  addButton: {
    backgroundColor: "#16a34a",
    borderRadius: 8,
    width: '25%',
    alignItems: "center",
    justifyContent: "center"
  },
  nextButton: {
    backgroundColor: "#dc2626",
    borderRadius: 8,
    width: '70%',
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    color: '#fafafa',
    fontSize: 24,
    fontWeight: "bold"
  }
})