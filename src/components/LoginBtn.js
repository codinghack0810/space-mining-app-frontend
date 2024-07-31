import { StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters'

const LoginBtn = ({name, onPress, isLoading}) => {
  return (
    <TouchableOpacity style = {styles.btn} onPress = {onPress}>
        {isLoading ? <ActivityIndicator color={'#fff'} size={22}/> : <Text style = {styles.btnTxt}>{name}</Text>}
      </TouchableOpacity>
  )
}

export default LoginBtn

const styles = StyleSheet.create({
    btn:{
        backgroundColor: '#7979CC',
        width: '100%',
        justifyContent:'center',
        alignItems: 'center',
        paddingVertical: moderateVerticalScale(20),
        paddingHorizontal: moderateScale(10),
        borderRadius: moderateScale(10)
      },
      btnTxt:{
        fontFamily:'HeliosExt-Bold',
        fontSize: moderateScale(13),
        color: '#fff',
        textTransform:'capitalize'
      }
})