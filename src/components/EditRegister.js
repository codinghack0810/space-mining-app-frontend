import {
  StyleSheet,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
  Modal,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';
import BackgroundUpper from './BackgroundUpper';
import Email from './Email';
import Password from './Password';
import LoginBtn from './LoginBtn';
import GoogleBtn from './GoogleBtn';
import Partion from './Partion';
import TextBox from './TextBox';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Blur from './Blur';
import CustomModal from './CustomModal';
import VerifyEmailModal from './VerifyEmailModal';

const EditRegister = ({navigation}) => {
  const [emailID, setEmailID] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [passwordEye, setPasswordEye] = useState(true);
  const [referalcode, setReferalCode] = useState('');

  // alert
  const [register, setRegister] = useState(false);
  const [fields, setFields] = useState(false);
  const [alertConfirm, setAlertConfirm] = useState(false);
  const [passwordLength, setPasswordLength] = useState(false);
  const [enterValidEmail, setEnterValidEmail] = useState(false);
  const [alreadyRegister, setAlreadyRegister] = useState(false);
  const [referalAlert, setReferalAlert] = useState(false);
  const [referralCodeMsg, setReferralCodeMsg] = useState(false);
  const [passwordBlankSpace, setPasswordBlankSpace] = useState(false);

  const isEmailValid = email => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (regex.test(email)) {
      return true;
    }
    return false;
  };

  const userRegister = async () => {
    try {
      const email = emailID.toLowerCase();
      const response = await fetch('http://3.68.231.50:3007/api/register', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          referalcode,
          social_login: false,
        }),
        headers: {'Content-Type': 'application/json'},
      });
      const result = await response.json();
      if (result.Success === true) {
        setRegister(true);
      } else if (result.Message === 'invalid email') {
        setEnterValidEmail(true);
      } else if (result.Message === 'email already registered') {
        setAlreadyRegister(true);
      } else if (result.Message === 'referal code is not exist') {
        setReferalAlert(true);
      }
    } catch (error) {
      console.log('Error....', error);
    }
  };

  const handleRegister = () => {
    if (emailID === '' || password === '' || referalcode === '') {
      setFields(true);
      return;
    }
    if (isEmailValid(emailID)) {
      if (password.length >= 6) {
        if (password.includes(' ')) {
          setPasswordBlankSpace(true);
          return;
        }
        if (password !== confirmpassword) {
          setAlertConfirm(true);
          return;
        }
        userRegister();
      } else {
        setPasswordLength(true);
        return;
      }
    } else {
      setEnterValidEmail(true);
      return;
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '1059842235304-g2gietadvou0cf4oh2c6gvi9j43rohrk.apps.googleusercontent.com',
    });
  }, []);

  const signIn = async () => {
    if (referalcode === '') {
      setReferralCodeMsg(true);
      return;
    }
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo) {
        try {
          const response = await fetch('http://3.68.231.50:3007/api/register', {
            method: 'POST',
            body: JSON.stringify({
              email: userInfo.user.email,
              referalcode,
              social_login: true,
            }),
            headers: {'Content-Type': 'application/json'},
          });
          const result = await response.json();
          if (result.Success === true) {
            setRegister(true);
            await GoogleSignin.signOut();
          } else if (result.Message === 'invalid email') {
            await GoogleSignin.signOut();
            setEnterValidEmail(true);
          } else if (result.Message === 'email already registered') {
            await GoogleSignin.signOut();
            setAlreadyRegister(true);
          } else if (result.Message === 'referal code is not exist') {
            await GoogleSignin.signOut();
            setReferalAlert(true);
          }
        } catch (error) {
          console.log('Error....', error);
          await GoogleSignin.signOut();
        }
      }
    } catch (error) {
      console.log('Google Sign up Error', error);
    }
  };

  const handleAfterRegister = () => {
    setRegister(false);
    navigation.navigate('Login');
  };

  return (
    <>
      <View style={styles.registerContainer}>
        <BackgroundUpper />

        <View style={{marginTop: verticalScale(60), width: '100%'}}>
          <View style={styles.txtContainer}>
            <Text style={styles.headingTxt}>
              <Text style={{fontFamily: 'Lato-Regular'}}>Join the</Text> Space
            </Text>
            <Text style={styles.descriptionTxt}>
              Welcome to the Space of Mining: The New Era!
            </Text>
          </View>
        </View>

        <View style={styles.inputsContainer}>
          <Email email={emailID} setEmail={setEmailID} />
          <Password
            password={password}
            setPassword={setPassword}
            title={'Password'}
          />
          <Password
            password={confirmpassword}
            setPassword={setConfirmPassword}
            title={'Confirm Password'}
          />
          <View
            style={{
              width: '100%',
              alignItems: 'flex-start',
              justifyContent: 'center',
              gap: moderateVerticalScale(5),
            }}>
            <Text style={styles.fieldText}>Referral Code</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={[styles.inputTxt, {width: '90%'}]}
                maxLength={6}
                // placeholder="(Optional)"
                placeholderTextColor={'rgba(255,255,255,.4)'}
                secureTextEntry={passwordEye}
                value={referalcode}
                onChangeText={setReferalCode}
              />
              <Pressable
                onPress={() => setPasswordEye(!passwordEye)}
                style={styles.eyeBtn}>
                {passwordEye ? (
                  <Image
                    source={require('../assets/Images/hidden.png')}
                    style={styles.eyeIcon}
                  />
                ) : (
                  <Image
                    source={require('../assets/Images/visible.png')}
                    style={styles.eyeIcon}
                  />
                )}
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.btnBox}>
          <LoginBtn name={'Sign up'} onPress={handleRegister} />
        </View>

        <Partion />

        <View style={styles.googlebtnBox}>
          <GoogleBtn onPress={signIn} title={'Sign Up with Google'} />
        </View>

        <TextBox
          firstText={'Already have an account? '}
          BtnText={'Sign In'}
          onPress={() => navigation.navigate('Login')}
        />
      </View>

      {(fields ||
        alertConfirm ||
        enterValidEmail ||
        passwordLength ||
        register ||
        alreadyRegister ||
        referalAlert ||
        referralCodeMsg ||
        passwordBlankSpace) && <Blur />}

      {fields && (
        <CustomModal
          txt={'All fields must be filled'}
          onPress={() => setFields(false)}
          icon={require('../assets/Images/mail-icon.png')}
        />
      )}
      {alertConfirm && (
        <CustomModal
          txt={'Confirm Password should be matched'}
          onPress={() => setAlertConfirm(false)}
          icon={require('../assets/Images/lock.png')}
        />
      )}
      {enterValidEmail && (
        <CustomModal
          txt={'Enter valid email'}
          onPress={() => setEnterValidEmail(false)}
          icon={require('../assets/Images/mail-icon.png')}
        />
      )}
      {passwordLength && (
        <CustomModal
          txt={'Password must be greater than 6 words'}
          onPress={() => setPasswordLength(false)}
          icon={require('../assets/Images/lock.png')}
        />
      )}
      {passwordBlankSpace && (
        <CustomModal
          txt={'Password should not contain blank space'}
          onPress={() => setPasswordBlankSpace(false)}
          icon={require('../assets/Images/lock.png')}
        />
      )}
      {register && (
        <VerifyEmailModal
          visible={register}
          onPress={handleAfterRegister}
          txt={
            'We have sent a link to your e-mail address where you can verify your email'
          }
        />
      )}
      {alreadyRegister && (
        <CustomModal
          txt={'User Already Register'}
          onPress={() => setAlreadyRegister(false)}
          icon={require('../assets/Images/user.png')}
        />
      )}
      {referalAlert && (
        <CustomModal
          txt={'Referral code not exist'}
          onPress={() => setReferalAlert(false)}
          icon={require('../assets/Images/user.png')}
        />
      )}
      {referralCodeMsg && (
        <CustomModal
          txt={'Referral code can not be empty'}
          onPress={() => setReferralCodeMsg(false)}
          icon={require('../assets/Images/user.png')}
        />
      )}
    </>
  );
};

