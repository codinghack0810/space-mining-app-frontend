import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  moderateScale,
  moderateVerticalScale,
  verticalScale,
} from 'react-native-size-matters';
import Button from '../components/Button';
import CloseBtn from '../components/CloseBtn';
import Clipboard from '@react-native-clipboard/clipboard';
import * as Animatable from 'react-native-animatable';
import TokenABI from '../Token/TokenABI.json';
import {ethers} from 'ethers';
import {useWalletConnectModal} from '@walletconnect/modal-react-native';
import Blur from '../components/Blur';
import CustomModal from '../components/CustomModal';

const {height} = Dimensions.get('window');
const Send = ({navigation, route}) => {
  const {provider} = useWalletConnectModal();
  const [copiedText, setCopiedText] = useState('');
  const [amount, setAmount] = useState('');
  const [focus, setFocus] = useState(false);
  const [hash, setHash] = useState(null);
  const [retry, setRetry] = useState(false);
  const [chainID, setChainID] = useState(false);
  const [field, setField] = useState(false);
  const [insufficentBalance, setInsufficentBalance] = useState(false);
  const [web3Provider, setWeb3Provider] = useState(null);
  const balance = route.params.SOMbalanceInDigit;

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    setCopiedText(text);
  };

  useEffect(() => {
    if (provider) {
      const newProvider = new ethers.providers.Web3Provider(provider);

      // Handle network change events
      newProvider.on('network', (newNetwork, oldNetwork) => {
        console.log('newNetwork and oldnetwork', newNetwork, oldNetwork);
        if (newNetwork.chainId !== 56) {
          console.log('Please switch BNB');
        }
      });

      setWeb3Provider(newProvider);
    }
  }, [provider]);

  const sendTransaction = async (amt, web3Provider) => {
    console.log('Amt........//////////////', amt, typeof amt);
    try {
      const recipientAddress = copiedText;
      if (!recipientAddress || !amt) {
        setField(true);
        return;
      }
      if (
        Number(amt) > balance ||
        amt.split('.')[1]?.length > 4 ||
        Number(amt) <= 0
      ) {
        return;
      }
      if (!web3Provider) {
        console.log('web3Provider not connected');
        return;
      }
      const finalAmount = Number(amt);
      web3Provider.network.chainId = 56;
      web3Provider.network.name = 'bnb';
      web3Provider.network.ensAddress = null;

      const signer = await web3Provider.getSigner();
      // console.log('Signer......./////////', signer);
      const tokenContractAddress = '0x23959230b02498e8a7b380f8f2c6f545634e1db9';

      const tokenContract = new ethers.Contract(
        tokenContractAddress,
        TokenABI,
        signer,
      );
      if (finalAmount > balance) {
        setInsufficentBalance(true);
        return;
      }
      console.log(
        'finalAmount...............',
        finalAmount,
        typeof finalAmount,
      );

      // Token transfer parameters
      const amount = ethers.utils.parseUnits(amt, '18'); // Amount in Wei (adjust decimals as needed)

      // console.log('Amount......./ in transaction//////////', amount);

      const transferTx = await tokenContract.transfer(recipientAddress, amount);

      // Wait for the transaction to be mined
      const transferReceipt = await transferTx.wait();
      // console.log(
      //   'Token transfer mined in block:',
      //   transferReceipt.blockNumber,
      // );
      console.log('Hash Transaction : ', transferReceipt.transactionHash);
      setHash(transferReceipt.transactionHash);
    } catch (error) {
      console.error('Error sending token transfer:', error);
      if (error.code == 5000) {
        setRetry(true);
        return;
      }
      if (error.detectedNetwork.chainId != 56) {
        setChainID(true);
        return;
      }
    }
  };

  const handleTapScreen = () => {
    if (focus) {
      Keyboard.dismiss();
      setTimeout(() => {
        setFocus(false);
      }, 500);
    }
  };

  useEffect(() => {
    if (!hash) {
      return;
    }
    const postTransaction = async () => {
      const amt = amount.replace(/(\.\d*?)0$/g, '$1');
      console.log('amount...//', amt, 'hash', hash);
      try {
        const response = await fetch(
          'http://3.68.231.50:3007/api/send-tokens',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${route.params.token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              hash,
              address: route.params.address,
              token: amt,
            }),
          },
        );
        if (response.ok) {
          const result = await response.json();
          if (result.Success) {
            console.log('result....///', result);
            setCopiedText('');
            setAmount('');
            route.params.setTransaction(true);
            navigation.navigate('Wallet');
          }
        } else {
          setRetry(true);
          setCopiedText('');
          setAmount('');
        }
      } catch (err) {
        console.log('Error send Transaction ', err);
        setRetry(true);
        setCopiedText('');
        setAmount('');
      }
    };
    postTransaction();
  }, [hash]);

  const maxBalance = () => {
    // const amt = (balance).toFixed(2);
    setAmount(balance.toString());
  };

  const handleEnterAmount = txt => {
    setAmount(txt);
  };

  return (
    <>
      <TouchableWithoutFeedback
        style={{flex: 1, position: 'relative', zIndex: 10}}
        onPress={handleTapScreen}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{flex: 1, backgroundColor: '#1B232A'}}>
            <View
              style={{
                height: height,
                backgroundColor: '#1B232A',
              }}>
              <Animatable.View
                style={styles.sendContainer}
                animation={'fadeInUpBig'}
                duration={1200}>
                <Text style={styles.sendTxt}>Send</Text>
                <View style={styles.sendBox}>
                  <View style={styles.tokenChooseBox}>
                    <Text style={styles.chooseTxt}>I want to send</Text>
                    <TouchableOpacity
                      style={styles.tokenOptionBox}
                      // onPress={() => setToggleDownArrow(!toggleDownArrow)}
                      activeOpacity={1}>
                      <View style={styles.optionLeftSide}>
                        <Image
                          source={require('../assets/Images/bnb.png')}
                          style={styles.cryptoIcon}
                        />
                        <Text style={styles.cryptoName}>SOM</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.tokenChooseBox}>
                    <Text style={styles.chooseTxt}>Send To</Text>
                    <View style={[styles.tokenOptionBox, styles.sendToBox]}>
                      <TextInput
                        placeholder="Fill in the wallet address here"
                        placeholderTextColor={'#979797'}
                        style={styles.txtInput}
                        value={copiedText}
                        onChangeText={setCopiedText}
                        onFocus={() => setFocus(true)}
                        onBlur={() => setFocus(false)}
                      />
                      <TouchableOpacity
                        style={styles.pasteBtn}
                        onPress={fetchCopiedText}>
                        <Text style={styles.pasteTxt}>Paste</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.tokenChooseBox}>
                    <Text style={styles.chooseTxt}>Amount</Text>
                    <View style={[styles.tokenOptionBox, styles.amount]}>
                      <TextInput
                        placeholder="Minimum 0.0001"
                        placeholderTextColor={'#979797'}
                        style={styles.amountInput}
                        keyboardType="number-pad"
                        value={amount}
                        onChangeText={txt => handleEnterAmount(txt)}
                        onFocus={() => setFocus(true)}
                        onBlur={() => setFocus(false)}
                        onSubmitEditing={Keyboard.dismiss}
                      />
                      <View style={styles.txtBox}>
                        <Text style={styles.cryptoName}>SOM</Text>

                        <TouchableOpacity onPress={maxBalance}>
                          <Text style={styles.limitTxt}>Max</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    {Number(amount) > balance ? (
                      <Text style={styles.warningMsg}>
                        Insufficient Balance
                      </Text>
                    ) : amount.split('.')[1]?.length > 4 ? (
                      <Text style={styles.warningMsg}>
                        You can enter decimal value upto 4 digits
                      </Text>
                    ) : amount === '' ? null : (
                      Number(amount) <= 0 && (
                        <Text style={styles.warningMsg}>Invalid Amount</Text>
                      )
                    )}
                  </View>

                  <Text style={styles.availableTxt}>
                    Available: {balance} {'SOM'}
                  </Text>
                </View>
                <CloseBtn onPress={() => navigation.goBack()} />
              </Animatable.View>
            </View>
          </ScrollView>
          <View
            style={{
              position: 'relative',
              bottom: focus ? moderateVerticalScale(-250) : 0,
            }}>
            <Button
              txt={'SEND'}
              onPress={() => sendTransaction(amount, web3Provider)}
              value={30}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>

      {(retry || chainID || field || hash || insufficentBalance) && <Blur />}
      {retry && (
        <CustomModal
          txt={'Transaction Cancel'}
          onPress={() => setRetry(false)}
          icon={require('../assets/Images/transaction.png')}
        />
      )}
      {chainID && (
        <CustomModal
          txt={'Please switch to Binance Smart Chain Mainnet in your wallet.'}
          onPress={() => setChainID(false)}
          icon={require('../assets/Images/binance.png')}
        />
      )}
      {field && (
        <CustomModal
          txt={'Address or amount must be filled'}
          onPress={() => setField(false)}
          icon={require('../assets/Images/transaction.png')}
        />
      )}
      {hash && (
        <CustomModal
          txt={'Wait transaction in progress...'}
          icon={require('../assets/Images/transaction.png')}
        />
      )}
      {insufficentBalance && (
        <CustomModal
          txt={'Insufficient Balance'}
          onPress={() => setInsufficentBalance(false)}
          icon={require('../assets/Images/transaction.png')}
        />
      )}
    </>
  );
};

