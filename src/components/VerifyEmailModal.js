import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';

const VerifyEmailModal = ({visible, onPress, txt}) => {
  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.modalContainer}>
          <Image
            source={require('../assets/Images/mail-icon.png')}
            style={styles.mailIcon}
          />
          <Text style={styles.checkTxt}>Check Your E-Mail</Text>
          <Text style={styles.sentTxt}>{txt}</Text>
          <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.btn} onPress={onPress}>
              <Text style={styles.btnTxt}>I got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default VerifyEmailModal;

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    borderRadius: moderateScale(24),
    backgroundColor: '#1B232A',
    gap: moderateVerticalScale(15),
    paddingVertical: moderateVerticalScale(20),
  },
  mailIcon: {
    width: scale(45),
    height: verticalScale(45),
    resizeMode: 'contain',
  },
  checkTxt: {
    fontFamily: 'Lato-Bold',
    fontSize: moderateScale(16),
    color: '#fff',
    textAlign: 'center',
  },
  sentTxt: {
    textAlign: 'center',
    color: '#8D98AF',
    width: '80%',
    fontSize: moderateScale(14),
  },
  btnContainer: {
    width: '50%',
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
    fontFamily: 'Lato-Bold',
    fontSize: moderateScale(16),
    color: '#fff',
  },
});
