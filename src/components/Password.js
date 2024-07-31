import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';

const Password = ({password, setPassword, title}) => {
  const [passwordEye, setPasswordEye] = useState(true);

  const handleChangePassword = txt => {
    if (txt.includes(' ')) {
      setPassword(txt.replaceAll(' ',''));
      return;
    }
    setPassword(txt);
  };

  return (
    <View
      style={{
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: moderateVerticalScale(5),
      }}>
      <Text style={styles.fieldText}>{title}</Text>
      <View style={styles.inputBox}>
        <TextInput
          style={[styles.inputTxt, {width: '90%'}]}
          secureTextEntry={passwordEye}
          maxLength={20}
          value={password}
          onChangeText={txt => handleChangePassword(txt)}
        />
        <Pressable
          onPress={() => setPasswordEye(!passwordEye)}
          style={styles.eyeBtn}>
          {passwordEye ? (
            <Image
              source={require('../assets/Images/hidden.png')}
              style={styles.eyeIcon}
            />
          ) : (
            <Image
              source={require('../assets/Images/visible.png')}
              style={styles.eyeIcon}
            />
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default Password;

const styles = StyleSheet.create({
  fieldText: {
    fontSize: moderateScale(12),
    color: '#fff',
    fontFamily: 'HeliosExt',
  },
  inputBox: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderRadius: moderateScale(10),
    width: '100%',
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateVerticalScale(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputTxt: {
    width: '100%',
    color: '#fff',
    fontSize: moderateScale(12),
    fontFamily: 'HeliosExt',
  },
  eyeBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    tintColor: '#7979CC',
  },
});
