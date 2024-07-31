import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  Dimensions,
  AppState,
  BackHandler,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  verticalScale,
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
import InviteButton from '../components/InviteButton';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import Blur from '../components/Blur';
import CustomModal from '../components/CustomModal';
import RedeemBalance from './RedeemBalance';
import RewardTimer from '../components/RewardTimer';

const {height} = Dimensions.get('window');

const Home = ({
  token,
  connectionStatus,
  setRedeemBalance,
  redeemBalance,
  isClose,
  setIsClose,
  setUserLoginToken,
  setAccessTokenExpire,
}) => {
  // console.log('Home');
  const navigation = useNavigation();
  const [retry, setRetry] = useState(false);
  const [redeemtransaction, setRedeemTransaction] = useState(false);
  const [internetStableMsg, setInternetStableMsg] = useState(false);
  const [rewardTime, setRewardTime] = useState(false);

  const handleRedeemBalance = () => {
    setRedeemBalance(true);
  };

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'Exit App',
        'Are you sure you want to exit?',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {text: 'Yes', onPress: () => BackHandler.exitApp()},
        ],
        {cancelable: false},
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{flex: 1, backgroundColor: '#1B232A'}}>
        <View style={styles.homeContainer}>
          <Image
            source={require('../assets/gif/astronot.gif')}
            // source={require('../assets/Images/astronot.png')}
            style={styles.astronotImage}
          />

          <RewardTimer
            token={token}
            setRewardTime={setRewardTime}
            setInternetStableMsg={setInternetStableMsg}
            handleRedeemBalance={handleRedeemBalance}
            isClose={isClose}
            setIsClose={setIsClose}
            setUserLoginToken={setUserLoginToken}
            setAccessTokenExpire={setAccessTokenExpire}
            connectionStatus={connectionStatus}
          />

          <Animatable.View
            style={styles.homeInviteBtn}
            animation={'fadeInDown'}
            duration={1000}>
            <InviteButton
              navigation={navigation}
              token={token}
              connectionStatus={connectionStatus}
            />
          </Animatable.View>
        </View>
      </ScrollView>

      {(rewardTime || retry || redeemtransaction || internetStableMsg) && (
        <Blur />
      )}

      {redeemBalance && (
        <RedeemBalance
          token={token}
          setRedeemBalance={setRedeemBalance}
          setRedeemTransaction={setRedeemTransaction}
          setRetry={setRetry}
          connectionStatus={connectionStatus}
        />
      )}

      {redeemtransaction && (
        <CustomModal
          txt={'Tokens have been Redeemed'}
          onPress={() => setRedeemTransaction(false)}
          icon={require('../assets/Images/transaction.png')}
        />
      )}

      {rewardTime && (
        <CustomModal
          txt={'Reward Collected'}
          onPress={() => setRewardTime(false)}
          icon={require('../assets/Images/money.png')}
        />
      )}
      {retry && (
        <CustomModal
          txt={'Try Again'}
          onPress={() => setRetry(false)}
          icon={require('../assets/Images/retry.png')}
        />
      )}
      {internetStableMsg && (
        <CustomModal
          txt={'You internet connection is not stable!'}
          onPress={() => setInternetStableMsg(false)}
          icon={require('../assets/Images/retry.png')}
          btnTxt={'Try Again'}
        />
      )}
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    alignItems: 'center',
  },
  astronotImage: {
    width: '100%',
    height: height - 280,
    resizeMode: 'cover',
  },
  progressBar: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#00FF9F',
    height: verticalScale(24),
    borderRadius: moderateScale(15),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    position: 'relative',
    bottom: verticalScale(10),
  },
  progressBarStatus: {
    width: '50%',
    height: '100%',
    backgroundColor: '#54B490',
    borderRadius: moderateScale(15),
  },
  progressImage: {
    position: 'relative',
    width: 70,
    height: 70,
    resizeMode: 'contain',
    borderWidth: 2,
    borderColor: '#54B490',
    borderRadius: 40,
  },
  balanceBox: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: moderateVerticalScale(20),
  },
  balanceView: {
    height: verticalScale(23),
    minWidth: scale(125),
    maxWidth: scale(200),
    borderWidth: 2,
    borderColor: '#5ED5A8',
    paddingHorizontal: moderateScale(8),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(20),
    backgroundColor: '#fff',
  },
  balanceText: {
    fontFamily: 'HeliosExt-Bold',
    color: '#000',
    fontSize: moderateScale(12),
    textAlign: 'center',
  },
  btcView: {
    flexDirection: 'row',
    gap: moderateScale(5),
  },
  btcText: {
    color: '#5ED5A8',
    fontSize: moderateScale(13),
  },
  homeInviteBtn: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderateVerticalScale(20),
    marginTop: moderateVerticalScale(20),
  },
});
