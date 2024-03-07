import React from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { ItemProps } from "../../pages/Order"
import Feather from '@expo/vector-icons/Feather';

interface ItemListProps {
  data: ItemProps,
  deleteItemFn: (item_id: string) => void
}

export default function ItemList({ data, deleteItemFn }: ItemListProps) {

  function handleDeleteItem() {
    deleteItemFn(data.id)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.itemText}>{data.amount} - {data.name}</Text>
      <TouchableOpacity>
        <Feather name="trash-2" size={20} color="#7f1d1d" onPress={handleDeleteItem} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '97%',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: '#262626',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12
  },
  itemText: {
    color: '#fafafa',
    fontSize: 16
  }
})