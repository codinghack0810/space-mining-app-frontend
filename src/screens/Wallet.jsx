import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';
import Clipboard from '@react-native-clipboard/clipboard';
import CryptoCurrency from '../components/CryptoCurrency';
import * as Animatable from 'react-native-animatable';
import {
  WalletConnectModal,
  useWalletConnectModal,
} from '@walletconnect/modal-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import Blur from '../components/Blur';
import CustomModal from '../components/CustomModal';

const projectId = 'f2c3e17150135dd77ca500cdba227c08';

const providerMetadata = {
  name: 'Metamask',
  description: 'Connect wallet to metamask',
  url: 'Space Of Mining New Era',
  icons: require('../assets/Images/single-planet.png'),
};

const Wallet = ({token, connectionStatus}) => {
  const navigation = useNavigation();
  const {open, isConnected, address, provider} = useWalletConnectModal();
  const [transaction, setTransaction] = useState(false);
  const [balance, setBalance] = useState('');
  const [SOMbalanceInDigit, setSOMBalanceInDigit] = useState('');
  const [copy, setCopy] = useState(false);
  const [connect, setConnect] = useState(false);
  const [tokenData, setTokenData] = useState('');
  const [tokenList, setTokenList] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshingValue, setRefreshingValue] = useState(false);
  const [showRefreshMsg, setShowRefreshMsg] = useState(false);

  const copyToClipboard = () => {
    Clipboard.setString(address);
    setCopy(true);
    setTimeout(() => {
      setCopy(false);
    }, 1500);
  };

  const storeConnection = async () => {
    await AsyncStorage.setItem('connected', JSON.stringify(true));
  };

  useEffect(() => {
    const getConnection = async () => {
      const value = await AsyncStorage.getItem('connected');
      if (!value && !isConnected) {
        await open();
      } else {
        storeConnection();
      }
    };
    getConnection();
  }, [isConnected, connect]);

  const getBalance = async () => {
    console.log('get balance called', address);
    try {
      const response = await fetch(
        'http://3.68.231.50:3007/api/getaccount_balance',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            wallet_address: address,
          }),
        },
      );
      if (response.ok) {
        const result = await response.json();
        console.log('result', result);
        const balanceInNumber = Number(result.balance);
        const tokenInNumber = Number(result.SOMBalance);
        setBalance(balanceInNumber);
        setSOMBalanceInDigit(tokenInNumber);
      } else if (response.status === 400) {
        console.log('response in get balance', response.status);
        getBalance();
      }
    } catch (error) {
      console.log('Error getBalance', error);
      getBalance();
    }
  };

  useEffect(() => {
    if (!address || !connectionStatus) {
      return;
    }
    getBalance();
  }, [connectionStatus, address, transaction]);

  const convertObjectToArrya = obj => {
    const groups = [
      ['BNB', 'BNBinUSD'],
      ['USDT', 'USDTinUSD'],
      ['USDC', 'USDCinUSD'],
      ['BUSD', 'BUSDinUSD'],
    ];

    const resultArray = [];

    for (const group of groups) {
      const newObj = {};
      for (const property of group) {
        if (property !== 'Success') {
          newObj[property] = obj[property];
        }
      }
      resultArray.push(newObj);
    }

    setTokenData(resultArray);
    setTokenList(true);
  };

  const getAllTokens = async () => {
    console.log('Get all tokens');
    try {
      const response = await fetch(
        'http://3.68.231.50:3007/api/getaccount_allimport-tokens',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            wallet_address: address,
          }),
        },
      );
      const result = await response.json();
      if (result.Success) {
        convertObjectToArrya(result);
        setIsLoading(false);
      }
    } catch (err) {
      console.log('Error get reward', err);
    }
  };

  useEffect(() => {
    if (!connectionStatus) {
      return;
    }
    if (isConnected || transaction) {
      getAllTokens();
    }
  }, [isConnected, transaction, connectionStatus]);

  const handleOnRefresh = () => {
    setRefreshingValue(true);
    setShowRefreshMsg(false);
    if (address) {
      getBalance();
    }
    setTimeout(() => {
      setRefreshingValue(false);
    }, 4000);
  };

  useEffect(() => {
    const id = setInterval(() => {
      setShowRefreshMsg(true);
    }, 300000);

    return () => clearInterval(id);
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{flex: 1, backgroundColor: '#1B232A'}}
      refreshControl={
        <RefreshControl
          refreshing={refreshingValue}
          onRefresh={handleOnRefresh}
          progressBackgroundColor={'#1B232A'}
          colors={['#fff']}
        />
      }>
      <Animatable.View
        style={styles.walletContainer}
        animation={'fadeInDownBig'}
        duration={1500}>
        {showRefreshMsg && address && (
          <Text style={styles.pullToRefreshTxt}>Pull To Refresh</Text>
        )}
        <View style={styles.walletWrapper}>
          <ImageBackground
            source={require('../assets/Images/wallet-bg.png')}
            style={styles.walletBg}>
            <Text style={styles.walletTxt}>Wallet</Text>
          </ImageBackground>

          <View style={styles.cardBgWrapper}>
            <ImageBackground
              style={styles.cardBg}
              source={require('../assets/Images/card-bg.png')}
              imageStyle={{borderRadius: moderateScale(15)}}>
              <Image
                source={require('../assets/Images/ellipse-1.png')}
                style={styles.rightEllipse}
              />
              <Image
                source={require('../assets/Images/ellipse-2.png')}
                style={styles.leftEllipse}
              />

              <View style={styles.cardUpperStyle}>
                <Text style={styles.yourbalanceTxt}>Your balance</Text>
                <View style={styles.cardUpperLeftStyle}>
                  <View>
                    <Text style={styles.usdTxt}>USD</Text>
                  </View>
                </View>
              </View>

              <View style={styles.middleContainer}>
                {isConnected ? (
                  <Text style={styles.balanceDollar}>
                    {balance === '' ? (
                      <ActivityIndicator
                        size={moderateScale(25)}
                        color={'#fff'}
                      />
                    ) : (
                      '$' + balance
                    )}
                  </Text>
                ) : (
                  <TouchableOpacity
                    style={styles.connectWallet}
                    onPress={() => setConnect(!connect)}>
                    <Text style={styles.connectTxt}>Connect Wallet</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.addressBox}>
                <Text style={styles.accountTxt}>Account: </Text>
                <Text style={styles.accountAddress}>
                  {isConnected
                    ? address?.slice(0, 7) +
                      '....' +
                      address?.slice(address.length - 4)
                    : null}
                </Text>
                <TouchableOpacity onPress={copyToClipboard}>
                  <Image
                    source={
                      !copy
                        ? require('../assets/Images/copy.png')
                        : require('../assets/Images/right-icon.png')
                    }
                    style={styles.copy}
                  />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>

          <View style={styles.btnsContainer}>
            <TouchableOpacity
              style={[
                styles.btn,
                {backgroundColor: balance === '' ? '#808080' : '#fff'},
              ]}
              onPress={() => navigation.navigate('Receive', {address: address})}
              disabled={balance === '' ? true : false}>
              <Image
                source={require('../assets/Images/receive-icon.png')}
                style={styles.btnIcon}
              />
              <Text style={styles.btnTxt}>Receive</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btn,
                {backgroundColor: balance === '' ? '#808080' : '#fff'},
              ]}
              onPress={() =>
                navigation.navigate('Send', {
                  token: token,
                  address: address,
                  SOMbalanceInDigit: SOMbalanceInDigit,
                  setTransaction: setTransaction,
                  connectionStatus: connectionStatus,
                })
              }
              disabled={balance === '' ? true : false}>
              <Image
                source={require('../assets/Images/send-icon.png')}
                style={styles.btnIcon}
              />
              <Text style={styles.btnTxt}>Send</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[
              styles.importBtn,
              {backgroundColor: balance === '' ? '#808080' : '#fff'},
            ]}
            onPress={() =>
              navigation.navigate('Import', {
                address: address,
                isConnected: isConnected,
              })
            }
            disabled={balance === '' ? true : false}>
            <Image
              source={require('../assets/Images/import-icon.png')}
              style={styles.importIcon}
            />
            <Text style={styles.importTxt}>Import Tokens</Text>
          </TouchableOpacity>

          {address ? (
            isLoading ? (
              <ActivityIndicator
                size={50}
                color={'#fff'}
                style={{marginTop: moderateVerticalScale(30)}}
              />
            ) : (
              <View style={styles.cryptoCurrencyContainer}>
                {tokenList &&
                  tokenData.map((item, index) => {
                    if (index >= 4) {
                      return null;
                    }
                    return (
                      <View key={index}>
                        <CryptoCurrency
                          icon={Object.keys(item)[0].toLowerCase()}
                          fullName={Object.keys(item)[0].toLowerCase()}
                          balance={Object.values(item)[0]}
                          shortName={Object.keys(item)[0].toLowerCase()}
                          cryptoBalance={Object.values(item)[1].toFixed(5)}
                        />
                      </View>
                    );
                  })}
              </View>
            )
          ) : null}
        </View>
      </Animatable.View>
      <WalletConnectModal
        projectId={projectId}
        providerMetadata={providerMetadata}
      />

      {transaction && <Blur />}

      {transaction && (
        <CustomModal
          txt={'Transaction Successfully'}
          onPress={() => setTransaction(false)}
          icon={require('../assets/Images/transaction.png')}
        />
      )}
    </ScrollView>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  walletContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  walletWrapper: {
    flex: 1,
    width: '100%',
    backgroundColor: '#1B232A',
    alignItems: 'center',
  },
  walletBg: {
    width: '100%',
    height: verticalScale(170),
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletTxt: {
    fontSize: moderateScale(26),
    color: '#fff',
    fontFamily: 'HeliosExt-Bold',
    lineHeight: verticalScale(35),
    textTransform: 'uppercase',
  },
  cardBgWrapper: {
    width: '90%',
    height: verticalScale(190),
    position: 'relative',
    top: -40,
  },
  cardBg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    alignItems: 'center',
    position: 'relative',
    top: moderateVerticalScale(-20),
    overflow: 'hidden',
    borderRadius: moderateScale(15),
  },
  rightEllipse: {
    position: 'absolute',
    right: -10,
    top: -80,
    width: 240,
    height: 240,
    resizeMode: 'contain',
  },
  leftEllipse: {
    position: 'absolute',
    left: -10,
    bottom: -80,
    width: 240,
    height: 240,
    resizeMode: 'contain',
  },
  cardUpperStyle: {
    width: '90%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateVerticalScale(20),
  },
  middleContainer: {
    position: 'relative',
    top: '20%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  yourbalanceTxt: {
    color: '#fff',
    fontSize: moderateScale(12),
    fontFamily: 'HeliosExt',
  },
  cardUpperLeftStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: moderateScale(10),
  },
  usdTxt: {
    fontSize: moderateScale(12),
    color: '#fff',
    fontFamily: 'HeliosExt',
  },
  balanceDollar: {
    fontSize: moderateScale(22),
    color: '#fff',
    lineHeight: moderateVerticalScale(42),
    textAlign: 'center',
    fontFamily: 'HeliosExt-Bold',
  },
  connectWallet: {
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(20),
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateVerticalScale(10),
  },
  connectTxt: {
    color: '#fff',
    fontFamily: 'HeliosExt',
    fontSize: moderateScale(12),
  },
  addressBox: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: moderateVerticalScale(10),
    position: 'absolute',
    bottom: moderateVerticalScale(10),
  },
  accountTxt: {
    color: '#fff',
    fontFamily: 'HeliosExt',
    fontSize: moderateScale(12),
  },
  accountAddress: {
    fontSize: moderateScale(10),
    color: '#fff',
    fontFamily: 'HeliosExt-Bold',
  },
  copy: {
    width: scale(18),
    height: verticalScale(18),
    resizeMode: 'contain',
    marginLeft: 5,
    tintColor: '#ffff',
  },
  btnsContainer: {
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
    top: -40,
  },
  btn: {
    width: scale(150),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: moderateVerticalScale(10),
    paddingHorizontal: moderateScale(10),
    backgroundColor: '#fff',
    borderRadius: moderateScale(50),
    gap: moderateScale(8),
  },
  btnIcon: {
    width: scale(24),
    height: verticalScale(24),
    resizeMode: 'contain',
  },
  btnTxt: {
    fontFamily: 'HeliosExt',
    fontSize: moderateScale(15),
    color: '#171D22',
  },
  importBtn: {
    width: '90%',
    padding: moderateScale(10),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // marginTop: moderateVerticalScale(15),
    position: 'relative',
    top: -20,
    borderRadius: moderateScale(50),
    gap: moderateScale(8),
  },
  importIcon: {
    width: scale(34),
    height: 25,
    resizeMode: 'contain',
  },
  importTxt: {
    fontSize: moderateScale(15),
    color: '#171D22',
    fontFamily: 'HeliosExt',
  },
  cryptoCurrencyContainer: {
    width: '90%',
    marginBottom: moderateVerticalScale(20),
    justifyContent: 'center',
    alignContent: 'center',
    gap: moderateScale(15),
  },
  pullToRefreshTxt: {
    color: '#fff',
    fontSize: moderateScale(12),
    fontFamily: 'HeliosExt',
    position: 'absolute',
    top: verticalScale(30),
    zIndex: 1000,
    backgroundColor: '#111',
    width: '100%',
    textAlign: 'center',
    paddingVertical: moderateScale(8),
  },
});
