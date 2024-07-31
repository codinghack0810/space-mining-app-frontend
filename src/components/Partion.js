import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters'

const Partion = () => {
  return (
    <View style={styles.partion}>
        <View style={styles.line}></View>
        <Text style={styles.partionTxt}>Or</Text>
        <View style={styles.line}></View>
      </View>
  )
}

export default Partion

const styles = StyleSheet.create({
    partion: {
        width: '20%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
        marginTop: moderateVerticalScale(10),
      },
      line: {
        height: 2,
        backgroundColor: 'rgba(141, 152, 175, 0.40)',
        borderRadius: moderateScale(5),
        width: 20,
      },
      partionTxt: {
        color: 'rgba(141, 152, 175, 0.40)',
        fontSize: moderateScale(12),
        fontFamily: 'HeliosExt-Bold',
      },
})