import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { moderateScale, moderateVerticalScale, scale, verticalScale } from 'react-native-size-matters'

const CryptoGraphCurrency = ({icon, fullName, shortName, balance, percentage, index}) => {
    const percent = percentage.toString()
    const images = {
        'bnb' : require('../assets/Images/bnb.png'),
        'usdt' : require('../assets/Images/usdt.png'),
        'usdc' : require('../assets/Images/usdc.png'),
        'busd' : require('../assets/Images/busd.png'),
    }
  return (
    <>
      <View style= {styles.cryptoCover}>
      <View style = {styles.cryptoNameBox}>
      <Image source={images[icon]} style = {styles.cryptIcon}/>
        <View style = {styles.textContainer}>
            <Text style = {[styles.fullName]}>{fullName}</Text>
            <Text style = {styles.shortName}>{shortName}</Text>
        </View>
      </View>
      {percent.charAt(0) === "-" ? <Image source={require('../assets/Images/minus.png')} style = {styles.graphImage}/> : <Image source={require('../assets/Images/plus.png')} style = {styles.graphImage}/>}
      </View>


      <View style = {styles.balanceBox}>
        <Text style = {styles.currentBalance}>{balance}</Text>
        <Text style = {[styles.percent, {color: percent.charAt(0) === '-' ? '#DD4B4B' : '#5ED5A8'}]}>{percent}%</Text>
      </View>
    </>
  )
}

export default CryptoGraphCurrency

const styles = StyleSheet.create({
    cryptoCover:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '60%',
        gap: moderateScale(20),
    },
    balanceBox:{
        width: '40%'
    },
    cryptoNameBox:{
        flexDirection:'row',
        justifyContent: 'center',
        alignItems:'center',
        gap: moderateScale(10),
    },
    cryptIcon:{
        width: scale(38),
        height: verticalScale(38),
        resizeMode: 'contain',
    },
    fullName:{
        fontSize: moderateScale(12),
        color: '#fff',
        textTransform: 'capitalize',
        fontFamily: 'HeliosExt-Bold'
    },
    shortName:{
        fontSize: moderateScale(12),
        color: '#777777',
        textTransform: 'uppercase',
        fontFamily: 'HeliosExt',
        marginTop: moderateVerticalScale(3)
    },
    graphImage:{
        // width: 50,
        // height: 50,
        // resizeMode: 'contain',
        width: 80,
        height: 30,
        resizeMode:'contain'
    },
    currentBalance:{
        fontSize: moderateScale(12),
        color: '#fff',
        textAlign: 'right',
        fontFamily: 'HeliosExt-Bold',
        lineHeight: moderateScale(15)
    },
    percent:{
        fontSize: moderateScale(12),
        fontFamily: 'HeliosExt',
        marginTop: moderateVerticalScale(3),
        textAlign:'right'
    }
})