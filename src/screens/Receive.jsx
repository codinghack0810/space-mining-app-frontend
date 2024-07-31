import {Image, StyleSheet, Text, Pressable, View, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';
import CloseBtn from '../components/CloseBtn';
import Button from '../components/Button';
import Clipboard from '@react-native-clipboard/clipboard';
import Share from 'react-native-share';
import QRCode from 'react-native-qrcode-svg';
import * as Animatable from 'react-native-animatable';
import {useRoute} from '@react-navigation/native';

const Receive = ({navigation}) => {
  const route = useRoute();
  const address = route.params.address;
  const [copy, setCopy] = useState(false);

  const copyToClipboard = () => {
    Clipboard.setString(address);
    setCopy(true);
    setTimeout(() => {
      setCopy(false);
    }, 1500);
  };

  const handleShare = async () => {
    const options = {
      message: address,
    };
    try {
      const result = await Share.open(options);
      console.log('Share successfully', result);
    } catch (error) {
      console.log('Error....', error);
    }
  };

  return (
    <Animatable.View
      style={styles.receiveContainer}
      animation={'fadeInUpBig'}
      duration={1200}>
      <View style={styles.qrContainer}>
        <Text style={styles.qrTxt}>My QR Code</Text>
        <View style={styles.qrBox}>
          <QRCode
            value={address}
            size={250}
            backgroundColor="transparent"
            color="#000"
          />
        </View>
      </View>

      <View style={styles.walletAddress}>
        <Text style={styles.addressTxt}>Address</Text>
        <View style={styles.addressLink}>
          <ScrollView style={styles.addressLinkBox} horizontal showsHorizontalScrollIndicator = {false}>
            <Text style={styles.addressLinkText}>
              {address ? address : 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'}
            </Text>
          </ScrollView>
          <Pressable style={styles.copyBox} onPress={copyToClipboard}>
            <Image
              source={
                !copy
                  ? require('../assets/Images/copy.png')
                  : require('../assets/Images/right-icon.png')
              }
              style={styles.copyIcon}
            />
          </Pressable>
        </View>
      </View>

      <Button txt={'Share'} onPress={handleShare} value={30} />

      <CloseBtn onPress={() => navigation.goBack()} />
    </Animatable.View>
  );
};

export default Receive;

const styles = StyleSheet.create({
  receiveContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B232A',
  },
  qrContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: moderateScale(10),
  },
  qrTxt: {
    color: '#fff',
    fontSize: moderateScale(26),
    fontFamily: 'HeliosExt-Bold',
  },
  qrBox: {
    width: 320,
    height: 320,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(16),
  },

  walletAddress: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: moderateVerticalScale(10),
    marginTop: moderateVerticalScale(30),
  },
  addressTxt: {
    color: '#fff',
    fontSize: moderateScale(26),
    fontFamily: 'HeliosExt-Bold',
  },
  addressLink: {
    width: '80%',
    backgroundColor: '#161C22',
    borderRadius: moderateScale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: moderateScale(18),
    height: verticalScale(30),
  },
  addressLinkBox: {
    marginLeft: moderateScale(30),
    width: '70%',
  },
  addressLinkText:{
    fontSize: moderateScale(10),
    color: '#777777',
    fontFamily: 'HeliosExt',
    width: '200%',
    // overflow: 'scroll'
  },
  copyBox: {
    height: '100%',
    width: moderateScale(40),
    backgroundColor: '#fff',
    borderTopRightRadius: moderateScale(12),
    borderBottomRightRadius: moderateScale(12),
    justifyContent: 'center',
  },
  copyIcon: {
    width: scale(18),
    height: verticalScale(18),
    resizeMode: 'contain',
    marginLeft: 5,
    tintColor: '#7979CC',
    marginLeft: 10,
  },
});
