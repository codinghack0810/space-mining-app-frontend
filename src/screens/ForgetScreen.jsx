import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState} from 'react';
import BackgroundUpper from '../components/BackgroundUpper';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';
import TextContainer from '../components/TextContainer';
import Email from '../components/Email';
import LoginBtn from '../components/LoginBtn';
import {ScrollView} from 'react-native-gesture-handler';
import CustomModal from '../components/CustomModal';
import Blur from '../components/Blur';
import VerifyEmailModal from '../components/VerifyEmailModal';

const ForgetScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [enterEmail, setEnterEmail] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const mail = require('../assets/Images/mail-icon.png');

  const forgetPassword = async () => {
    try {
      const response = await fetch('http://3.68.231.50:3007/api/forgetpass', {
        method: 'POST',
        body: JSON.stringify({
          email,
        }),
        headers: {'Content-Type': 'application/json'},
      });
      const result = await response.json();
      if (result.success) {
        console.log('Line 29');
        setShowModal(true);
      }
    } catch (error) {
      console.log('Error...99', error);
    }
  };

  const handleModalBtn = () => {
    setShowModal(false);
    navigation.navigate('Login');
  };

  const isEmailValid = email => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (regex.test(email)) {
      return true;
    }
    return false;
  };

  const handleResetPassword = email => {
    if (email === '') {
      setEnterEmail(true);
      return;
    }
    if (isEmailValid(email)) {
      forgetPassword();
    } else {
      setValidEmail(true);
    }
  };

  return (
    <>
      <ScrollView style={{backgroundColor: '#1B232A'}}>
        <View style={styles.forgetContainer}>
          <BackgroundUpper />

          <View style={styles.txtUpperContainer}>
            <TextContainer
              heading={'Forget Password'}
              description={'Enter your email account to reset your password.'}
            />
          </View>

          <KeyboardAvoidingView enabled>
            <View style={styles.inputsContainer}>
              <Email email={email} setEmail={setEmail} />
            </View>
          </KeyboardAvoidingView>

          <View style={styles.btnBox}>
            <LoginBtn
              name={'Reset Password'}
              onPress={() => handleResetPassword(email)}
            />
          </View>
        </View>
      </ScrollView>
      {(showModal || enterEmail || validEmail) && <Blur />}
      {showModal && (
        <VerifyEmailModal
          visible={showModal}
          onPress={handleModalBtn}
          txt={
            'We have sent a link to your e-mail address where you can reset your password.'
          }
        />
      )}
      {enterEmail && (
        <CustomModal
          txt={'Enter email'}
          onPress={() => setEnterEmail(false)}
          icon={mail}
        />
      )}
      {validEmail && (
        <CustomModal
          txt={'Enter valid email'}
          onPress={() => setValidEmail(false)}
          icon={mail}
        />
      )}
    </>
  );
};

export default ForgetScreen;

const styles = StyleSheet.create({
  forgetContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1B232A',
  },
  txtUpperContainer: {
    marginTop: verticalScale(60),
    width: '100%',
  },
  inputsContainer: {
    width: '90%',
    marginTop: verticalScale(30),
  },
  btnBox: {
    width: '90%',
    marginTop: moderateVerticalScale(20),
  },
});
