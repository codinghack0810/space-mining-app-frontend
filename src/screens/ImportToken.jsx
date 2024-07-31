import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  moderateScale,
  moderateVerticalScale,
  verticalScale,
} from 'react-native-size-matters';
import CryptoGraphCurrency from '../components/CryptoGraphCurrency';
import CloseBtn from '../components/CloseBtn';
import * as Animatable from 'react-native-animatable';
import Blur from '../components/Blur';
import CustomModal from '../components/CustomModal';

const {height} = Dimensions.get('window');
const ImportToken = ({navigation, route}) => {
  const [allTokens, setAllTokens] = useState('');
  const [tokenList, setTokenList] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [filteredTokens, setFilteredTokens] = useState([]);

  const convertObjectToArrya = obj => {
    const groups = [
      ['BNB', 'BNBpercentagechange'],
      ['USDT', 'USDTpercentagechange'],
      ['USDC', 'USDCpercentagechange'],
      ['BUSD', 'BUSDpercentagechange'],
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

    setAllTokens(resultArray);
    setTokenList(true);
  };

  const getAllTokens = async () => {
    try {
      const response = await fetch(
        'http://3.68.231.50:3007/api/getaccount_allimport-tokens',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            wallet_address: route.params.address,
          }),
        },
      );
      const result = await response.json();
      console.log('result.....................', result);
      if (result.Success) {
        console.log('Inside run.........//////////');
        setIsLoading(false);
        convertObjectToArrya(result);
      }
    } catch (err) {
      console.log('Error get all token', err);
      getAllTokens();
    }
  };

  useEffect(() => {
    getAllTokens();
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (searchInput.trim() === '') {
      setFilteredTokens(allTokens);
    } else {
      const filtered = allTokens.filter(item => {
        const tokenName = Object.keys(item)[0].toLowerCase();
        return tokenName.includes(searchInput.toLowerCase());
      });
      setFilteredTokens(filtered);
    }
  }, [searchInput, allTokens]);

  return (
    <>
      <Animatable.View
        style={styles.importContainer}
        animation={'fadeInUpBig'}
        duration={1200}>
        <ScrollView>
          <View style={styles.importSubContainer}>
            <Text style={styles.headingTxt}>Import Tokens</Text>

            <View style={styles.searchBox}>
              <Image
                source={require('../assets/Images/search-icon.png')}
                style={styles.searchIcon}
              />
              <TextInput
                placeholder="Search Tokens"
                style={styles.searchInput}
                placeholderTextColor={'rgba(119, 119, 119, 0.5)'}
                value={searchInput}
                onChangeText={text => setSearchInput(text)}
              />
              <TouchableOpacity style={styles.searchBtn}>
                <Text style={styles.searchTxt}>Search</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.currencyContainer}>
              {tokenList &&
                filteredTokens.map((item, index) => {
                  return (
                    <View style={styles.cryptoCurrencyBox} key={index}>
                      <CryptoGraphCurrency
                        icon={Object.keys(item)[0].toLowerCase()}
                        fullName={Object.keys(item)[0].toLowerCase()}
                        shortName={Object.keys(item)[0].toLowerCase()}
                        balance={Object.values(item)[0]}
                        percentage={Object.values(item)[1]}
                        index={index}
                      />
                    </View>
                  );
                })}
            </View>

            {isLoading && (
              <ActivityIndicator
                size={30}
                color={'#fff'}
                style={{marginTop: moderateVerticalScale(20)}}
              />
            )}

            <TouchableOpacity style={styles.addBtn} activeOpacity={0.6}>
              <Image
                source={require('../assets/Images/add-icon.png')}
                style={styles.addIcon}
              />
              <Text style={styles.addTxt}>Add</Text>
            </TouchableOpacity>

            <CloseBtn onPress={() => navigation.goBack()} />
          </View>
        </ScrollView>
      </Animatable.View>
    </>
  );
};

export default ImportToken;

const styles = StyleSheet.create({
  importContainer: {
    backgroundColor: '#1B232A',
    flex: 1,
  },
  importSubContainer: {
    alignItems: 'center',
    position: 'relative',
    minHeight: height,
  },
  headingTxt: {
    fontSize: moderateScale(26),
    color: '#fff',
    fontFamily: 'HeliosExt-Bold',
    marginTop: verticalScale(90),
  },
  searchBox: {
    width: '90%',
    backgroundColor: '#fff',
    paddingVertical: moderateVerticalScale(10),
    paddingHorizontal: moderateScale(15),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: moderateScale(30),
    marginTop: verticalScale(30),
  },
  searchIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  searchInput: {
    width: '70%',
    paddingHorizontal: moderateScale(10),
    fontSize: moderateScale(12),
    fontFamily: 'HeliosExt',
    color: '#000',
    height: 'auto',
    paddingVertical: 0,
  },
  searchTxt: {
    textDecorationLine: 'underline',
    textDecorationColor: '#000',
    fontFamily: 'HeliosExt-Bold',
    fontSize: moderateScale(14),
    color: '#000',
    padding: 0,
    lineHeight: verticalScale(28),
  },
  currencyContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateVerticalScale(20),
    gap: moderateVerticalScale(15),
  },
  addBtn: {
    width: '90%',
    backgroundColor: 'rgba(62, 71, 79, 0.1)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: moderateVerticalScale(15),
    paddingHorizontal: moderateScale(10),
    borderRadius: moderateScale(12),
    borderWidth: 2,
    borderColor: 'rgba(62, 71, 79, 0.5)',
    borderStyle: 'dashed',
    marginTop: moderateVerticalScale(20),
    gap: moderateScale(6),
  },
  addIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  addTxt: {
    fontSize: moderateScale(14),
    fontFamily: 'HeliosExt-Bold',
    color: '#777777',
  },
  cryptoCurrencyBox: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,.05)',
    paddingBottom: moderateVerticalScale(10),
  },
});
