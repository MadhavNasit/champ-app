/**
* My Profile Screen - Display User Details and Recently Viwed Categories
*/

import React, { useEffect, useRef, useState } from "react";
import { TextStyle, View, ViewStyle, Animated, Dimensions } from "react-native";


import { observer } from "mobx-react-lite";
import { useStores } from "../../models";

// import component and theme
import { color, fontSize, typography } from "../../theme";
import { icons } from "../../components/icon/icons";

// import node modules
import FastImage from "react-native-fast-image";
import { useNetInfo } from "@react-native-community/netinfo";

// Main Cintainer stle
const FILL: ViewStyle = {
  flex: 1,
}

// Height for user detail view animations
const HEADER_MAX_HEIGHT = 240;
const HEADER_MIN_HEIGHT = 150;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

// Device Width and Height
const DEVICE_WIDTH = Math.round(Dimensions.get('window').width);

// -- User Details View Starts -- //
const ProfileDetailsLarge: ViewStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  left: 0,
  bottom: 0,
}
// Profile Photo style
const ProfileImage = {
  height: 100,
  width: 100,
  borderRadius: 50,
  borderWidth: 3,
  borderColor: color.palette.golden
}
// Text styles for user details
const TEXT: TextStyle = {
  color: color.palette.white,
  textAlign: 'center',
  alignSelf: 'flex-start'
}
const NameText: TextStyle = {
  ...TEXT,
  fontFamily: typography.semiBold,
  fontSize: fontSize.FONT_24Px,
  marginBottom: 6,
}
const Emailaddress: TextStyle = {
  ...TEXT,
  fontFamily: typography.light,
  fontSize: fontSize.FONT_18Px
}
const BirthDate: TextStyle = {
  ...TEXT,
  fontFamily: typography.light,
  fontSize: fontSize.FONT_18Px
}
// -- User Details View Ends -- //

export interface ProfileScrollProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle,
  children?: React.ReactNode,
  isScrollable?: boolean
}


export const ProfileScroll = observer(function ProfileScroll(props: ProfileScrollProps) {
  const { isScrollable } = props;

  // network information
  const netInfo = useNetInfo();

  const scrollRef = useRef(null);
  const { userAuth } = useStores();

  // Reference for scroll animation
  const scrollY = useRef(new Animated.Value(0)).current;
  const [imageError, setImageError] = useState(false);


  useEffect(() => {
    if (netInfo.isConnected) {
      setImageError(false);
    }
  }, [netInfo.isConnected]);

  // -- Interpolate on Vertical Scroll -- //
  // Chnage height of user profile section
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });
  // Image animations
  const ImageTop = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [20, 25],
    extrapolate: 'clamp',
  })
  const ImageLeft = scrollY.interpolate({
    inputRange: [0, 50, HEADER_SCROLL_DISTANCE],
    outputRange: [DEVICE_WIDTH / 2 - 50, 42, 32],
    extrapolate: 'clamp',
  })
  // Text animations
  const UserDetailsTop = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [130, 25],
    extrapolate: 'clamp',
  })
  const UserDetailsLeft = scrollY.interpolate({
    inputRange: [0, 30, 50, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 160, 160, 160],
    extrapolate: 'clamp',
  })
  const UserDetailsRight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 10],
    extrapolate: 'clamp',
  })
  const minWidth = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: ['100%', '0%'],
    extrapolate: 'clamp',
  });

  return (
    <>

      {/* User Details View */}
      <View>
        <Animated.View
          style={[ProfileDetailsLarge, { maxHeight: headerHeight }]}
        >
          {/* Profile Image */}
          <Animated.View
            style={{
              position: 'absolute',
              top: ImageTop,
              bottom: 0,
              left: ImageLeft
            }}>
            <FastImage
              source={
                (userAuth.userObj.profileUrl != '')
                  ?
                  { uri: userAuth.userObj.profileUrl, priority: FastImage.priority.normal, }
                  :
                  icons.profile_placeholder}
              style={ProfileImage}
              onError={() => setImageError(true)}
              resizeMode={FastImage.resizeMode.cover}
            />
            {imageError && (
              <FastImage
                source={icons.profile_placeholder}
                style={[ProfileImage, { position: 'absolute', top: 0, zIndex: 2 }]}
                onError={() => setImageError(true)}
                resizeMode={FastImage.resizeMode.cover}
              />
            )}
          </Animated.View>
          {/* User Details */}
          <Animated.View
            style={{
              position: 'absolute',
              top: UserDetailsTop,
              left: UserDetailsLeft,
              right: UserDetailsRight,
              height: 100,
              justifyContent: 'center'
            }}>
            <Animated.Text
              style={[NameText, { minWidth }]}
              numberOfLines={1}
            >
              {userAuth.userObj.userName != '' ? userAuth.userObj.userName : 'Test User'}
            </Animated.Text>
            <Animated.Text
              style={[Emailaddress, { minWidth }]}
              numberOfLines={1}
            >{userAuth.userObj.userEmail}
            </Animated.Text>
            <Animated.Text
              style={[BirthDate, { minWidth }]}
              numberOfLines={1}
            >
              {'29th March, 1999'}
            </Animated.Text>
          </Animated.View>
        </Animated.View>
      </View>

      {/* Saved Category View */}
      <View style={{ flexGrow: 1, marginTop: HEADER_MIN_HEIGHT }} >
        <Animated.ScrollView
          ref={scrollRef}
          style={FILL}
          scrollEnabled={isScrollable}
          endFillColor={color.palette.angry}
          scrollEventThrottle={16}
          overScrollMode='never'
          bounces={false}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: scrollY } } }
          ], { useNativeDriver: false })}
          onScrollEndDrag={(event) => {
            if (event.nativeEvent.contentOffset.y < 30) {

              scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true })
            }
            else if (event.nativeEvent.contentOffset.y <= 95) {
              scrollRef.current?.scrollTo({ x: 0, y: 95, animated: true })
            }
          }
          }
        >
          {props.children}
        </Animated.ScrollView>
      </View>
    </>
  )
})
