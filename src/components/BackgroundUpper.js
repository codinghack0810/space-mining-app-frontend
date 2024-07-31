import { StyleSheet, Image, View } from 'react-native'
import React from 'react'
import { moderateScale } from 'react-native-size-matters'

const BackgroundUpper = () => {
  return (
    <View style = {styles.imageContainer}>
        <Image source={require('../assets/Images/background.png')} style = {styles.bgImage}/>
        <Image source={require('../assets/Images/single-planet.png')} style ={styles.planet}/>
        <Image source={require('../assets/Images/right.png')} style = {styles.rightImg}/>
        <Image source={require('../assets/Images/left.png')} style = {styles.leftImg}/>
      </View>
  )
}

export default BackgroundUpper

const styles = StyleSheet.create({
    imageContainer : {
        alignItems: 'center',
        position: 'relative',
        width: '100%'
      },
      bgImage:{
        height: 190,
        resizeMode: 'contain',
        borderBottomLeftRadius: moderateScale(21),
        borderBottomRightRadius: moderateScale(21)
      },
      planet: {
        position: 'absolute',
        width: 160,
        height: 184,
        resizeMode: 'contain',
        bottom: -40,
      },
      rightImg:{
        position: 'absolute',
        right: 8,
        top: 50,
        width: 87,
        height: 85,
        resizeMode: 'cover'
      },
      leftImg:{
        position: 'absolute',
        left: 8,
        top: 50,
        width: 62,
        height: 57,
        resizeMode: 'contain'
      },
})