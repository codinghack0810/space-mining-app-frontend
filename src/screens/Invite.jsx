import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Pressable,
  FlatList,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';
import CloseBtn from '../components/CloseBtn';
import Share from 'react-native-share';
import * as Animatable from 'react-native-animatable';
import Clipboard from '@react-native-clipboard/clipboard';
import {useNavigation} from '@react-navigation/native';
import {PermissionsAndroid} from 'react-native';
import Contacts from 'react-native-contacts';
import Blur from '../components/Blur';
import SendSMS from 'react-native-sms';

const Invite = ({route}) => {
  const navigation = useNavigation();
  const [referCode, setReferCode] = useState('Your Code');
  const [copy, setCopy] = useState(false);
  const [contactList, setContactList] = useState([]);
  const [showContactList, setShowContactList] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [allContacts, setAllContacts] = useState([]);

  const contactPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts',
          message: 'This app would like to view your contacts.',
          buttonPositive: 'Please accept bare mortal',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Contacts.getAll().then(contacts => {
          setAllContacts(contacts);
          setShowContactList(true);
        });
      } else {
        console.log('Contact permission denied');
      }
    } catch (error) {
      console.log('Contact Permission error', error);
    }
  };

  const getReferralCode = async token => {
    try {
      const response = await fetch(
        'http://3.68.231.50:3007/api/getreferalcode',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const result = await response.json();
      if (result.Success) {
        if (result.Code === null) {
          return null;
        }
        return result.Code.referalcode;
      }
    } catch (err) {
      console.log('Error get referral ', err);
    }
  };

  const getDataFromStorage = async () => {
    const data = await getReferralCode(route.params.token);
    if (!data) {
      postReferralCode(route.params.token);
      return;
    }
    setReferCode(data);
  };

  const handleShare = async () => {
    const options = {
      message: `Hey there!

      I've been using this amazing app that lets you earn rewards just by using it. 😄
      
      Use my referral code ${referCode} when signing up and we'll both get extra benefits! 🎉
      
      Download the app now and start earning.
      
      Happy earning!`,
    };
    try {
      const result = await Share.open(options);
      console.log(result);
    } catch (error) {
      console.log('Error....', error);
    }
  };

  const copyToClipboard = () => {
    Clipboard.setString(referCode);
    setCopy(true);
    setTimeout(() => {
      setCopy(false);
    }, 1000);
  };

  const postReferralCode = async token => {
    try {
      const response = await fetch('http://3.68.231.50:3007/api/send_referal', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.Success) {
        setReferCode(result.Referalcode);
      }
    } catch (err) {
      console.log('Error post referral ', err);
    }
  };

  useEffect(() => {
    if (!route.params.connectionStatus) {
      return;
    }
    getDataFromStorage();
  }, [route.params.connectionStatus]);

  // handle Invite contacts
  const handleInviteContacts = () => {
    contactPermission();
  };

  const handleSendContactInvite = phoneNumber => {
    SendSMS.send(
      {
        body: `Hey there!

      I've been using this amazing app that lets you earn rewards just by using it. 😄
      
      Use my referral code ${referCode} when signing up and we'll both get extra benefits! 🎉
      
      Download the app now and start earning.
      
      Happy earning!`,
        recipients: [phoneNumber],
        successTypes: ['sent', 'queued'],
        allowAndroidSendWithoutReadPermission: true,
      },
      (completed, cancelled, error) => {
        console.log(
          'SMS Callback: completed: ' +
            completed +
            ' cancelled: ' +
            cancelled +
            ' error: ' +
            error,
        );
      },
    );
  };

  useEffect(() => {
    if (searchInput.trim() === '') {
      setContactList(allContacts);
    } else {
      const filtered = allContacts.filter(item => {
        if (
          item.displayName.toLowerCase().includes(searchInput.toLowerCase())
        ) {
          return item;
        }
      });
      setContactList(filtered);
    }
  }, [searchInput, allContacts]);

  return (
    <>
      <Animatable.View
        style={styles.inviteContainer}
        animation={'slideInRight'}
        duration={1000}>
        <Image
          source={require('../assets/gif/invite-loading.gif')}
          style={styles.inviteWelcomeImage}
        />
        <CloseBtn onPress={() => navigation.goBack()} />
        <View style={styles.txtContainer}>
          <Text style={styles.bigTxt}>Let's Start Winning!</Text>
          <Text style={styles.smallTxt}>
            Invite your friends to join Space of Mining with your invite code,
            start earning together.
          </Text>
        </View>

        <View style={styles.btnsContainer}>
          <View style={styles.pasteBox}>
            <View style={styles.codeBox}>
              <Text style={styles.input}>{referCode}</Text>
            </View>
            <Pressable onPress={copyToClipboard}>
              <Text style={styles.copyTxt}>{!copy ? 'Copy' : 'Copied'}</Text>
            </Pressable>
          </View>

          <View style={styles.downBtns}>
            <TouchableOpacity style={styles.btn} onPress={handleInviteContacts}>
              <Text style={styles.txt}>Invite your contacts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={handleShare}>
              <Text style={styles.txt}>Share</Text>
            </TouchableOpacity>
            <Text style={styles.termsServices}>
              Terms of Service and <Text>Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </Animatable.View>

      {showContactList && <Blur />}

      {showContactList && (
        <Animatable.View
          style={styles.contactListWrapper}
          animation={'fadeInUpBig'}
          duration={2000}>
          <View style={styles.searchBox}>
            <Image
              source={require('../assets/Images/search-icon.png')}
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Search Tokens"
              style={styles.searchInput}
              placeholderTextColor={'rgba(119, 119, 119, 0.5)'}
              value={searchInput}
              onChangeText={text => setSearchInput(text)}
            />
          </View>
          <View style={styles.contactList} showsVerticalScrollIndicator={false}>
            <FlatList
              data={contactList}
              renderItem={({item}) => {
                return item.phoneNumbers.length ? (
                  <View style={styles.contactListBox}>
                    <View style={styles.contactBar}>
                      <Image
                        source={require('../assets/Images/contact-icon.png')}
                        style={styles.contactPhoto}
                      />
                      <Text style={styles.contactListName}>
                        {item.displayName}
                      </Text>
                      <TouchableOpacity
                        style={styles.contactSendBtn}
                        onPress={() =>
                          handleSendContactInvite(item.phoneNumbers[0].number)
                        }>
                        <Text style={styles.contactSendBtnTxt}>Send</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null;
              }}
              showsVerticalScrollIndicator={false}
              refreshing={<ActivityIndicator />}
            />
          </View>
          <TouchableOpacity
            style={styles.closeContactBtn}
            onPress={() => setShowContactList(false)}>
            <Image
              source={require('../assets/Images/close-icon.png')}
              style={styles.closeImage}
            />
          </TouchableOpacity>
        </Animatable.View>
      )}
    </>
  );
};

export default Invite;

const styles = StyleSheet.create({
  inviteContainer: {
    flex: 1,
    backgroundColor: '#1B232A',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  inviteWelcomeImage: {
    width: '90%',
    height: verticalScale(250),
    resizeMode: 'contain',
  },
  txtContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  bigTxt: {
    fontSize: moderateScale(23),
    color: '#A389B7',
    fontFamily: 'HeliosExt-Bold',
    textTransform: 'capitalize',
    width: '90%',
    textAlign: 'center',
  },
  smallTxt: {
    fontSize: moderateScale(10),
    color: '#fff',
    fontFamily: 'HeliosExt',
    textAlign: 'center',
    width: '80%',
    marginTop: moderateVerticalScale(10),
    lineHeight: moderateVerticalScale(13),
  },
  btnsContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: moderateVerticalScale(20),
  },
  pasteBox: {
    width: '80%',
    backgroundColor: '#A389B7',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: moderateScale(15),
    borderRadius: moderateScale(15),
    paddingVertical: moderateVerticalScale(10),
  },
  codeBox: {
    width: '75%',
    backgroundColor: '#fff',
    borderRadius: moderateScale(15),
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateVerticalScale(15),
  },
  input: {
    textAlign: 'center',
    fontSize: moderateScale(14),
    fontFamily: 'HeliosExt',
    color: 'rgba(0,0,0,0.5)',
  },
  copyTxt: {
    fontSize: moderateScale(12),
    color: '#fff',
    textDecorationLine: 'underline',
    textTransform: 'capitalize',
    fontFamily: 'HeliosExt',
  },
  downBtns: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: moderateScale(15),
    marginTop: moderateVerticalScale(30),
  },
  btn: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: moderateScale(15),
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateVerticalScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    fontSize: moderateScale(18),
    color: '#000',
    fontFamily: 'HeliosExt',
  },
  termsServices: {
    color: '#fff',
    fontSize: moderateScale(8),
    fontFamily: 'HeliosExt',
    textDecorationLine: 'underline',
  },
  contactListWrapper: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactList: {
    paddingVertical: moderateVerticalScale(10),
    paddingHorizontal: moderateScale(15),
    position: 'absolute',
    alignSelf: 'center',
    width: '90%',
    top: verticalScale(100),
    right: moderateScale(10),
    left: moderateScale(20),
    bottom: verticalScale(20),
  },
  contactListBox: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: moderateScale(10),
    paddingBottom: verticalScale(20),
  },
  contactBar: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: moderateScale(100),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: moderateScale(10),
  },
  contactPhoto: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(30),
  },
  contactListName: {
    fontSize: moderateScale(13),
    color: '#000',
    fontFamily: 'HeliosExt',
    width: '50%',
    textAlign: 'center',
    lineHeight: moderateScale(18),
  },
  contactSendBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(8),
    paddingHorizontal: moderateScale(20),
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#A389B7',
    borderRadius: moderateScale(25),
  },
  contactSendBtnTxt: {
    fontSize: moderateScale(12),
    color: '#000',
    fontFamily: 'HeliosExt',
  },
  closeContactBtn: {
    position: 'absolute',
    right: moderateScale(50),
    top: verticalScale(57),
    width: scale(30),
    height: verticalScale(30),
  },
  closeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  // search bar of contact
  searchBox: {
    width: '80%',
    backgroundColor: '#fff',
    paddingVertical: moderateVerticalScale(10),
    paddingHorizontal: moderateScale(15),
    flexDirection: 'row',
    // justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: moderateScale(30),
    marginTop: verticalScale(40),
    position: 'absolute',
    top: verticalScale(10),
  },
  searchIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  searchInput: {
    width: '80%',
    paddingHorizontal: moderateScale(10),
    fontSize: moderateScale(12),
    fontFamily: 'HeliosExt',
    color: '#000',
    height: 'auto',
    paddingVertical: 0,
  },
});
