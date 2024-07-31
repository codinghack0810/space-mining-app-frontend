import {StyleSheet, View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import EditLogin from '../components/EditLogin';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({isClose, setIsClose}) => {
  const navigation = useNavigation();
  const [isLogoutLoading, setLogoutLoading] = useState(true);

  useEffect(() => {
    const timerReset = () => {
      const id = setInterval(async () => {
        await AsyncStorage.setItem('spendTimerValue', JSON.stringify(0));
        console.log('value 0 set');
        // setTimeout(async () => {
        //   const spendTime = JSON.parse(
        //     await AsyncStorage.getItem('spendTimerValue'),
        //   );
        //   console.log('spend timer after 0 set.........//////////', spendTime);
        //   setLogoutLoading(false)
        // }, 3000);

        const spendTime = JSON.parse(
          await AsyncStorage.getItem('spendTimerValue'),
        );

        if (!spendTime) {
          console.log('spend timer after 0 set.........//////////', spendTime);
          setLogoutLoading(false);
          clearInterval(id);
        }
      }, 1000);
    };

    timerReset();
  }, []);
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{backgroundColor: '#1B232A'}}>
      <View style={styles.loginContainer}>
        <EditLogin
          navigation={navigation}
          isClose={isClose}
          setIsClose={setIsClose}
          isLogoutLoading={isLogoutLoading}
        />
      </View>
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  loginContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B232A',
  },
});
