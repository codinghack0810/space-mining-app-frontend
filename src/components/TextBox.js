import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters'

const TextBox = ({firstText, BtnText, onPress}) => {
  return (
    <View style={styles.txtBox}>
        <Text style={styles.alreadyAccount}>
          {firstText}
        </Text>
          <Pressable onPress={onPress}>
            <Text style={styles.signTxt}>{BtnText}</Text>
          </Pressable>
      </View>
  )
}

export default TextBox

const styles = StyleSheet.create({
    txtBox:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
        marginBottom: moderateVerticalScale(20)
      },
      alreadyAccount: {
        color: '#8D98AF',
        fontFamily: 'HeliosExt',
        fontSize: moderateScale(12),
        textAlign: 'center',
      },
      signTxt: {
        color: '#7979CC',
        fontFamily: 'HeliosExt-Bold',
        fontSize: moderateScale(12),
        textAlign: 'center',
        lineHeight: moderateVerticalScale(23)
      },
})