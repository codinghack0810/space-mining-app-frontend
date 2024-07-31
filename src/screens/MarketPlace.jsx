import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import {
  verticalScale,
  moderateScale,
  moderateVerticalScale,
} from 'react-native-size-matters';

const MarketPlace = ({navigation, route}) => {
  return (
    <View style = {styles.marketContainer}
    >
      <Image source={require('../assets/gif/market-loading-icon-min.gif')} style = {styles.bounceImage}/>
      {/* <Image source={require('../assets/Images/loading.png')} style = {styles.bounceImage}/> */}

      <Text style = {styles.marketTxt}>Marketplace</Text>

      <Image source={require('../assets/gif/market-image.gif')} style = {styles.marketImage}/>

      <Text style = {styles.comingTxt}>Coming Soon</Text>

    </View>
  )
}

export default MarketPlace

const styles = StyleSheet.create({
  marketContainer:{
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#1B232A',
  },
  bounceImage:{
    width: '100%',
    resizeMode: 'contain',
    position: 'relative',
    resizeMode: 'cover',
    height: verticalScale(190),
    top: moderateVerticalScale(-20),
    transform: [
      {scale: 1.15}
    ]
  },
  marketTxt:{
    fontSize: moderateScale(26),
    color: '#fff',
    textTransform: 'uppercase',
    fontFamily: 'HeliosExt-Bold',

    position: 'relative',
    top: moderateVerticalScale(-70)
  },
  marketImage:{
    width: '100%',
    height: verticalScale(300),
    resizeMode: 'cover',
    position:'relative',
    top: moderateVerticalScale(-70),
  },
  comingTxt:{
    color: '#7979CC',
    textTransform: 'uppercase',
    fontSize: moderateScale(26),
    lineHeight: moderateVerticalScale(38),
    fontFamily: 'HeliosExt-Bold',

    position: 'relative',
    top: moderateVerticalScale(-40)
  }
})