import {
  StyleSheet,
  Text,
  Modal,
  View,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import CloseBtn from '../components/CloseBtn';

const {height} = Dimensions.get('window');
const RedeemBalance = ({
  token,
  setRedeemBalance,
  setRedeemTransaction,
  setRetry,
  connectionStatus,
}) => {
  const [redeem, setRedeem] = useState({
    address: '',
    count: '',
  });
  const [loading, setLoading] = useState(false);
  const [walletMsg, setWalletMsg] = useState(false);
  const [amountMsg, setAmountMsg] = useState(false);
  const [reward, setReward] = useState(null);

  //   getProfile api
  const getProfile = async () => {
    try {
      const response = await fetch('http://3.68.231.50:3007/api/get-profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.Success) {
        // console.log("result...............///////////",result)
        setReward(result);
      }
    } catch (err) {
      console.log('Error get profile ', err);
    }
  };

  useEffect(() => {
    if (connectionStatus) {
      getProfile();
    }
  }, [connectionStatus]);

  const redeemTokenAPI = async () => {
    if (redeem.count === '') {
      setAmountMsg(true);
      return;
    }
    if (redeem.address === '') {
      setWalletMsg(true);
      return;
    }
    setLoading(true);
    if (Number(redeem.count) < 1000) {
      setLoading(false);
      return;
    }
    if (Number(redeem.count) > reward?.Profile.Inapptokens) {
      setLoading(false);
      return;
    }
    if (Number(redeem.count) <= 0) {
      setLoading(false);
      return;
    }
    if (redeem.count?.split('.')[1]?.length >= 5) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch('http://3.68.231.50:3007/api/redeemtoken', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: redeem.address,
          count: redeem.count,
        }),
      });
      const result = await response.json();
      console.log('result.....////', result);
      if (result.Success) {
        setRedeem({
          address: '',
          count: '',
        });
        setLoading(false);
        setRedeemBalance(false);
        setRedeemTransaction(true);
        return;
      }
      setRedeem({
        address: '',
        count: '',
      });
      setLoading(false);
      setRedeemBalance(false);
      setRetry(true);
    } catch (error) {
      console.log('Redeem Token api error', error);
      setLoading(false);
      setRedeemBalance(false);
      setRetry(true);
    }
  };

  const handleRedeemAmount = txt => {
    setAmountMsg(false);
    setRedeem(prev => ({
      ...prev,
      count: txt,
    }));
  };

  const handleRedeemAddress = txt => {
    setWalletMsg(false);
    setRedeem(prev => ({...prev, address: txt}));
  };

  return (
    <>
      <Modal transparent={true} animationType="fade">
        <View style={{flex: 1, alignItems: 'center'}}>
          <View
            style={[
              styles.redeemBg,
              {
                marginTop: (height - verticalScale(600)) / 2,
                marginBottom: (height - verticalScale(500)) / 2,
              },
            ]}>
            <ImageBackground
              style={styles.redeemHeader}
              source={require('../assets/Images/redeem-header.png')}>
              <Image
                style={styles.redeemHeaderLeft}
                source={require('../assets/Images/redeem-header-left.png')}
              />
              <Text style={styles.redeemTxt}>Redeem Token</Text>
              <Image
                style={styles.redeemHeaderRight}
                source={require('../assets/Images/redeem-header-right.png')}
              />
            </ImageBackground>

            <View style={styles.redeemContainer}>
              <View style={{width: '100%'}}>
                {/* Amount box */}
                <View style={styles.amountContainer}>
                  <Text style={styles.redeemInputLabelTxt}>Amount</Text>
                  <TextInput
                    placeholder="Minimum amount 1000 SOM"
                    style={styles.redeemInput}
                    keyboardType="numeric"
                    placeholderTextColor={'#808080'}
                    value={redeem.count}
                    onChangeText={txt => handleRedeemAmount(txt)}
                  />
                  {Number(redeem.count) > reward?.Profile.Inapptokens ? (
                    <Text style={styles.warningMsg}>Insufficient Balance</Text>
                  ) : redeem.count?.split('.')[1]?.length >= 5 ? (
                    <Text style={styles.warningMsg}>
                      You can enter decimal value upto 4 digits
                    </Text>
                  ) : amountMsg ? (
                    <Text style={styles.warningMsg}>
                      Amount should not be empty
                    </Text>
                  ) : redeem.count === '' ? null : Number(redeem.count) <
                    1000 ? (
                    <Text style={styles.warningMsg}>
                      Minimum amount should be 1000 SOM
                    </Text>
                  ) : (
                    Number(redeem.count) <= 0 && (
                      <Text style={styles.warningMsg}>Invalid Amount</Text>
                    )
                  )}
                </View>

                {/* Wallet addresss box */}
                <View
                  style={[
                    styles.amountContainer,
                    {marginTop: verticalScale(10)},
                  ]}>
                  <Text style={styles.redeemInputLabelTxt}>Wallet</Text>
                  <TextInput
                    placeholder="Wallet Add..."
                    style={styles.redeemInput}
                    placeholderTextColor={'#808080'}
                    value={redeem.address}
                    onChangeText={txt => handleRedeemAddress(txt)}
                  />
                  {walletMsg && (
                    <Text style={styles.warningMsg}>
                      Wallet address should not be empty
                    </Text>
                  )}
                </View>
              </View>

              {/* Confirm Button */}
              <TouchableOpacity
                style={{width: '100%'}}
                onPress={() => redeemTokenAPI()}>
                <LinearGradient
                  colors={['rgba(97, 0, 255, 0.30)', 'rgba(97, 0, 255, 0.00)']}
                  style={styles.gradientButton}
                  useAngle={true}
                  angle={90}
                  angleCenter={{x: 0.5, y: 0.5}}>
                  {loading ? (
                    <ActivityIndicator color={'#fff'} size={22} />
                  ) : (
                    <Text style={styles.confirmTxt}>Confirm</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.redeemCloseBtn}>
              <CloseBtn onPress={() => setRedeemBalance(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default RedeemBalance;

const styles = StyleSheet.create({
  redeemBg: {
    width: '85%',
    height: verticalScale(500),
    backgroundColor: '#1B232A',
    borderRadius: moderateScale(25),
    overflow: 'hidden',
    alignItems: 'center',
  },
  redeemHeader: {
    width: '100%',
    height: verticalScale(150),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
    position: 'relative',
    top: verticalScale(-10),
  },
  redeemHeaderLeft: {
    position: 'absolute',
    width: scale(90),
    height: scale(90),
    resizeMode: 'contain',
    left: moderateScale(-10),
    top: verticalScale(15),
  },
  redeemTxt: {
    color: '#fff',
    fontFamily: 'HeliosExt-Bold',
    fontSize: moderateScale(19),
  },
  redeemHeaderRight: {
    position: 'absolute',
    width: scale(90),
    height: scale(90),
    resizeMode: 'contain',
    right: moderateScale(-30),
    bottom: verticalScale(10),
  },
  redeemContainer: {
    width: '75%',
    height: '65%',
    justifyContent: 'space-between',
  },
  amountContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: verticalScale(5),
  },
  redeemInputLabelTxt: {
    color: '#8C5BF5',
    fontSize: moderateScale(13),
    fontFamily: 'HeliosExt-Bold',
  },
  redeemInput: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderRadius: moderateScale(10),
    width: '100%',
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateVerticalScale(10),
    color: '#fff',
    fontSize: moderateScale(12),
  },
  gradientButton: {
    width: '100%',
    padding: scale(10),
    paddingVertical: verticalScale(15),
    marginTop: verticalScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7979CC',
    borderRadius: moderateScale(10),
  },
  confirmTxt: {
    fontFamily: 'HeliosExt-Bold',
    color: '#C9C9FF',
    fontSize: moderateScale(14),
  },
  redeemCloseBtn: {
    position: 'absolute',
    right: moderateScale(-15),
    top: moderateScale(-40),
  },
  warningMsg: {
    fontSize: moderateScale(11),
    color: 'red',
  },
});
