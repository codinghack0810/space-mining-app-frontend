import {StyleSheet, Pressable, Image} from 'react-native';
import React from 'react';

const ToggleArrow = ({onPress, toggleDownArrow, name}) => {
  return (
    <Pressable onPress={onPress}>
      {toggleDownArrow ? (
        <Image
          source={require('../assets/Images/down-arrow.png')}
          style={styles.downArrow} tintColor={name === 'send' ? '#000' : '#fff'}
        />
      ) : (
        <Image
          source={require('../assets/Images/up-arrow.png')}
          style={styles.downArrow} tintColor={name === 'send' ? '#000' : '#fff'}
        />
      )}
    </Pressable>
  );
};

export default ToggleArrow;

const styles = StyleSheet.create({
    downArrow: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
      },
});
