import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import EditRegister from '../components/EditRegister';

const Register = ({navigation}) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{backgroundColor: '#1B232A'}}>
      <View style={styles.container}>
        <EditRegister navigation={navigation} />
      </View>
    </ScrollView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1B232A',
  },
});
