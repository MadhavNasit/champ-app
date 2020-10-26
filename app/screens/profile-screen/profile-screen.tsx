/**
* My Profile Screen - Display User Details and Recently Viwed Categories
*/

import React, { useEffect, useRef, useState } from "react";
import { ImageStyle, TextStyle, View, ViewStyle, FlatList, Animated, Dimensions, TouchableOpacity, Alert, Platform, StatusBar, BackHandler } from "react-native";

import { useIsFocused, useNavigation } from "@react-navigation/native";

import { observer } from "mobx-react-lite";
import { useStores } from "../../models";

// import component and theme
import { Header, Icon, Screen, Text } from "../../components";
import { color, fontSize, horizantalSpacing, typography, verticalSpacing } from "../../theme";
import { icons } from "../../components/icon/icons";

// import node modules
import Accordion from 'react-native-collapsible/Accordion';
import FastImage from "react-native-fast-image";
import { TextInput } from "react-native-gesture-handler";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen"
import { useNetInfo } from "@react-native-community/netinfo";

// Main Cintainer stle
const ROOT: ViewStyle = {
  flex: 1,
}
const FILL: ViewStyle = {
  flex: 1,
}

// Height for user detail view animations
const HEADER_MAX_HEIGHT = 240;
const HEADER_MIN_HEIGHT = 150;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

// Device Width and Height
const DEVICE_WIDTH = Math.round(Dimensions.get('window').width);
const DEVICE_HEIGHT = Math.round(Dimensions.get('window').height);

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

// -- Saved categories view Starts -- //
// Content view
const STATUSBARHEIGHT = Platform.OS == 'ios' ? 32 : StatusBar.currentHeight;
const TABBARHEIGHT = hp('9.5%');
const CONTENTVIEWHEIGHT = DEVICE_HEIGHT - HEADER_MIN_HEIGHT - TABBARHEIGHT - STATUSBARHEIGHT - 40;
const ContentView: ViewStyle = {
  marginTop: HEADER_SCROLL_DISTANCE,
  minHeight: CONTENTVIEWHEIGHT,
  backgroundColor: color.palette.blackBackground,
  paddingHorizontal: horizantalSpacing[7],
  paddingVertical: verticalSpacing[5],
}
const SavedCategoryHeading: TextStyle = {
  color: color.palette.golden,
  fontSize: fontSize.FONT_20Px,
  marginBottom: verticalSpacing[2],
  fontFamily: typography.regular,
}
const SearchInputStyle: TextStyle = {
  ...TEXT,
  textAlign: 'left',
  fontFamily: typography.light,
  fontSize: fontSize.FONT_15Px,
  padding: 0,
}
const SearchInputView: ViewStyle = {
  marginBottom: verticalSpacing[1],
  borderBottomWidth: 1,
  borderBottomColor: color.palette.white,
  height: hp('4.5%'),
  justifyContent: 'center',
}
const SearchIconView: ViewStyle = {
  position: 'absolute',
  right: wp('2%'),
  bottom: hp('1%'),
}
const SearchIconStyle: ImageStyle = {
  height: 16,
  width: 16,
}
// Accordion style
// -- Accordion Header
const ListOfCategory: ViewStyle = {
  marginTop: verticalSpacing[4],
}
const AccordionHeader: ViewStyle = {
  paddingVertical: verticalSpacing[3],
  paddingHorizontal: horizantalSpacing[3],
  marginBottom: verticalSpacing[2],
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center'
}
const HeaderActive: ViewStyle = {
  ...AccordionHeader,
  backgroundColor: color.palette.golden,
}
const HeaderInActive: ViewStyle = {
  ...AccordionHeader,
  backgroundColor: color.transparent,
  borderColor: color.palette.white,
  borderWidth: 1
}
const AccordionHeaderText: TextStyle = {
  textTransform: 'uppercase',
  fontFamily: typography.regular,
  fontSize: fontSize.FONT_16Px
}
const ActiveHeaderText: TextStyle = {
  ...AccordionHeaderText,
  color: color.palette.black,
}
const InActiveHeaderText: TextStyle = {
  ...AccordionHeaderText,
  color: color.palette.white,
}
const HeaderIcon: ImageStyle = {
  height: 16,
}
const ActiveHeaderIcon: ImageStyle = {
  ...HeaderIcon,
  tintColor: color.palette.black,
  transform: [{ rotate: '90deg' }]
}
const InActiveHeaderIcon: ImageStyle = {
  ...HeaderIcon,
  tintColor: color.palette.white,
  transform: [{ rotate: '270deg' }]
}
// -- Accordion body
const BodySpacing: ViewStyle = {
  marginBottom: verticalSpacing[2],
}
const SubCategoryText: TextStyle = {
  marginBottom: verticalSpacing[1],
  fontFamily: typography.regular,
  fontSize: fontSize.FONT_16Px
}
const MediaIconView: ViewStyle = {
  marginRight: horizantalSpacing[3],
  marginBottom: verticalSpacing[2]
}
const DeleteIconView: ViewStyle = {
  position: 'absolute',
  right: 0,
  top: 0,
  zIndex: 1,
  borderRadius: hp('0.9%'),
  backgroundColor: color.palette.angry,
  padding: 5
}
const DeleteIconStyle: ImageStyle = {
  height: hp('0.9%'),
  width: hp('0.9%')
}
const MediaIconStyle = {
  height: hp('6.5%'),
  width: hp('6.5%'),
  borderWidth: 2,
  zIndex: 0,
  borderColor: color.palette.golden,
  borderRadius: hp('4%'),
  backgroundColor: color.palette.white
}