export default Send;

const styles = StyleSheet.create({
  sendContainer: {
    backgroundColor: '#1B232A',
    alignItems: 'center',
    position: 'relative',
  },
  sendTxt: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'HeliosExt-Bold',
    fontSize: moderateScale(26),
    textTransform: 'uppercase',
    marginTop: verticalScale(55),
  },
  sendBox: {
    width: '90%',
    backgroundColor: '#171D22',
    borderRadius: moderateScale(16),
    paddingVertical: moderateVerticalScale(15),
    paddingHorizontal: moderateScale(25),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateVerticalScale(15),
    paddingBottom: moderateVerticalScale(40),
  },
  tokenChooseBox: {
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: moderateVerticalScale(30),
  },
  chooseTxt: {
    fontSize: moderateScale(12),
    color: '#fff',
    fontFamily: 'HeliosExt-Bold',
  },
  tokenOptionBox: {
    width: '100%',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: moderateScale(5),
    paddingVertical: moderateVerticalScale(10),
    paddingHorizontal: moderateScale(10),
    marginTop: moderateVerticalScale(10),
    position: 'relative',
  },
  optionLeftSide: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: moderateScale(8),
  },
  cryptoIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
    position: 'relative',
    top: 2,
  },
  cryptoName: {
    fontSize: moderateScale(22),
    color: '#000',
    fontFamily: 'HeliosExt-Bold',
    textTransform: 'uppercase',
  },
  optionList: {
    position: 'absolute',
    bottom: -130,
    width: '100%',
    borderRadius: moderateScale(5),
    zIndex: 10,
    elevation: 6,
  },
  option1: {
    backgroundColor: '#fff',
    borderBottomColor: '#000',
    borderBottomWidth: 2,
    width: '100%',
    alignItems: 'flex-start',
    paddingVertical: moderateVerticalScale(10),
    paddingHorizontal: moderateScale(10),
    borderTopLeftRadius: moderateScale(5),
    borderTopRightRadius: moderateScale(5),
  },
  option2: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: moderateScale(5),
    borderBottomRightRadius: moderateScale(5),
    borderBottomColor: null,
    borderBottomWidth: 0,
  },
  sendToBox: {
    paddingHorizontal: 5,
    position: 'relative',
  },
  txtInput: {
    fontSize: moderateScale(12),
    fontFamily: 'HeliosExt',
    width: '88%',
    paddingHorizontal: moderateScale(8),
    color: '#171D22',
  },
  pasteBtn: {
    position: 'absolute',
    right: 15,
    bottom: 0,
  },
  pasteTxt: {
    color: '#000',
    textDecorationLine: 'underline',
    fontSize: moderateScale(12),
    textDecorationColor: '#000',
    fontFamily: 'HeliosExt-Bold',
    marginBottom: moderateVerticalScale(8),
  },
  amount: {
    paddingVertical: moderateVerticalScale(0),
    justifyContent: 'flex-start',
    gap: moderateScale(10),
    paddingHorizontal: 0,
  },
  txtBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    gap: moderateScale(5),
    width: '40%',
    // position: 'relative',
    // right: moderateScale(8),
  },
  limitTxt: {
    color: '#000',
    textDecorationLine: 'underline',
    fontSize: moderateScale(12),
    textDecorationColor: '#000',
    fontFamily: 'HeliosExt-Bold',
    marginBottom: moderateVerticalScale(5),
  },
  amountInput: {
    width: '53%',
    paddingHorizontal: moderateScale(10),
    color: '#171D22',
    fontFamily: 'HeliosExt',
    fontSize: moderateScale(12),
  },
  availableTxt: {
    fontSize: moderateScale(12),
    color: '#979797',
    fontFamily: 'HeliosExt',
    alignSelf: 'flex-start',
    marginTop: moderateVerticalScale(10),
  },
  warningMsg: {
    fontSize: moderateScale(12),
    color: 'red',
    marginTop: moderateScale(5),
  },
});
