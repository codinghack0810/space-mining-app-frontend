import {StyleSheet, Text, View, Modal, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import { moderateScale, moderateVerticalScale, scale, verticalScale } from 'react-native-size-matters';

const CustomModal = ({txt, onPress, icon,btnTxt}) => {
  return (
    <Modal transparent={true} animationType="fade">
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.modalContainer}>
          <Image
            source={icon}
            style={styles.mailIcon}
          />
          <Text style={styles.checkTxt}>{txt}</Text>
          <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.btn} onPress={onPress}>
              <Text style={styles.btnTxt}>{btnTxt ? btnTxt : 'OK'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        borderRadius: moderateScale(24),
        backgroundColor:'#1B232A',
        gap: moderateVerticalScale(15),
        paddingVertical: moderateVerticalScale(20),
      },
      mailIcon: {
        width: scale(45),
        height: verticalScale(45),
        resizeMode: 'contain',
      },
      checkTxt: {
        fontFamily: 'HeliosExt',
        fontSize: moderateScale(12),
        color: '#fff',
        textAlign: 'center',
        lineHeight: moderateVerticalScale(15)
      },
      btnContainer: {
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center'
      },
      btn: {
        backgroundColor: '#7979CC',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: moderateVerticalScale(10),
        paddingHorizontal: moderateScale(10),
        borderRadius: moderateScale(10),
      },
      btnTxt: {
        fontFamily: 'HeliosExt',
        fontSize: moderateScale(12),
        color: '#fff',
        textAlign: 'center'
      },
});
