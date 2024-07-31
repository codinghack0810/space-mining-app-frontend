import {Image, View, Text, StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {verticalScale, moderateScale, scale} from 'react-native-size-matters';
import Profile from '../screens/Profile';
import Wallet from '../screens/Wallet';
import MarketPlace from '../screens/MarketPlace';
import Team from '../screens/Team';
import Home from '../screens/Home';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Blur from '../components/Blur';
import CustomModal from '../components/CustomModal';
import CheckConnection from '../components/CheckConnection';
import NetInfo from '@react-native-community/netinfo';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {CommonActions, useNavigation} from '@react-navigation/native';

const Tab = createBottomTabNavigator();
const BottomNavigator = ({isClose, setIsClose}) => {
  const navigation = useNavigation();
  const [userLoginMessage, setUserLoginMessage] = useState(null);
  const [userLoginToken, setUserLoginToken] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(true);
  const [redeemBalance, setRedeemBalance] = useState(false);
  const [accessTokenExpire, setAccessTokenExpire] = useState(false);

  // handle Logout function
  const handleLogout = async () => {
    await AsyncStorage.setItem('userLoginMsg', JSON.stringify(false));
    await AsyncStorage.setItem('isLogin', JSON.stringify(false));
    await AsyncStorage.setItem('access_token', JSON.stringify(false));
    console.log('false set');
    setIsClose(false);
    navigation.dispatch(
      CommonActions.reset({
        routes: [
          {
            name: 'Login', // Replace 'Home' with the name of your initial route
          },
        ],
      }),
    );
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      await GoogleSignin.signOut();
    }
  };

  useEffect(() => {
    const getUserData = async () => {
      const getMsg = await AsyncStorage.getItem('userLoginMsg');
      const getToken = await AsyncStorage.getItem('access_token');
      const parseMsg = JSON.parse(getMsg);
      const parseToken = JSON.parse(getToken);
      setUserLoginMessage(parseMsg);
      if (parseToken) {
        try {
          const response = await fetch(
            `http://3.68.231.50:3007/api/get-profile`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${parseToken}`,
              },
            },
          );
          if (response.ok) {
            setUserLoginToken(parseToken);
          } else if (response.status === 400) {
            // Access token expired, request a new one
            try {
              const response = await fetch(
                `http://3.68.231.50:3007/api/refreshtoken`,
                {
                  method: 'GET',
                  headers: {
                    Authorization: `Bearer ${parseToken}`,
                  },
                },
              );
              if (response.ok) {
                const result = await response.json();
                console.log('result..//', result);
                if (result.Success) {
                  await AsyncStorage.setItem(
                    'access_token',
                    JSON.stringify(result.refreshtoken),
                  );
                  setUserLoginToken(result.refreshtoken);
                } else {
                  handleLogout();
                }
              }
            } catch (err) {
              console.log('Error in refersh token api', err);
            }
          }
        } catch (err) {
          console.log(
            'Error get profile to check access token validation',
            err,
          );
        }
      }
    };
    getUserData();
  }, []);

  // handle connection check
  const handleConnectionCheck = () => {
    NetInfo.fetch().then(state => {
      setConnectionStatus(state.isConnected);
    });
  };

  return (
    <>
      {userLoginToken && (
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              height: verticalScale(80),
            },
            tabBarShowLabel: false,
            tabBarHideOnKeyboard: true,
          }}
          initialRouteName="Home"
          backBehavior="history">
          <Tab.Screen
            name="Profile"
            children={() => (
              <Profile
                token={userLoginToken}
                msg={userLoginMessage.msg}
                connectionStatus={connectionStatus}
                handleLogout={handleLogout}
              />
            )}
            options={{
              tabBarIcon: ({focused}) => (
                <View style={styles.tabIconBox}>
                  <Image
                    source={require('../assets/Icons/profile-icon.png')}
                    style={{
                      width: moderateScale(34),
                      height: moderateScale(34),
                      resizeMode: 'contain',
                      tintColor: focused ? '#7979CC' : null,
                    }}
                  />
                  <Text
                    style={[
                      styles.iconText,
                      {color: focused ? '#7979CC' : '#8D98AF'},
                    ]}>
                    Profile
                  </Text>
                </View>
              ),
            }}
          />
          <Tab.Screen
            name="Wallet"
            children={() => (
              <Wallet
                token={userLoginToken}
                connectionStatus={connectionStatus}
              />
            )}
            options={{
              tabBarIcon: ({focused}) => (
                <View style={styles.tabIconBox}>
                  <Image
                    source={require('../assets/Icons/wallet-icon.png')}
                    style={{
                      width: moderateScale(34),
                      height: moderateScale(34),
                      resizeMode: 'contain',
                      tintColor: focused ? '#7979CC' : null,
                    }}
                  />
                  <Text
                    style={[
                      styles.iconText,
                      {color: focused ? '#7979CC' : '#8D98AF'},
                    ]}>
                    Wallet
                  </Text>
                </View>
              ),
            }}
          />
          <Tab.Screen
            name="Home"
            children={() => (
              <Home
                token={userLoginToken}
                connectionStatus={connectionStatus}
                setRedeemBalance={setRedeemBalance}
                redeemBalance={redeemBalance}
                isClose={isClose}
                setIsClose={setIsClose}
                setUserLoginToken={setUserLoginToken}
                setAccessTokenExpire={setAccessTokenExpire}
              />
            )}
            options={{
              tabBarIcon: () => (
                <View style={styles.tabIconBox}>
                  <Image
                    source={require('../assets/gif/home-icon-min.gif')}
                    style={{
                      width: moderateScale(90),
                      height: moderateScale(90),
                      resizeMode: 'contain',
                    }}
                  />
                </View>
              ),
            }}
          />
          <Tab.Screen
            name="Market"
            component={MarketPlace}
            options={{
              tabBarIcon: ({focused}) => (
                <View style={styles.tabIconBox}>
                  <Image
                    source={require('../assets/Icons/market-icon.png')}
                    style={{
                      width: moderateScale(34),
                      height: moderateScale(34),
                      resizeMode: 'contain',
                      tintColor: focused ? '#7979CC' : null,
                    }}
                  />
                  <Text
                    style={[
                      styles.iconText,
                      {color: focused ? '#7979CC' : '#8D98AF'},
                    ]}>
                    Market
                  </Text>
                </View>
              ),
            }}
          />
          <Tab.Screen
            name="Team"
            children={() => (
              <Team
                token={userLoginToken}
                connectionStatus={connectionStatus}
              />
            )}
            options={{
              tabBarIcon: ({focused}) => (
                <View style={styles.tabIconBox}>
                  <Image
                    source={require('../assets/Icons/team-icon.png')}
                    style={{
                      width: moderateScale(34),
                      height: moderateScale(34),
                      resizeMode: 'contain',
                      tintColor: focused ? '#7979CC' : null,
                    }}
                  />
                  <Text
                    style={[
                      styles.iconText,
                      {color: focused ? '#7979CC' : '#8D98AF'},
                    ]}>
                    Team
                  </Text>
                </View>
              ),
            }}
          />
        </Tab.Navigator>
      )}

      <CheckConnection setConnectionStatus={setConnectionStatus} />

      {(!connectionStatus || redeemBalance || accessTokenExpire) && <Blur />}

      {!connectionStatus && (
        <CustomModal
          txt={'Check Your Internet Connection'}
          onPress={() => handleConnectionCheck()}
          icon={require('../assets/Images/retry.png')}
          btnTxt={'Try Again'}
        />
      )}

      {accessTokenExpire && (
        <CustomModal
          txt={'Multiple Login Detect! Login Again'}
          onPress={() => {
            setAccessTokenExpire(false);
            handleLogout();
          }}
          icon={require('../assets/Images/user.png')}
          btnTxt={'Logout'}
        />
      )}
    </>
  );
};

export default BottomNavigator;

const styles = StyleSheet.create({
  tabIconBox: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3,
    width: scale(55),
  },
  iconText: {
    fontFamily: 'HeliosExt',
    fontSize: moderateScale(12),
  },
});
