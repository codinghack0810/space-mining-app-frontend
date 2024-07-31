import { StyleSheet } from 'react-native'
import React from 'react'
import { BlurView } from '@react-native-community/blur';


const Blur = () => {
  return (
    <BlurView 
        style={styles.absolute}
          blurType="dark"
          blurAmount={1}
        />
  )
}

export default Blur

const styles = StyleSheet.create({
    absolute:{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      },
})