import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  moderateScale,
  moderateVerticalScale,
  verticalScale,
} from 'react-native-size-matters';
import InviteButton from '../components/InviteButton';
import TeamMember from '../components/TeamMember';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Team = ({token, connectionStatus}) => {
  const navigation = useNavigation();
  const [referCode, setReferCode] = useState(null);
  const [referalUser, setReferalUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const teamMemberAPI = async () => {
    try {
      const response = await fetch(
        'http://3.68.231.50:3007/api/get_users_of_referalcode',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            referalcode: referCode,
          }),
        },
      );
      const result = await response.json();
      setIsLoading(false);
      if (result.Success) {
        if (result.Users.length) {
          setReferalUser(result.Users);
        } else {
          return null;
        }
      }
    } catch (error) {
      console.log('Error in store time in db profile', error);
    }
  };

  useEffect(() => {
    if (!referCode || !connectionStatus) {
      return;
    }
    const id = setInterval(() => {
      teamMemberAPI();
    }, 3000);
    return () => clearInterval(id);
  }, [referCode, connectionStatus]);

  const getReferralCode = async () => {
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
    const data = await getReferralCode();
    if (!data) {
      postReferralCode();
      return;
    }
    setReferCode(data);
  };

  const postReferralCode = async () => {
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
      console.log('Error get profile ', err);
    }
  };

  useEffect(() => {
    if (!connectionStatus) {
      return;
    }
    getDataFromStorage();
  }, [connectionStatus]);

  return (
    <ScrollView
      style={{backgroundColor: '#1B232A'}}
      showsVerticalScrollIndicator={false}>
      <Animatable.View
        style={styles.teamContainer}
        animation={'fadeInDownBig'}
        duration={1200}>
        <View style={styles.teamScreenWrapper}>
          <Image
            source={require('../assets/Images/all-planet.png')}
            style={styles.planets}
          />

          <View style={styles.teamBtn}>
            <InviteButton
              navigation={navigation}
              token={token}
              connectionStatus={connectionStatus}
            />
          </View>

          {isLoading ? (
            <ActivityIndicator
              size={moderateScale(35)}
              color={'#fff'}
              style={{marginTop: verticalScale(15)}}
            />
          ) : (
            <View style={styles.teamBox}>
              <Text style={styles.txt}>
                You have invited:{' '}
                {referalUser.length.toString().padStart(2, '0')}
              </Text>
              {/* <Text style = {styles.txt}>Your team has: {referalUser.length.toString().padStart(2, '0')}</Text> */}
              <Text style={styles.txt}>Your team has: 00</Text>
              <Text style={styles.txt}>
                Currently earning:{' '}
                {(referalUser.length * 100).toString().padStart(2, '0')}
              </Text>
            </View>
          )}
          <View style={styles.teamMemberContainer}>
            {referalUser.map((item, index) => (
              <View key={index}>
                <TeamMember item={item} index={index} />
              </View>
            ))}
          </View>
        </View>
      </Animatable.View>
    </ScrollView>
  );
};

export default Team;

const styles = StyleSheet.create({
  teamContainer: {
    flex: 1,
    backgroundColor: '#1B232A',
  },
  teamScreenWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  planets: {
    width: '100%',
    resizeMode: 'contain',
    marginTop: moderateVerticalScale(20),
    height: verticalScale(130),
  },
  teamBtn: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderateVerticalScale(20),
  },
  teamBox: {
    width: '90%',
    backgroundColor: '#070414',
    borderRadius: moderateScale(5),
    gap: moderateScale(20),
    alignItems: 'flex-start',
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateVerticalScale(15),
  },
  txt: {
    color: '#fff',
    fontSize: moderateScale(12),
    fontFamily: 'HeliosExt',
  },
  teamMemberContainer: {
    width: '90%',
    justifyContent: 'center',
    alignContent: 'center',
    gap: moderateScale(10),
    marginVertical: moderateVerticalScale(20),
  },
});
