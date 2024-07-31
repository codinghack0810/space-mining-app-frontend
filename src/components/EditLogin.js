import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  moderateScale,
  moderateVerticalScale,
  verticalScale,
} from 'react-native-size-matters';
import BackgroundUpper from './BackgroundUpper';
import TextContainer from './TextContainer';
import Email from './Email';
import Password from './Password';
import LoginBtn from './LoginBtn';
import Partion from './Partion';
import GoogleBtn from './GoogleBtn';
import TextBox from './TextBox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import CustomModal from './CustomModal';
import Blur from './Blur';

const EditLogin = ({navigation, isClose, setIsClose, isLogoutLoading}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(null);
  const [remember, setRemember] = useState(true);
  const [updateEffect, setUpdateEffect] = useState(true);

  // alert
  const [allField, setAllField] = useState(false);
  const [enterValidEmail, setEnterValidEmail] = useState(false);
  const [emailNotRegsiter, setEmailNotRegsiter] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [passwordLength, setPasswordLength] = useState(false);
  const [retry, setRetry] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isEmailValid = email => {
    const regex =
      /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
    if (regex.test(email)) {
      return true;
    }
    return false;
  };

  // google config
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '1059842235304-g2gietadvou0cf4oh2c6gvi9j43rohrk.apps.googleusercontent.com',
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo) {
        const email = userInfo.user.email;
        const image = userInfo.user.photo;
        const googleSignIn = true;
        loginRegister(email, image, googleSignIn);
      }
    } catch (error) {
      console.log('Google Sign in Error', error);
    }
  };

  // user details from async storage
  useEffect(() => {
    const getData = async () => {
      try {
        const data = await AsyncStorage.getItem('login');
        if (!data) {
          return;
        }
        const parsedData = JSON.parse(data);
        setEmail(parsedData?.email);
        setPassword(parsedData?.password);
      } catch (error) {
        console.log('Get data error', error);
      }
    };
    getData();
  }, [updateEffect]);

  // handle login
  const handleLogin = async () => {
    setIsLoading(true);
    const image =
      'https://w7.pngwing.com/pngs/910/606/png-transparent-head-the-dummy-avatar-man-tie-jacket-user.png';
    if (email === '' || password === null || password === '') {
      setAllField(true);
      setIsLoading(false);
      return;
    }
    const emailVaidationCheck = isEmailValid(email);
    if (emailVaidationCheck) {
      if (password.length >= 6) {
        const googleSignIn = false;
        loginRegister(email, image, googleSignIn);
        if (remember) {
          try {
            await AsyncStorage.setItem(
              'login',
              JSON.stringify({
                email: email,
                password: password,
              }),
            );
          } catch (error) {
            console.log('Async error', error);
          }
        } else {
          try {
            await AsyncStorage.setItem('login', JSON.stringify(''));
          } catch (error) {
            console.log('Async error', error);
          }
        }
      } else {
        setPasswordLength(true);
        setIsLoading(false);
      }
    } else {
      setEnterValidEmail(true);
      setIsLoading(false);
    }
  };

  // login api
  const loginRegister = async (emailId, imageURL, googleSign) => {
    try {
      let user = null;
      const email = emailId.toLowerCase();
      if (googleSign) {
        user = {
          email,
          social_login: googleSign,
        };
      } else {
        user = {
          email,
          password,
          social_login: googleSign,
        };
      }
      const response = await fetch('http://3.68.231.50:3007/api/login', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {'Content-Type': 'application/json'},
      });
      const result = await response.json();
      if (result.Success) {
        createProfile(imageURL, email, result);
      } else if (result.Message === 'Password not matched') {
        setValidPassword(true);
        setIsLoading(false);
      } else {
        setEmailNotRegsiter(true);
        setIsLoading(false);
        await GoogleSignin.signOut();
      }
    } catch (error) {
      setRetry(true);
      setIsLoading(false);
      console.log('Error...129', error);
      await GoogleSignin.signOut();
    }
  };

  const createProfile = async (imageUrl, emailID, msg) => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUrl,
      name: 'image.png',
      type: 'image/png',
    });
    formData.append('username', emailID.split('@')[0]);
    try {
      const response = await fetch(
        'http://3.68.231.50:3007/api/create-profile',
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${msg.Accesstoken}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      const result = await response.json();
      await AsyncStorage.setItem(
        'userLoginMsg',
        JSON.stringify({msg: msg.Message}),
      );
      await AsyncStorage.setItem(
        'access_token',
        JSON.stringify(msg.Accesstoken),
      );
      setUpdateEffect(!updateEffect);
      setEmail('');
      setPassword('');
      navigation.navigate('Bottom');
      setIsLoading(false);
      console.log('isClose edit login....////', isClose);
      if (!isClose) {
        console.log('Edit login isClose set true');
        setIsClose(true);
      }
    } catch (error) {
      setRetry(true);
      await GoogleSignin.signOut();
      setIsLoading(false);
      console.log('Error', error);
    }
  };

  return (
    <>
      <View style={styles.loginContainer}>
        <BackgroundUpper />

        <View style={styles.txtUpperContainer}>
          <TextContainer
            heading={'Sign In'}
            description={'Sign in and continue where you left off!'}
          />
        </View>

        <View style={styles.inputsContainer}>
          <Email email={email} setEmail={setEmail} />
          <Password
            password={password}
            setPassword={setPassword}
            title={'Password'}
          />
        </View>

        <View style={styles.forgetContainer}>
          <View style={styles.rememberContainer}>
            <Pressable
              style={styles.rememberBtn}
              onPress={() => setRemember(!remember)}>
              {remember ? (
                <Image
                  source={require('../assets/Images/right-icon.png')}
                  style={styles.rightIcon}
                />
              ) : null}
            </Pressable>
            <Text style={styles.rememberTxt}>Remember Me</Text>
          </View>

          <Pressable onPress={() => navigation.navigate('Forget')}>
            <Text style={styles.forgetTxt}>Forget Password</Text>
          </Pressable>
        </View>

        <View style={styles.btnBox}>
          <LoginBtn
            name={'Sign In'}
            onPress={handleLogin}
            isLoading={isLoading}
          />
        </View>

        <Partion />

        <View style={styles.googlebtnBox}>
          <GoogleBtn
            title={'Sign In with Google'}
            onPress={handleGoogleSignIn}
          />
        </View>

        <TextBox
          firstText={`Don't have an account? `}
          BtnText={'Sign up'}
          onPress={() => navigation.navigate('Register')}
        />
      </View>

      {(allField ||
        enterValidEmail ||
        emailNotRegsiter ||
        validPassword ||
        passwordLength ||
        retry ||
        isLogoutLoading) && <Blur />}

      {allField && (
        <CustomModal
          txt={'All fields must be filled'}
          onPress={() => setAllField(false)}
          icon={require('../assets/Images/mail-icon.png')}
        />
      )}
      {enterValidEmail && (
        <CustomModal
          txt={'Enter valid email'}
          onPress={() => setEnterValidEmail(false)}
          icon={require('../assets/Images/mail-icon.png')}
        />
      )}
      {emailNotRegsiter && (
        <CustomModal
          txt={'Email not register'}
          onPress={() => setEmailNotRegsiter(false)}
          icon={require('../assets/Images/mail-icon.png')}
        />
      )}
      {validPassword && (
        <CustomModal
          txt={'Password not matched'}
          onPress={() => setValidPassword(false)}
          icon={require('../assets/Images/lock.png')}
        />
      )}
      {passwordLength && (
        <CustomModal
          txt={'Password must be greater than 6 words'}
          onPress={() => setPasswordLength(false)}
          icon={require('../assets/Images/lock.png')}
        />
      )}
      {retry && (
        <CustomModal
          txt={'Try Again'}
          onPress={() => setRetry(false)}
          icon={require('../assets/Images/retry.png')}
        />
      )}
      {isLogoutLoading && (
        <ActivityIndicator
          size={moderateScale(40)}
          color={'#fff'}
          // style={{position: 'absolute'}}
          style={StyleSheet.absoluteFill}
        />
      )}
    </>
  );
};

export default EditLogin;

const styles = StyleSheet.create({
  loginContainer: {
    width: '100%',
    alignItems: 'center',
  },
  txtUpperContainer: {
    marginTop: verticalScale(60),
  },
  inputsContainer: {
    width: '90%',
    marginTop: verticalScale(15),
    gap: moderateScale(10),
  },
  forgetContainer: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: moderateVerticalScale(15),
  },
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: moderateScale(10),
  },
  rememberBtn: {
    width: 18,
    height: 18,
    borderRadius: moderateScale(2),
    borderColor: '#8D98AF',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcon: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
    tintColor: '#8D98AF',
  },
  rememberTxt: {
    color: '#8D98AF',
    fontSize: moderateScale(12),
    fontFamily: 'HeliosExt',
    lineHeight: moderateVerticalScale(19),
  },
  forgetTxt: {
    fontFamily: 'HeliosExt',
    color: '#7979CC',
    fontSize: moderateScale(12),
    textDecorationLine: 'underline',
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
