import { StatusBar } from 'react-native'
import React from 'react'
import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from './src/Navigators/StackNavigator';


const App = () => {
  return (
    <NavigationContainer>
      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle={'light-content'}
      />
      <StackNavigator />
      </NavigationContainer>
  )
}

export default App