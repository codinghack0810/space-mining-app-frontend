import {
  StyleSheet,
  Text,
  Animated,
  TouchableOpacity,
  Pressable,
  View,
  Image,
  AppState,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  verticalScale,
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RewardTimer = ({
  token,
  setRewardTime,
  setInternetStableMsg,
  handleRedeemBalance,
  isClose,
  setIsClose,
  setUserLoginToken,
  setAccessTokenExpire,
  connectionStatus,
}) => {
  // constants
  const EIGHT_HOURS = 8 * 60 * 60;
  const SIXTEEN_HOURS = 16 * 60 * 60;
  const TWENTY_FOUR_HOURS = 24 * 60 * 60;
  const TOKEN_EVERY_HOUR_RATE = 8 / 8;

  // GetClosing State
  const [closingDifferenceTime, setClosingDifferenceTime] = useState(0);
  const [checkAppState, setCheckAppState] = useState(true);
  const appState = useRef(AppState.currentState);

  // States
  const [progress, setProgress] = useState(0);
  const [reward, setReward] = useState(null);
  const [timer, setTimer] = useState(null);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [imageShow, setImageShow] = useState(false);
  const [firstTimer, setFirstTimer] = useState(null);
  const [remainingTimer, setRemainingTimer] = useState(0);
  const [firstTimeRun, setFirstTimeRun] = useState(true);

  // handle Remaining Timer
  useEffect(() => {
    if (EIGHT_HOURS >= timer) {
      setRemainingTimer(timer);
      return;
    }
    if (SIXTEEN_HOURS >= timer) {
      setRemainingTimer(timer - EIGHT_HOURS);
      return;
    }
    if (TWENTY_FOUR_HOURS >= timer) {
      setRemainingTimer(timer - SIXTEEN_HOURS);
    }
  }, [timer]);

  // Update Progress
  const updateProgress = async () => {
    // console.log('value set........................................');
    await AsyncStorage.setItem('spendTimerValue', JSON.stringify(timer));
    // console.log('timer', timer);
    const progressWidth =
      ((timer % TWENTY_FOUR_HOURS) / TWENTY_FOUR_HOURS) * 100;
    if (timer === TWENTY_FOUR_HOURS) {
      setProgress(100);
      return;
    }
    setProgress(progressWidth);
  };

  //   get Data function
  const getData = async () => {
    console.log('GetData Called...///');
    setFirstTimeRun(false);
    try {
      const resultStr = await getTimerFromDb(token);
      console.log('ResultStr: ', resultStr);
      const getLastLogoutTimeStr = await getLogoutTimeAPI(token);
      const lastLogoutTime = Number(getLastLogoutTimeStr);
      const currentTime = Date.now();
      const diffTime = Math.floor((currentTime - lastLogoutTime) / 1000);
      console.log('lastCloseTime: ', lastLogoutTime, 'diffTime: ', diffTime);
      const result = parseInt(resultStr) + diffTime;

      if (resultStr === 'Connection Not Stable') {
        setInternetStableMsg(true);
        return;
      }
      if (result < 0) {
        setTimer(TWENTY_FOUR_HOURS);
        setFirstTimer(true);
        return;
      }
      await AsyncStorage.setItem('isLogin', JSON.stringify(true));
      console.log('Result......', formatTime(result), result);
      if (!result) {
        setTimer(0);
        setFirstTimer(true);
        return;
      }
      // if (result) {
      //   setTimer(result);
      //   setFirstTimer(true);
      //   return;
      // }
      if (result >= EIGHT_HOURS) {
        setFirstTimer(true);

        if (resultStr <= EIGHT_HOURS && result >= EIGHT_HOURS) {
          console.log('eight hours');
          setTimer(EIGHT_HOURS);
          return;
        } else if (resultStr <= SIXTEEN_HOURS && result >= SIXTEEN_HOURS) {
          console.log('sixteen hours');
          setTimer(SIXTEEN_HOURS);
          return;
        } else if (
          resultStr <= TWENTY_FOUR_HOURS &&
          result >= TWENTY_FOUR_HOURS
        ) {
          console.log('twenty four hours');
          setTimer(TWENTY_FOUR_HOURS);
          return;
        } else {
          setTimer(result);
          return;
        }
      } else {
        setTimer(result);
        setFirstTimer(true);
        return;
      }
      // getClosingTimeDiff(token);
    } catch (err) {
      console.log('Error...62', err);
    }
  };

  // Handle Timer Updation
  useEffect(() => {
    if (!connectionStatus) {
      return;
    }
    if (firstTimer && !isTimerPaused) {
      if (checkAppState) {
        // Interval for count timer
        const interval = setInterval(() => {
          // Update timer every second
          if (timer > TWENTY_FOUR_HOURS) {
            // Reset timer and progress after 24 hours
            setTimer(0);
            setProgress(0);
            clearInterval(interval);
            return;
          }

          updateProgress();

          if (timer % EIGHT_HOURS === 0 && timer > 0) {
            setIsTimerPaused(true);
            setImageShow(true);
            setFirstTimer(false);
            clearInterval(interval);
            return;
          }
          setTimer(
            closingDifferenceTime
              ? prev => prev + closingDifferenceTime
              : prev => prev + 1,
          );
          clearInterval(interval);
        }, 1000);
        return () => clearInterval(interval);
      }
    } else if (firstTimeRun) {
      getData();
    } else {
      console.log('Else***********');
    }
  }, [timer, isTimerPaused, firstTimer, connectionStatus, checkAppState]);

  //   getProfile api
  const getProfile = async token => {
    try {
      const response = await fetch('http://3.68.231.50:3007/api/get-profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.Success) {
        setReward(result);
      }
    } catch (err) {
      console.log('Error get profile ', err);
    }
  };

  // Connection Status
  useEffect(() => {
    if (!connectionStatus) {
      return;
    }
    getProfile(token);
    const id = setInterval(() => {
      getProfile(token);
    }, 5000);

    return () => clearInterval(id);
  }, [connectionStatus]);

  // Get Reward
  const getReward = async token => {
    setRemainingTimer(0);
    setIsTimerPaused(false);
    setFirstTimer(true);
    setImageShow(false);
    setTimer(prevTimer => prevTimer + 1);
    try {
      const response = await fetch('http://3.68.231.50:3007/api/get-reward', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.Success) {
        setRewardTime(true);
      }
    } catch (err) {
      console.log('Error get reward', err);
    }
  };

  //   Animation of walking astronot when reward timer complete
  const scaleValue = new Animated.Value(1);

  Animated.loop(
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.2,
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]),
    {
      iterations: -1, // Infinite loop
    },
  ).start();

  // handle Timer store and get when app close or minimized

  const currentTime = () => {
    return (
      new Date().getHours() * 60 * 60 +
      new Date().getMinutes() * 60 +
      new Date().getSeconds()
    );
  };

  // Get Login_Time of User from DB
  const getTimerFromDb = async accessToken => {
    try {
      const response = await fetch(
        'http://3.68.231.50:3007/api/getlogin_time',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const result = await response.json();
      if (result.Success) {
        if (result.Login_Time) {
          return result.Login_Time;
        }
        return 0;
      } else {
        setInternetStableMsg(true);
        return 'Connection Not Stable';
      }
    } catch (error) {
      console.log('Get time from DB home screen', error);
      setInternetStableMsg(true);
      return 'Connection Not Stable';
    }
  };

  // Get Logout Time from Closeapptime DB
  const getLogoutTimeAPI = async accessToken => {
    try {
      const response = await fetch(
        'http://3.68.231.50:3007/api/get_closeapptiming',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.ok) {
        const result = await response.json();
        if (result.Success) {
          const logoutTime = result.time.login_time;
          if (logoutTime !== '') {
            return result.time.logout_time;
          } else {
            const emptyLogoutTime = Date.now();
            return `${emptyLogoutTime}`;
          }
        }
      }
    } catch (error) {
      console.log('Get LOGOUT time from DB home screen', error);
    }
  };

  // Get closing time API difference
  const getCloseTimeAPI = async accessToken => {
    try {
      const response = await fetch(
        'http://3.68.231.50:3007/api/get_closeapptiming',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.ok) {
        const result = await response.json();
        if (result.Success) {
          return result.time.time;
        }
        getClosingTimeDiff(accessToken);
        return false;
      } else if (response.status === 400) {
        try {
          const response = await fetch(
            `http://3.68.231.50:3007/api/refreshtoken`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          if (response.ok) {
            const result = await response.json();
            if (result.Success) {
              await AsyncStorage.setItem(
                'access_token',
                JSON.stringify(result.refreshtoken),
              );
              setUserLoginToken(result.refreshtoken);
              getClosingTimeDiff(result.refreshtoken);
              return 'access token update';
            } else {
              setAccessTokenExpire(true);
              return 'token expire';
            }
          }
        } catch (err) {
          console.log('Error in refersh token api', err);
        }
      } else {
        return false;
      }
    } catch (error) {
      console.log('Get close time from DB home screen', error);
      return false;
    }
  };

  // Store Login_time to User in DB
  const storeTimeInDb = async time => {
    try {
      const response = await fetch(
        'http://3.68.231.50:3007/api/Addlogin_time',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            login_time: time,
          }),
        },
      );

      if (response.ok) {
        console.log('Store spend time');
      } else if (response.status === 400) {
        const result = await response.json();
        if (!result.Success) {
          setAccessTokenExpire(true);
        }
      }
    } catch (error) {
      console.log('Error in store time in db profile', error);
    }
  };

  // Store Close Time API to Closeapptiming in DB
  const closeTimeStoreAPI = async timeAndDateInString => {
    if (!connectionStatus) {
      return;
    }
    try {
      const response = await fetch(
        'http://3.68.231.50:3007/api/add_closeapptiming',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            time: timeAndDateInString,
          }),
        },
      );
      console.log('Store close timer in DB: ', timeAndDateInString);
      await response.json();
    } catch (error) {
      console.log('Error in store time in db profile', error);
    }
  };

  // Store Close App Time to Closeapptiming in DB
  const closeAppTime = () => {
    const closeDate = new Date().getDate();
    const timerWhenAppClose =
      new Date().getHours() * 60 * 60 +
      new Date().getMinutes() * 60 +
      new Date().getSeconds();
    const storeTimeAndDate = `${timerWhenAppClose},${closeDate}`;
    // const storeTimeAndDate = `${closeDate}`;
    closeTimeStoreAPI(storeTimeAndDate);
  };

  // Get Closing Timer Difference
  const getClosingTimeDiff = async value => {
    if (!connectionStatus) {
      return;
    }
    setIsClose(false);
    console.log('False....////');
    const rawData = await getCloseTimeAPI(value);
    if (rawData === 'access token update') {
      return;
    }
    if (rawData === 'token expire') {
      return;
    }
    if (!rawData) {
      return;
    }
    let parseClosingTime = Number(rawData.split(',')[0]);
    if (parseClosingTime > 86400) {
      parseClosingTime = 0;
    }
    const parseClosingDate = Number(rawData.split(',')[1]);
    const nowDate = new Date().getDate();
    console.log('Current Time', formatTime(currentTime()), currentTime());
    console.log('ParseClosingTime', formatTime(parseClosingTime));
    const response = await getTimerFromDb(value);
    if (response === 'Connection Not Stable') {
      setInternetStableMsg(true);
      return;
    }
    let resultStorage = JSON.parse(response);
    if (resultStorage < 0) {
      resultStorage = TWENTY_FOUR_HOURS;
    }
    console.log('Total Spend time on the app', formatTime(resultStorage));
    console.log('nowDate : ', nowDate, typeof nowDate);
    console.log(
      'parseClosingDate : ',
      parseClosingDate,
      typeof parseClosingDate,
    );
    console.log('true');
    setIsClose(true);
    if (nowDate === parseClosingDate) {
      const minusTime = currentTime() - parseClosingTime;
      console.log('Time Difference Time...///', formatTime(minusTime));
      const total = resultStorage + minusTime;
      console.log('Total Time...///', formatTime(total));
      if (total >= EIGHT_HOURS) {
        if (resultStorage <= EIGHT_HOURS && total >= EIGHT_HOURS) {
          console.log('eight hours');
          setTimer(EIGHT_HOURS);
          return;
        }
        if (resultStorage <= SIXTEEN_HOURS && total >= SIXTEEN_HOURS) {
          console.log('sixteen hours');
          setTimer(SIXTEEN_HOURS);
          return;
        }
        if (resultStorage <= TWENTY_FOUR_HOURS && total >= TWENTY_FOUR_HOURS) {
          console.log('twenty four hours');
          setTimer(TWENTY_FOUR_HOURS);
          return;
        }
        setClosingDifferenceTime(minusTime);
      } else {
        setClosingDifferenceTime(minusTime);
      }
      setTimeout(() => {
        setClosingDifferenceTime(0);
      }, 1000);
    } else {
      const oldDayTimeDiff = 24 * 60 * 60 - parseClosingTime;
      const totalTimeDifference = oldDayTimeDiff + currentTime();
      const wholeTimer = resultStorage + totalTimeDifference;
      console.log(
        'Whole Timer..//',
        formatTime(wholeTimer),
        'Total Time Difference..//',
        formatTime(totalTimeDifference),
      );
      if (wholeTimer >= EIGHT_HOURS) {
        if (resultStorage <= EIGHT_HOURS && wholeTimer >= EIGHT_HOURS) {
          console.log('eight hours next day');
          setTimer(EIGHT_HOURS);
          return;
        }
        if (resultStorage <= SIXTEEN_HOURS && wholeTimer >= SIXTEEN_HOURS) {
          console.log('sixteen hours next day');
          setTimer(SIXTEEN_HOURS);
          return;
        }
        if (
          resultStorage <= TWENTY_FOUR_HOURS &&
          wholeTimer >= TWENTY_FOUR_HOURS
        ) {
          console.log('Twenty four hours next day');
          setTimer(TWENTY_FOUR_HOURS);
          return;
        }
        setClosingDifferenceTime(totalTimeDifference);
      } else {
        setClosingDifferenceTime(totalTimeDifference);
      }
      setTimeout(() => {
        setClosingDifferenceTime(0);
      }, 1000);
    }
  };

  // Get Initial Call
  useEffect(() => {
    if (!connectionStatus) {
      return;
    }
    const initialCall = async () => {
      const result = await AsyncStorage.getItem('isLogin');
      const boolResult = JSON.parse(result);
      if (boolResult) {
        getClosingTimeDiff(token);
      }
    };

    initialCall();
  }, [connectionStatus]);

  // handleAppState function define
  const _handleAppStateChange = async nextAppState => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('NextAppState....///', nextAppState);
      setCheckAppState(false);
      const result = await AsyncStorage.getItem('isLogin');
      const boolResult = JSON.parse(result);
      console.log('boolResult.........///', boolResult);
      setCheckAppState(true);
      if (boolResult) {
        getClosingTimeDiff(token);
        return;
      }
      setIsClose(true);
    } else {
      appState.current = nextAppState;
      console.log('NextAppStateeeeeeeeee....///', nextAppState);
      const spendTime = JSON.parse(
        await AsyncStorage.getItem('spendTimerValue'),
      );
      if (spendTime) {
        console.log('Spend timer....///', formatTime(spendTime));
        storeTimeInDb(spendTime);
        closeAppTime();
      }
    }
  };

  useEffect(() => {
    if (!connectionStatus) {
      return;
    }
    const changeAppState = AppState.addEventListener(
      'change',
      _handleAppStateChange,
    );

    return () => changeAppState.remove();
  }, [connectionStatus]);

  const formatTime = timeInSeconds => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    return `${formattedHours.toString().padStart(2, '0')}h ${formattedMinutes
      .toString()
      .padStart(2, '0')}m ${formattedSeconds.toString().padStart(2, '0')}s`;
  };

  useEffect(() => {
    if (isClose) {
      closeAppTime();
    }
  }, [isClose]);

  return (
    <>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressBarStatus,
            {width: `${progress.toFixed(2)}%`},
          ]}></View>

        <Animated.View
          style={
            imageShow
              ? {
                  transform: [{scale: scaleValue}],
                  shadowColor: 'blue', // Customize the shadow color
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: 0.5, // Adjust shadow opacity
                  shadowRadius: 10, // Adjust shadow radius
                }
              : null
          }>
          <Pressable onPress={() => getReward(token)} disabled={!imageShow}>
            <Image
              source={
                !imageShow
                  ? require('../assets/gif/walking-astronot.gif')
                  : require('../assets/Images/progress-icon.png')
              }
              style={[
                styles.progressImage,
                {
                  left:
                    timer < 20 * 60 * 60
                      ? moderateScale(-10)
                      : moderateScale(-60),
                },
              ]}
            />
          </Pressable>
        </Animated.View>
      </View>

      <View style={styles.balanceBox}>
        <TouchableOpacity
          style={styles.balanceView}
          onPress={() => handleRedeemBalance()}>
          <Text style={styles.balanceText}>
            Balance :{' '}
            <Text style={{fontSize: moderateScale(13)}}>
              {!reward
                ? '00'
                : reward.Profile.Inapptokens.toString().padStart(2, '0')}
            </Text>
          </Text>
        </TouchableOpacity>
        <View style={[styles.balanceView, styles.btcView]}>
          <Text style={[styles.balanceText, styles.btcText]}>
            +{TOKEN_EVERY_HOUR_RATE.toFixed(2)}
          </Text>
          <Text
            style={{
              color: '#000',
              fontSize: moderateScale(12),
              fontFamily: 'HeliosExt-Bold',
            }}>
            $SOM/hr
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.balanceText,
          {color: '#fff', fontSize: moderateScale(14)},
        ]}>
        Remaining Time: {formatTime(EIGHT_HOURS - remainingTimer)}
      </Text>
    </>
  );
};

export default RewardTimer;

const styles = StyleSheet.create({
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
});
