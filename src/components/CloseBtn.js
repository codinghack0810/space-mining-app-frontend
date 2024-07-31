import { StyleSheet,TouchableOpacity, Image} from 'react-native'
import React from 'react'
import {
    verticalScale,
    moderateScale,
    moderateVerticalScale,
    scale,
  } from 'react-native-size-matters';

const CloseBtn = ({onPress}) => {
  return (
    <TouchableOpacity
            style={styles.closeBtn}
            onPress={onPress}>
            <Image
              source={require('../assets/Images/close-icon.png')}
              style={styles.closeImage}
            />
          </TouchableOpacity>
  )
}

export default CloseBtn

const styles = StyleSheet.create({
    closeBtn: {
        width: scale(30),
        height: verticalScale(30),
        position: 'absolute',
        right: moderateScale(30),
        top: moderateVerticalScale(50),
      },
      closeImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
      },
})