export const ProfileScreen = observer(function ProfileScreen() {

  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const netInfo = useNetInfo();
  const { userAuth, categoryData, subCategories, visitedSubcategories } = useStores();

  // Store viewed categories
  const [categoryDetails, setCategoryDetails] = useState([]);
  const [filteredArray, setFilteredArray] = useState([]);
  // Reference for scroll
  const scrollY = useRef(new Animated.Value(0)).current;
  // state for active accordion section
  const [activeSections, setActiveSections] = useState([0]);
  // filter term for search input
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [imageError, setImageError] = useState(false);

  // called on every time screen focused
  useEffect(() => {
    if (isFocused) {
      getVisitedCategories();
      BackHandler.addEventListener("hardwareBackPress", backAction)
    }

    return function cleanup() {
      setSearchTerm('');
      setCategoryDetails([]);
      setFilteredArray([]);
      setActiveSections([0]);
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    }
  }, [isFocused]);

  useEffect(() => {
    if (netInfo.isConnected) {
      setImageError(false);
    }
  }, [netInfo.isConnected]);


  // Back on first screen for android
  const backAction = () => {
    navigation.navigate('Dashboard');
    return true;
  }

  // Retrive recently viewed categories and media
  const getVisitedCategories = () => {
    let tempVisitedMedia = [];
    categoryData.mainCategoryData.forEach(mainCategoryElement => {
      subCategories.subCategoryData.forEach(subCategoriesElement => {
        if (subCategoriesElement.parentId == mainCategoryElement.id) {
          let VisitedMedia = [];
          subCategoriesElement.data.forEach(dataElement => {
            // object for filtered data
            let tempObj = new Object;
            tempObj['name'] = dataElement.name;
            if (dataElement.type != 'None') {
              // filter media using visited media Ids
              let temp = dataElement.media.filter((item) => {
                return visitedSubcategories.visitedSubCategoryIds.indexOf(item.id) > -1;
              })
              if (temp.length != 0) {
                tempObj['media'] = temp;
                VisitedMedia.push(tempObj);
              }
            }
          });
          if (VisitedMedia.length > 0) {
            tempVisitedMedia.push({ title: mainCategoryElement.name, content: VisitedMedia });
          }
        }
      });
    });
    // set categories details to state
    setCategoryDetails(tempVisitedMedia);
    setFilteredArray(tempVisitedMedia);
  }

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

  // render fn for Accordion Header
  const _renderHeader = (item, index, isExpanded) => {
    return (
      <View key={index} style={isExpanded ? HeaderActive : HeaderInActive}>
        <Text style={isExpanded ? ActiveHeaderText : InActiveHeaderText}>{item.title}</Text>
        <Icon icon='back' style={isExpanded ? ActiveHeaderIcon : InActiveHeaderIcon} />
      </View>
    );
  };

  // render fn for Accordion Body
  const _renderContent = (data, index) => {
    return (
      <View key={index}>
        {data.content.map((element, key) => {
          return (
            <View key={key} style={BodySpacing}>
              <Text style={SubCategoryText}>{element.name}</Text>
              <FlatList
                data={element.media}
                keyExtractor={(item, index) => index.toString()}
                horizontal={true}
                renderItem={renderMediaIcon}
              />
            </View>
          )
        })}
      </View>
    );
  };

  // Called on press of delete icon
  const removeRecentViewedMedia = (mediaId: number) => {
    Alert.alert(
      "Are you sure",
      "You want to delete this media",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => {
            visitedSubcategories.removeSubCategoryVisited(mediaId);
            getVisitedCategories();
          },
          style: "destructive"
        }
      ],
      { cancelable: false }
    );
  }

  // render fn for media icon
  const renderMediaIcon = ({ item, index }) => {
    return (
      <View
        key={index}
        style={MediaIconView}
      >
        {/* Absolute delete view */}
        <TouchableOpacity
          style={DeleteIconView}
          onPress={() => removeRecentViewedMedia(item.id)}
        >
          <Icon icon='delete' style={DeleteIconStyle} />
        </TouchableOpacity>
        {/* Media Icon View */}
        <View>
          <FastImage
            source={{
              uri: item.type == 'Image' ? item.url : item.video_cover,
              priority: FastImage.priority.normal
            }}
            style={MediaIconStyle}
            resizeMode={FastImage.resizeMode.contain} />
        </View>
      </View>
    )
  }

  // Return media which maches with search string
  const SearchCategories = (term) => {
    setSearchTerm(term)
    if (term == '') {
      setFilteredArray(categoryDetails);
      setActiveSections([]);
    }
    else {
      let filteredArray = categoryDetails.filter((item) => item.title.toLowerCase().includes(term.toLowerCase()))
      if (filteredArray.length > 0) {
        setFilteredArray(filteredArray);
        setActiveSections([0]);
      }
      else {
        let copiedArray = categoryDetails.slice();
        let tempArray = copiedArray.map((element) => {
          return {
            ...element,
            content: element.content.filter((subElement) =>
              subElement.name.toLowerCase().includes(term.toLowerCase()))
          }
        })
        let filteredArray = tempArray.filter((item) => item.content.length > 0)
        setFilteredArray(filteredArray);
        setActiveSections([0]);
      }
    }
  }

  return (
    <Screen style={ROOT} preset="fixed">
      {/* Header Component */}
      <Header headerText='Profile' />

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
          style={FILL}
          scrollEventThrottle={16}
          overScrollMode='never'
          bounces={false}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: scrollY } } }
          ], { useNativeDriver: false })}
        >
          <View style={ContentView}>
            <View>
              <Text text='Saved Category' style={SavedCategoryHeading} />
              {/* Search Categories */}
              <View style={SearchInputView}>
                <TextInput
                  value={searchTerm}
                  onChangeText={(term) => { SearchCategories(term) }}
                  placeholderTextColor={color.palette.offWhite}
                  style={SearchInputStyle}
                  placeholder="Search categories"
                />
                <Icon
                  icon='search'
                  containerStyle={SearchIconView}
                  style={SearchIconStyle}
                />
              </View>
            </View>
            {/* Accordion for recently viewed categories and media */}
            <View style={ListOfCategory}>
              <Accordion
                sections={filteredArray}
                activeSections={activeSections}
                renderHeader={_renderHeader}
                renderContent={_renderContent}
                onChange={(activeSections) => setActiveSections(activeSections)}
              />
            </View>
          </View>
        </Animated.ScrollView>
      </View>
    </Screen >
  )
})
