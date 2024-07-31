import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';
import * as Animatable from 'react-native-animatable';

const TeamMember = ({item,index}) => {
  return (
    <Animatable.View
      style={styles.memberContainer}
      animation={'fadeInUp'}
      duration={1000}
      delay={index * 300}
      >
      <View style={styles.memberDetails}>
        <Image
          source={{uri : item.image}}
          style={styles.avtar}
        />
        <View>
          <Text style={styles.memberName}>{item.username}</Text>
          {/* <Text style={styles.memberUserName}>@michael</Text> */}
        </View>
      </View>

      <View style={styles.bellContainer}>
        <Image
          source={require('../assets/Images/notify-ring.png')}
          style={styles.bellImage}
        />
        <Text style={styles.pingTxt}>Ping</Text>
      </View>
    </Animatable.View>
  );
};

export default TeamMember;

const styles = StyleSheet.create({
  memberContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: moderateVerticalScale(10),
    backgroundColor: '#070414',
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(10),
    // marginBottom: moderateVerticalScale(10)
  },
  memberDetails: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: moderateScale(10),
  },
  avtar: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    resizeMode: 'contain',
  },
  memberName: {
    color: '#fff',
    textTransform: 'capitalize',
    fontSize: moderateScale(12),
    fontFamily: 'HeliosExt-Bold',
  },
  memberUserName: {
    color: '#787878',
    fontSize: moderateScale(10),
    fontFamily: 'HeliosExt',
  },
  bellContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: moderateScale(5),
  },
  bellImage: {
    width: scale(20),
    height: verticalScale(20),
    resizeMode: 'contain',
  },
  pingTxt: {
    fontSize: moderateScale(8),
    color: '#3E474F',
    fontFamily: 'HeliosExt-Bold',
  },
});
