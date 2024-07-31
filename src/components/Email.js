import {StyleSheet, Text, View, TextInput} from 'react-native';
import React from 'react';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';

const Email = ({email, setEmail}) => {
  const hanldeEmail = txt => {
    if (txt.includes(' ')) {
      setEmail(txt.replaceAll(' ',''));
      return;
    }
    setEmail(txt);
  };
  return (
    <View
      style={{
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: moderateScale(5),
      }}>
      <Text style={styles.fieldText}>E-Mail</Text>
      <View style={styles.inputBox}>
        <TextInput
          style={styles.inputTxt}
          inputMode="email"
          value={email}
          onChangeText={txt => hanldeEmail(txt)}
          autoComplete="email"
        />
      </View>
    </View>
  );
};

export default Email;

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
});
