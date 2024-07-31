import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';

const CheckConnection = ({setConnectionStatus}) => {
  useEffect(() => {
    // Subscribe
    const unsubscribe = NetInfo.addEventListener(state => {
      setConnectionStatus(state.isConnected)
    });

    // Unsubscribe
    return () => unsubscribe();
  }, []);
  
  return (
    <>
    </>
  );
};

export default CheckConnection;

const styles = StyleSheet.create({});
