import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters'

const TextContainer = ({heading, description}) => {
  return (
    <View style={styles.txtContainer}>
        <Text style={styles.headingTxt}>{heading}</Text>
        <Text style={styles.descriptionTxt}>
          {description}
        </Text>
      </View>
  )
}

export default TextContainer

const styles = StyleSheet.create({
    txtContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: moderateVerticalScale(10),
      },
      headingTxt: {
        width: '70%',
        fontFamily: 'HeliosExt-Bold',
        color: '#fff',
        textAlign: 'center',
        fontSize: moderateScale(22),
        lineHeight: moderateVerticalScale(30)
      },
      descriptionTxt: {
        color: '#8D98AF',
        fontSize: moderateScale(11),
        fontFamily: 'HeliosExt',
        textAlign:'center',
      },
})