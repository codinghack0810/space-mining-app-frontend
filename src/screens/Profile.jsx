import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Pressable,
  Linking,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  verticalScale,
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
import InviteButton from '../components/InviteButton';
import EditProfile from '../components/EditProfile';
import CloseBtn from '../components/CloseBtn';
import {launchImageLibrary} from 'react-native-image-picker';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {height} = Dimensions.get('screen');
const Profile = ({token, msg, connectionStatus, handleLogout}) => {
  const navigation = useNavigation();
  const [profileEdit, setProfileEdit] = useState(false);
  const [profileDetails, setProfileDetails] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [passwordEye, setPasswordEye] = useState(true);
  const [focusedName, setFocusedName] = useState(false);
  const [focusedEmail, setFocusedEmail] = useState(false);
  const [focusedPassword, setFocusedPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [user, setUser] = useState({
    name: userName,
    email: userEmail,
    password: userPassword,
    profilePhoto: profileImage,
  });

  useEffect(() => {
    if (!connectionStatus) {
      return;
    }
    const getProfile = async () => {
      try {
        const response = await fetch(
          `http://3.68.231.50:3007/api/get-profile`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const result = await response.json();
        if (result.Success) {
          const resultProfile = result.Profile;
          setUser({
            name: resultProfile?.username,
            email: resultProfile.email,
            password: resultProfile?.password,
            profilePhoto: resultProfile.image,
          });
          setUserName(resultProfile?.username);
          setUserEmail(resultProfile.email);
          setUserPassword(resultProfile?.password);
          setProfileImage(resultProfile.image);
        }
      } catch (err) {
        console.log('Error profile', err);
      }
    };
    getProfile();
  }, [profileUpdated, connectionStatus]);

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

  const handleProfileEdit = () => {
    setProfileDetails(true);
  };

  const handleClose = () => {
    setProfileDetails(false);
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        openGallery();
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.log('Error..', err);
    }
  };

  const openGallery = async () => {
    const result = await launchImageLibrary({mediaType: 'photo'});
    if (result.didCancel) {
      return;
    }
    setProfileImage(result.assets[0].uri);
  };

  const updateProfile = async () => {
    if (!connectionStatus) {
      return;
    }
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: profileImage,
        name: 'image.png',
        type: 'image/png',
      });
      formData.append('username', userName);
      formData.append('email', userEmail);
      formData.append('password', userPassword);

      const response = await fetch(
        'http://3.68.231.50:3007/api/update_profile',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        },
      );
      const result = await response.json();
      if (result.Success) {
        setProfileUpdated(!profileUpdated);
        setProfileEdit(false);
      }
    } catch (error) {
      console.log('Error...147', error);
    }
  };

  const storeTimeInDb = async time => {
    console.log('Timer which stored', formatTime(time), time);
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

  const logoutTimeStoreAPI = async logoutTime => {
    if (!connectionStatus) {
      return;
    }
    try {
      const response = await fetch(
        'http://3.68.231.50:3007/api/add_logoutapptiming',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            loginTime: logoutTime,
          }),
        },
      );
      if (response.ok) {
        console.log('Store LOGOUT timer in DB: ', logoutTime);
      }
      // console.log('Logout time Response: ', response.json());
      await response.json();
    } catch (error) {
      console.log('Error in store LOGOUT time in db profile', error);
    }
  };

  const closeAppTime = async () => {
    const closeDate = new Date().getDate();
    const timerWhenAppClose =
      new Date().getHours() * 60 * 60 +
      new Date().getMinutes() * 60 +
      new Date().getSeconds();
    const storeTimeAndDate = `${timerWhenAppClose},${closeDate}`;
    closeTimeStoreAPI(storeTimeAndDate);
    const logoutTime = Date.now();
    logoutTimeStoreAPI(logoutTime);
  };

  const handleLogoutConfirm = () => {
    handleLogout();
  };

  const userRemainTime = async () => {
    try {
      const spendTime = JSON.parse(
        await AsyncStorage.getItem('spendTimerValue'),
      );
      storeTimeInDb(spendTime);
      closeAppTime();
      Alert.alert('Confirm Sign Out', 'Are you sure you want to sign out?', [
        {
          text: 'Yes',
          onPress: () => {
            handleLogoutConfirm();
          }, // Navigate to login screen
        },
        {
          text: 'No',
          style: 'cancel', // Stay on the Home screen
        },
      ]);
    } catch (error) {
      console.log('Get time error in profile', error);
    }
  };

  const handleSignOut = () => {
    if (!connectionStatus) {
      return;
    }
    userRemainTime();
  };

  const handleUpdatePassword = pass => {
    if (pass.includes(' ')) {
      setUserPassword(pass.replaceAll(' ', ''));
      return;
    }
    setUserPassword(pass);
  };

  const handleUpdateEmail = updateEmail => {
    if (updateEmail.includes(' ')) {
      setUserEmail(updateEmail.replaceAll(' ', ''));
      return;
    }
    setUserEmail(updateEmail);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Animatable.View
        style={styles.profileContainer}
        animation={'fadeInUpBig'}
        duration={1200}>
        <ImageBackground
          style={styles.profileImageContainer}
          source={require('../assets/gif/Galaxy.gif')}>
          <View style={styles.profilePictureBox}>
            {user.profilePhoto && (
              <Image
                source={
                  !profileEdit
                    ? {uri: user.profilePhoto}
                    : !profileImage
                    ? {uri: user.profilePhoto}
                    : {uri: profileImage}
                }
                style={[
                  styles.profilePicture,
                  {opacity: profileEdit ? 0.5 : 1},
                ]}
              />
            )}
            {profileEdit ? (
              <Pressable
                style={styles.cameraEditBtn}
                onPress={requestCameraPermission}>
                <Image
                  source={require('../assets/Images/camera-edit.png')}
                  style={styles.cameraEditIcon}
                />
              </Pressable>
            ) : null}
          </View>
          {profileEdit ? (
            <TextInput
              style={[styles.userName, styles.txtInput]}
              value={userName}
              onChangeText={setUserName}
            />
          ) : (
            <Text style={styles.userName}>{user.name}</Text>
          )}
          {profileDetails && !profileEdit ? (
            <CloseBtn onPress={handleClose} />
          ) : null}
          <View style={styles.horizontalLine}></View>
        </ImageBackground>
        {!profileDetails ? (
          <>
            <View style={styles.socialContainer}>
              <Text style={styles.socialTxt}>Follow Us on Social Media</Text>
              <View style={styles.socialIconBox}>
                <Pressable
                  onPress={() =>
                    Linking.openURL('https://spaceofmining.medium.com/')
                  }>
                  <Image
                    source={require('../assets/Images/medium.png')}
                    style={styles.socialIcon}
                  />
                </Pressable>
                <Pressable
                  onPress={() =>
                    Linking.openURL('https://www.instagram.com/spaceofmining/')
                  }>
                  <Image
                    source={require('../assets/Images/instagram.png')}
                    style={styles.socialIcon}
                  />
                </Pressable>
                <Pressable
                  onPress={() =>
                    Linking.openURL('https://www.threads.net/@spaceofmining')
                  }>
                  <Image
                    source={require('../assets/Images/thread.png')}
                    style={styles.socialIcon}
                  />
                </Pressable>
                <Pressable
                  onPress={() =>
                    Linking.openURL('https://twitter.com/spaceminingapp')
                  }>
                  <Image
                    source={require('../assets/Images/twitter-x.png')}
                    style={styles.socialIcon}
                  />
                </Pressable>
                <Pressable
                  onPress={() => Linking.openURL('https://t.me/spaceofmining')}>
                  <Image
                    source={require('../assets/Images/telegram.png')}
                    style={styles.socialIcon}
                  />
                </Pressable>
              </View>
            </View>
            <Animatable.View
              style={styles.profileInviteBtn}
              animation={'fadeInDown'}
              duration={1000}>
              <InviteButton
                navigation={navigation}
                token={token}
                connectionStatus={connectionStatus}
              />
            </Animatable.View>
            <TouchableOpacity
              style={styles.profileSetting}
              onPress={handleProfileEdit}>
              <View style={styles.profileTxtContainer}>
                <Image
                  source={require('../assets/Images/profile-icon-setting.png')}
                  style={styles.profileIcon}
                />
                <Text style={styles.profileTxt}>Profile Settings</Text>
              </View>
              <View style={styles.profileEditBox}>
                <Text style={styles.userNameTxt}>{userName}</Text>
                <Image
                  source={require('../assets/Images/right-long-arrow.png')}
                  style={styles.rightLongArrow}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileSetting}
              onPress={handleSignOut}>
              <View style={styles.profileTxtContainer}>
                <View style={styles.signOutBox}>
                  <Image
                    source={require('../assets/Images/sign-out.png')}
                    style={[
                      styles.profileIcon,
                      {
                        width: '60%',
                        height: '60%',
                        position: 'relative',
                        right: 2,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.profileTxt}>Sign out</Text>
              </View>
              <View style={styles.profileEditBox}>
                <Image
                  source={require('../assets/Images/right-long-arrow.png')}
                  style={styles.rightLongArrow}
                />
              </View>
            </TouchableOpacity>
          </>
        ) : !profileEdit ? (
          <View style={styles.profileDetailsContainer}>
            <EditProfile
              name={'username'}
              value={user?.name}
              onPress={() => {
                setProfileEdit(true), setProfileImage(user.profilePhoto);
              }}
            />
            <EditProfile
              name={'email'}
              value={user?.email}
              onPress={() => setProfileEdit(true)}
            />
            <EditProfile
              name={'password'}
              value={user?.password?.replace(/./g, '*')}
              onPress={() => setProfileEdit(true)}
            />
          </View>
        ) : (
          <View style={styles.editContainer}>
            <View style={styles.editSubContainer}>
              <View
                style={[
                  styles.userBox,
                  {
                    borderBottomColor: focusedName
                      ? '#fff'
                      : 'rgba(255,255,255,.05)',
                  },
                ]}>
                <Text style={styles.fieldText}>Username</Text>
                <TextInput
                  value={userName}
                  onChangeText={setUserName}
                  style={styles.inputTxt}
                  onFocus={() => {
                    setFocusedName(true),
                      setFocusedEmail(false),
                      setFocusedPassword(false);
                  }}
                />
              </View>
              <View
                style={[
                  styles.userBox,
                  {
                    borderBottomColor: focusedEmail
                      ? '#fff'
                      : 'rgba(255,255,255,.05)',
                  },
                ]}>
                <Text style={styles.fieldText}>Email</Text>
                <TextInput
                  value={userEmail}
                  onChangeText={txt => handleUpdateEmail(txt)}
                  style={styles.inputTxt}
                  onFocus={() => {
                    setFocusedEmail(true),
                      setFocusedName(false),
                      setFocusedPassword(false);
                  }}
                  editable={
                    msg === 'user login with social login' ? false : true
                  }
                />
              </View>
              <View
                style={[
                  styles.userBox,
                  {
                    borderBottomColor: focusedPassword
                      ? '#fff'
                      : 'rgba(255,255,255,.05)',
                  },
                ]}>
                <Text style={styles.fieldText}>Password</Text>
                <View style={styles.passwordBox}>
                  <TextInput
                    value={userPassword}
                    onChangeText={txt => handleUpdatePassword(txt)}
                    style={[styles.inputTxt, {width: '80%'}]}
                    onFocus={() => {
                      setFocusedPassword(true),
                        setFocusedName(false),
                        setFocusedEmail(false);
                    }}
                    secureTextEntry={passwordEye}
                    editable={
                      msg === 'user login with social login' ? false : true
                    }
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
            {/* Btns */}
            <View style={styles.btnsContainer}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setProfileEdit(false),
                    setFocusedEmail(false),
                    setFocusedName(false),
                    setFocusedPassword(false);
                  setProfileImage(null);
                }}>
                <Text style={styles.btnTxt}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cancelBtn, styles.saveBtn]}
                onPress={() => {
                  updateProfile(),
                    setFocusedEmail(false),
                    setFocusedName(false),
                    setFocusedPassword(false);
                }}>
                <Text style={[styles.btnTxt, {color: '#171D22'}]}>
                  Save Changes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Animatable.View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  profileContainer: {
    minHeight: height - verticalScale(80),
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1B232A',
  },
  profileImageContainer: {
    width: '100%',
    height: verticalScale(260),
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  profilePictureBox: {
    width: 120,
    height: 120,
    borderRadius: moderateScale(100),
    borderWidth: 1,
    borderColor: '#fff',
    position: 'relative',
  },
  profilePicture: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: moderateScale(100),
  },
  cameraEditBtn: {
    position: 'absolute',
    width: 40,
    height: 40,
    backgroundColor: '#203234',
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
    right: -5,
  },
  cameraEditIcon: {
    width: '60%',
    height: '60%',
    resizeMode: 'contain',
  },
  userName: {
    textTransform: 'capitalize',
    color: '#fff',
    fontSize: moderateScale(14),
    lineHeight: moderateVerticalScale(21),
    position: 'absolute',
    bottom: moderateVerticalScale(30),
    fontFamily: 'HeliosExt-Bold',
  },
  txtInput: {
    width: '80%',
    paddingHorizontal: moderateScale(20),
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  horizontalLine: {
    borderColor: '#7979CC',
    borderWidth: 2,
    width: '100%',
    position: 'absolute',
    bottom: -2,
  },
  socialContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateVerticalScale(20),
    gap: moderateVerticalScale(15),
  },
  socialTxt: {
    fontSize: moderateScale(12),
    color: '#C1C7CD',
    fontFamily: 'HeliosExt',
  },
  socialIconBox: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'blue'
  },
  socialIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    resizeMode: 'contain',
    borderRadius: moderateScale(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInviteBtn: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateVerticalScale(25),
    marginBottom: moderateVerticalScale(10),
  },
  profileSetting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: moderateVerticalScale(20),
    paddingHorizontal: moderateScale(10),
  },
  profileTxtContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: moderateScale(8),
  },
  signOutBox: {
    backgroundColor: '#161C22',
    borderRadius: 50,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: scale(30),
    height: verticalScale(28),
    resizeMode: 'contain',
  },
  profileTxt: {
    color: '#C1C7CD',
    fontFamily: 'HeliosExt',
    lineHeight: moderateVerticalScale(21),
    fontSize: moderateScale(12),
  },
  profileEditBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: moderateScale(8),
  },
  userNameTxt: {
    color: '#777777',
    fontFamily: 'HeliosExt',
    lineHeight: moderateVerticalScale(21),
    fontSize: moderateScale(12),
  },
  rightLongArrow: {
    width: scale(20),
    height: verticalScale(20),
    resizeMode: 'contain',
    tintColor: '#777777',
  },
  profileDetailsContainer: {
    width: '95%',
    borderTopColor: 'rgba(255,255,255,.05)',
    borderTopWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: moderateVerticalScale(20),
    marginTop: moderateVerticalScale(20),
    paddingTop: moderateVerticalScale(20),
  },
  editContainer: {
    width: '100%',
    alignItems: 'center',
  },
  editSubContainer: {
    width: '90%',
    marginTop: moderateVerticalScale(10),
    paddingVertical: moderateVerticalScale(15),
    borderTopColor: 'rgba(255,255,255,.05)',
    borderTopWidth: 1,
    gap: moderateScale(15),
  },
  userBox: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,.05)',
    alignItems: 'flex-start',
  },
  fieldText: {
    fontSize: moderateScale(12),
    color: '#777777',
    fontFamily: 'HeliosExt',
  },
  passwordBox: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputTxt: {
    color: '#fff',
    width: '100%',
    fontSize: moderateScale(12),
    fontFamily: 'HeliosExt',
    textAlign: 'left',
    padding: 0,
    marginTop: moderateVerticalScale(10),
    paddingRight: moderateScale(20),
  },
  btnsContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: moderateScale(10),
    flexDirection: 'row',
    marginTop: moderateVerticalScale(30),
  },
  cancelBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#777777',
    width: '40%',
    paddingVertical: moderateVerticalScale(15),
    borderRadius: moderateScale(15),
  },
  btnTxt: {
    color: '#fff',
    fontSize: moderateScale(13),
    fontFamily: 'HeliosExt-Bold',
  },
  saveBtn: {
    backgroundColor: '#7979CC',
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
    tintColor: '#3E474F',
  },
});
