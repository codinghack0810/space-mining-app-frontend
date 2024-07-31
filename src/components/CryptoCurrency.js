import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { moderateScale, moderateVerticalScale, scale, verticalScale } from 'react-native-size-matters'

const CryptoCurrency = ({icon, fullName, shortName, balance, cryptoBalance}) => {
    const images = {
        'bnb' : require('../assets/Images/bnb.png'),
        'usdt' : require('../assets/Images/usdt.png'),
        'usdc' : require('../assets/Images/usdc.png'),
        'busd' : require('../assets/Images/busd.png'),

    }
  return (
    <View style = {styles.cryptoCurrencyBox}>
      <View style = {styles.cryptoNameBox}>
      <Image source={images[icon]} style = {styles.cryptIcon}/>
        <View style = {styles.textContainer}>
            <Text style = {[styles.fullName]}>{fullName}</Text>
            <Text style = {styles.shortName}>{shortName}</Text>
        </View>
      </View>

      <View style = {styles.balanceBox}>
        <Text style = {styles.currentBalance}>{balance}</Text>
        <Text style = {styles.cryptoBalance}>${cryptoBalance}</Text>
      </View>
    </View>
  )
}

export default CryptoCurrency

const styles = StyleSheet.create({
    cryptoCurrencyBox:{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,.05)',
        paddingBottom: moderateVerticalScale(10)
    },
    cryptoNameBox:{
        flexDirection:'row',
        justifyContent: 'flex-start',
        alignItems:'center',
        gap: moderateScale(10),
        width: '50%'
    },
    cryptIcon:{
        width: scale(38),
        height: verticalScale(38),
        resizeMode: 'contain'
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
    balanceBox:{
        alignItems: 'flex-end',
        width: '50%'
    },
    currentBalance:{
        fontSize: moderateScale(12),
        color: '#fff',
        textAlign: 'right',
        fontFamily: 'HeliosExt-Bold'
    },
    cryptoBalance:{
        fontSize: moderateScale(12),
        color: '#777777',
        fontFamily: 'HeliosExt',
        marginTop: moderateVerticalScale(3)
    }
})