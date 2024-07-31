import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters'

const Button = ({txt, onPress, value}) => {
  return (
    <TouchableOpacity style={[styles.shareBtn, {bottom: moderateScale(value)}]} onPress={onPress} activeOpacity={0.7}>
        <Text style={styles.btnTxt}>{txt}</Text>
      </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({
    shareBtn:{
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: moderateVerticalScale(10),
        paddingHorizontal: moderateScale(10),
        backgroundColor: '#fff',
        position: 'absolute',
        borderRadius: moderateScale(15),
        alignSelf: 'center'
      },
      btnTxt:{
        fontSize: moderateScale(20),
        color: '#7979CC',
        textTransform: 'capitalize',
        fontFamily: 'HeliosExt-Bold'
      }
})