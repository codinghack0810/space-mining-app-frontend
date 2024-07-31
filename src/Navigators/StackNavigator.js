import React, { useEffect, useState } from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Invite from '../screens/Invite';
import Receive from '../screens/Receive';
import BottomNavigator from './BottomNavigator';
import Send from '../screens/Send';
import ImportToken from '../screens/ImportToken';
import Register from '../screens/Register';
import Login from '../screens/Login';
import ForgetScreen from '../screens/ForgetScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const StackNavigator = () => {
  const [initalScreen, setInitalScreen] = useState(undefined)
  const [isClose, setIsClose] = useState(false)


  // auto login
  useEffect(() => {
    const loginCheck = async () => {
      try {
        const msg = await AsyncStorage.getItem('userLoginMsg')
        const isToken = await AsyncStorage.getItem('access_token')
        // console.log("Stack isLogin...//",JSON.parse(msg),JSON.parse(isToken))
        if (JSON.parse(msg) && JSON.parse(isToken)) {
          setInitalScreen('Bottom');
          setIsClose(false)
        } else {
          setInitalScreen('Login');
          setIsClose(true)
        }
      } catch (error) {
        console.log("Error auto login", error)
      }
    }
    loginCheck()
  }, [])

  
  return (
    <>
      {initalScreen && <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={initalScreen}>
      <Stack.Screen name="Login" children={() => <Login isClose = {isClose} setIsClose = {setIsClose}/>} />
      <Stack.Screen name="Forget" component={ForgetScreen} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Bottom" children={() => <BottomNavigator isClose = {isClose} setIsClose = {setIsClose}/>} />
      <Stack.Screen name="Invite" component={Invite} />
      <Stack.Screen name="Receive" component={Receive} />
      <Stack.Screen name="Send" component={Send} />
      <Stack.Screen name="Import" component={ImportToken} />
    </Stack.Navigator>}
    </>
  );
};

export default StackNavigator;