export default EditRegister;

const styles = StyleSheet.create({
  registerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  txtContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateVerticalScale(10),
  },
  headingTxt: {
    width: '70%',
    fontFamily: 'HeliosExt-Bold',
    color: '#fff',
    textAlign: 'center',
    fontSize: moderateScale(26),
  },
  descriptionTxt: {
    color: '#8D98AF',
    fontSize: moderateScale(12),
    fontFamily: 'HeliosExt',
    textAlign: 'center',
  },
  inputsContainer: {
    width: '90%',
    marginTop: verticalScale(15),
    gap: moderateScale(10),
  },
  fieldText: {
    fontSize: moderateScale(12),
    color: '#fff',
    fontFamily: 'HeliosExt',
  },
  inputBox: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderRadius: moderateScale(10),
    width: '100%',
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateVerticalScale(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputTxt: {
    width: '100%',
    color: '#fff',
    fontSize: moderateScale(12),
    fontFamily: 'HeliosExt',
  },
  eyeBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    tintColor: '#7979CC',
  },
  btnBox: {
    width: '90%',
    marginTop: moderateVerticalScale(20),
  },
  googlebtnBox: {
    marginVertical: moderateVerticalScale(10),
    marginBottom: moderateVerticalScale(20),
    width: '90%',
  },
});
