import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, FlatList } from 'react-native'
import Feather from '@expo/vector-icons/Feather';
import { api } from "../../services/api";
import Toast from "react-native-toast-message";
import { Select } from "../../components/Select";
import ItemList from "../../components/ItemList";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";

type RouteDetailParams = {
  Order: {
    table: number | string,
    order_id: string
  }
}

export type SelectItemProps = {
  id: string,
  name: string
}

export type ItemProps = {
  id: string,
  product_id: string
  name: string
  amount: string | number
}


type OrderRouteProps = RouteProp<RouteDetailParams, 'Order'>

export default function Order() {
  const route = useRoute<OrderRouteProps>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

  const [categories, setCategories] = useState<SelectItemProps[]>([])
  const [selectedCategory, setSelectedCategory] = useState<SelectItemProps | null>()
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)

  const [products, setProducts] = useState<SelectItemProps[]>([])
  const [selectedProduct, setSelectedProduct] = useState<SelectItemProps | null>()
  const [isProductsOpen, setIsProductsOpen] = useState(false)

  const [amount, setAmount] = useState('')
  const [items, setItems] = useState<ItemProps[]>([])

  useEffect(() => {
    async function loadCategories() {
      const response = await api.get('/category')
      setCategories(response.data)
    }

    loadCategories()
  }, [])

  useEffect(() => {
    async function loadCategories() {
      if (selectedCategory) {
        const response = await api.get('/product', {
          params: {
            category_id: selectedCategory?.id
          }
        })
        setProducts(response.data)
      }
    }
    loadCategories()
  }, [selectedCategory])

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

  function handleSelectCategory(item?: SelectItemProps) {
    setSelectedProduct(null)
    setSelectedCategory(item)
  }

  function handleSelectProduct(item?: SelectItemProps) {
    setSelectedProduct(item)
  }

  async function handleAddItem() {
    if (!selectedCategory || !selectedProduct || !Number(amount)) {
      return
    }

    const response = await api.post('order/item', {
      order_id: route.params.order_id,
      product_id: selectedProduct.id,
      amount: Number(amount)
    })

    const data: ItemProps = {
      id: response.data.id,
      product_id: selectedProduct.id,
      name: selectedProduct.name,
      amount
    }

    setItems([...items, data])
  }

  async function handleDeleteItem(id: string) {
    try {
      await api.delete(`order/item/${id}`)
      setItems(items.filter(item => item.id !== id))
      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Item removed from list',
        text2Style: { fontSize: 13 }
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error!',
        text2: 'Error on delete item',
        text2Style: { fontSize: 13 }
      });
    }
  }

  function handleFinishOrder() {
    navigation.navigate('FinishOrder', {
      table: route.params.table,
      order_id: route.params.order_id
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Table {route.params.table}</Text>
        <TouchableOpacity>
          <Feather name="trash-2" size={28} color="#7f1d1d" onPress={handleCloseOrder} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.select}
        onPress={() => setIsCategoriesOpen(true)}
      >
        <Text style={{ color: selectedCategory ? '#fafafa' : '#a3a3a3' }}>
          {selectedCategory
            ? selectedCategory?.name
            : 'Select a category'
          }
        </Text>
        <Feather
          style={{ display: selectedCategory?.name ? 'flex' : 'none' }}
          name="x"
          size={24}
          color="#7f1d1d"
          onPress={() => handleSelectCategory()} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.select, { opacity: !selectedCategory ? 0.4 : 1 }]}
        disabled={!selectedCategory}
        onPress={() => setIsProductsOpen(true)}
      >
        <Text style={{ color: selectedProduct ? '#fafafa' : '#a3a3a3' }}>
          {selectedProduct
            ? selectedProduct?.name
            : 'Select a prodcut'
          }
        </Text>
        <Feather
          style={{ display: selectedProduct?.name ? 'flex' : 'none' }}
          name="x"
          size={24}
          color="#7f1d1d"
          onPress={() => handleSelectProduct()} />
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
        <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!items.length}
          style={[styles.nextButton, { opacity: !items.length ? 0.3 : 1 }]}
          onPress={handleFinishOrder}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        keyExtractor={(item) => item.id}
        data={items}
        showsVerticalScrollIndicator={false}
        style={styles.items}
        renderItem={({ item }) => (<ItemList data={item} deleteItemFn={handleDeleteItem} />)}
      />

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

      <Modal
        transparent
        visible={isProductsOpen}
        animationType="slide"
      >
        <Select
          handleClose={() => setIsProductsOpen(false)}
          options={products}
          onSelect={handleSelectProduct}
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
    flexDirection: "row"
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
  },
  items: {
    flex: 1,
    flexDirection: "column",
    marginTop: 20,
    marginRight: 'auto',
    paddingLeft: 20,
  }
})