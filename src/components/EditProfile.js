import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {
  verticalScale,
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';

const EditProfile = ({name, value, onPress}) => {
  return (
    <TouchableOpacity style={styles.profileSetting} onPress={onPress}>
      <View style={styles.profileTxtContainer}>
        <Text style={styles.profileTxt}>{name}</Text>
      </View>

      <View style={styles.profileEditBox}>
        <Text style = {[styles.userNameTxt, {top : name === 'password' ? 5 : null, position:  name === 'password' ? 'relative' : null}]}>{value}</Text>
        <Image
          source={require('../assets/Images/right-long-arrow.png')}
          style={styles.rightLongArrow}
        />
      </View>
    </TouchableOpacity>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  profileSetting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: moderateScale(10),
    borderBottomColor: 'rgba(255,255,255,.02)',
    borderBottomWidth: 1,
    paddingBottom: moderateVerticalScale(20),
  },
  profileTxtContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: moderateScale(8),
  },
  profileIcon: {
    width: scale(30),
    height: verticalScale(28),
    resizeMode: 'contain',
  },
  profileTxt: {
    color: '#C1C7CD',
    fontFamily: 'HeliosExt',
    lineHeight: moderateVerticalScale(21),
    fontSize: moderateScale(12),
    textTransform: 'capitalize'
  },
  profileEditBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: moderateScale(8),
  },
  userNameTxt: {
    color: '#777777',
    fontFamily: 'HeliosExt',
    fontSize: moderateScale(12),
  },
  rightLongArrow: {
    width: scale(20),
    height: verticalScale(20),
    resizeMode: 'contain',
    tintColor: '#777777',
  },
});
