import React from "react";
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from "react-native";
import { SelectItemProps } from "../../pages/Order";

interface SelectProps {
  options: SelectItemProps[]
  handleClose: () => void
  onSelect: (item: SelectItemProps) => void
}

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')

export function Select({ options, handleClose, onSelect }: SelectProps) {
  function handleOnSelect(item: SelectItemProps) {
    onSelect(item)
    handleClose()
  }

  const option = options.map((item, index) => (
    <TouchableOpacity
      key={index}
      style={styles.option}
      onPress={() => handleOnSelect(item)}>
      <Text style={styles.item}>{item.name}</Text>
    </TouchableOpacity>
  ))

  return (
    <TouchableOpacity style={styles.container} onPress={handleClose}>
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {option}
        </ScrollView>
      </View>

    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center"
  },
  content: {
    width: WIDTH - 24,
    height: HEIGHT / 2,
    backgroundColor: '#262626',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#262626'
  },
  option: {
    alignItems: "flex-start",
    borderBottomWidth: 0.4,
    borderBottomColor: '#fafafa'
  },
  item: {
    margin: 20,
    fontSize: 14,
    fontWeight: "bold",
    color: '#fafafa'
  }
})