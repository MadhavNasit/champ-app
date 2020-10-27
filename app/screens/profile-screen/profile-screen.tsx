/**
* My Profile Screen - Display User Details and Recently Viwed Categories
*/

import React, { useEffect, useState } from "react";
import { ImageStyle, TextStyle, View, ViewStyle, FlatList, TextInput, Dimensions, TouchableOpacity, Alert, Platform, StatusBar, BackHandler } from "react-native";

import { useIsFocused, useNavigation } from "@react-navigation/native";

import { observer } from "mobx-react-lite";
import { useStores } from "../../models";

// import component and theme
import { Header, Icon, ProfileScroll, Screen, Text } from "../../components";
import { color, fontSize, horizantalSpacing, typography, verticalSpacing } from "../../theme";

// import node modules
import Accordion from 'react-native-collapsible/Accordion';
import FastImage from "react-native-fast-image";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen"

// Main Cintainer stle
const ROOT: ViewStyle = {
  flex: 1,
}

// Height for user detail view animations
const HEADER_MAX_HEIGHT = 240;
const HEADER_MIN_HEIGHT = 150;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

// Device Width and Height
const DEVICE_HEIGHT = Math.round(Dimensions.get('window').height);

const TEXT: TextStyle = {
  color: color.palette.white,
  textAlign: 'center',
  alignSelf: 'flex-start'
}

// -- Saved categories view Starts -- //
// Content view
const STATUSBARHEIGHT = Platform.OS == 'ios' ? 32 : StatusBar.currentHeight;
const TABBARHEIGHT = hp('9.5%');
const CONTENTVIEWHEIGHT = DEVICE_HEIGHT - HEADER_MIN_HEIGHT - TABBARHEIGHT - STATUSBARHEIGHT - hp('4.5%');
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

  const { categoryData, subCategories, visitedSubcategories } = useStores();

  // Store viewed categories
  const [categoryDetails, setCategoryDetails] = useState([]);
  const [filteredArray, setFilteredArray] = useState([]);

  // state for active accordion section
  const [activeSections, setActiveSections] = useState([0]);
  // filter term for search input
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isScrollable, setIsscrollable] = useState<boolean>();

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
    if (tempVisitedMedia.length > 0) {
      setIsscrollable(true);
    }
    else {
      setIsscrollable(false);
    }
  }

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
      <ProfileScroll isScrollable={isScrollable}>
        <View style={[ContentView, { minHeight: CONTENTVIEWHEIGHT }]}>
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
      </ProfileScroll>
    </Screen >
  )
})
