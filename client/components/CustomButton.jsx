import { TouchableOpacity, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CustomButton = ({title, handlePress, containerStyles, textStyles, isLoading}) => {
  return (
    <TouchableOpacity 
        onPress={handlePress}
        activeOpacity={0.7}
        className={`bg-primary rounded-xl min-h-[62px] flex flex-row justify-center items-center ${containerStyles} ${isLoading ? "opacity-50" : ""}`}
    >
        <Text className={`text-white font-psemibold text-xl ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton

const styles = StyleSheet.create({})