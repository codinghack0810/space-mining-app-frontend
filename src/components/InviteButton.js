import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, { useCallback } from 'react'
import {
    verticalScale,
    moderateScale,
    moderateVerticalScale,
    scale
  } from 'react-native-size-matters';

const InviteButton = ({navigation, token, connectionStatus}) => {
    const handleInviteBtn = useCallback(() => {
      navigation.navigate("Invite", {token : token, connectionStatus : connectionStatus})
    }, [navigation, token]);
  return (
    <TouchableOpacity style = {styles.inviteBtn} activeOpacity={.7} onPress={handleInviteBtn}>
      <View style = {styles.inviteBtnInsideContainer}>
        <Image source={require('../assets/Images/invite-icon.png')} style = {styles.inviteIcon}/>
        <Text style = {styles.inviteBtnTxt}>Invite your friends !</Text>
        <View style = {styles.rightArrowBox}><Image source={require('../assets/Images/right-arrow.png')} style = {styles.rightArrow}/></View>
      </View>
    </TouchableOpacity>
  )
}

export default InviteButton

const styles = StyleSheet.create({
    inviteBtn:{
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        width: '85%',
        paddingVertical: moderateVerticalScale(10),
        // paddingHorizontal: moderateScale(20),
        borderRadius: moderateScale(50)
    },
    inviteBtnInsideContainer:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '95%',
        // backgroundColor: 'red'
    },
    inviteIcon:{
        width: scale(38),
        height: verticalScale(38),
        resizeMode: 'contain'
    },
    inviteBtnTxt:{
        fontFamily: 'HeliosExt-Bold',
        fontSize: moderateScale(16),
        // lineHeight: moderateVerticalScale(31),
        textAlign: 'center',
        color:'#000'
    },
    rightArrowBox:{
        backgroundColor: '#000',
        width: 25,
        height: 25,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    rightArrow:{
        tintColor: '#fff',
        width: '50%',
        height: '50%',
        resizeMode: 'contain'
    }
})