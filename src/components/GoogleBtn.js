import { StyleSheet, TouchableOpacity, Image, View, Text } from 'react-native'
import React from 'react'
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters'

const GoogleBtn = ({onPress, title}) => {
  return (
    <TouchableOpacity style = {styles.btn} onPress = {onPress}>
        <View style = {styles.btnContentBox}><Image source={require('../assets/Images/google.png')} style = {styles.googleImage}/><Text style = {styles.btnTxt}>{title}</Text></View>
    </TouchableOpacity>
  )
}

export default GoogleBtn

const styles = StyleSheet.create({
    btn:{
        backgroundColor: '#fff',
        width: '100%',
        justifyContent:'center',
        alignItems: 'center',
        paddingVertical: moderateVerticalScale(20),
        paddingHorizontal: moderateScale(10),
        borderRadius: moderateScale(10)
      },
      btnContentBox:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: moderateScale(10)
      },
      googleImage:{
        width: 17,
        height: 17,
        resizeMode: 'contain'
      },
      btnTxt:{
        fontFamily:'HeliosExt-Bold',
        fontSize: moderateScale(13),
        color: '#101817',
      }
})