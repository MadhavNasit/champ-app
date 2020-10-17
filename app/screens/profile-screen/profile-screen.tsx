// *
// ** My Profile Screen - Display User Details and Recently Viwed Categories
// *
import React, { useEffect, useRef, useState } from "react";
import { Image, ImageStyle, TextStyle, View, ViewStyle, FlatList, Animated, Platform, Dimensions, TouchableOpacity } from "react-native";

import { CommonActions, useIsFocused, useNavigation } from "@react-navigation/native";

import { observer } from "mobx-react-lite";
import { useStores } from "../../models";

import { Header, Icon, Screen, Text } from "../../components";
import { color, spacing } from "../../theme";
import { icons } from "../../components/icon/icons";

import Accordion from 'react-native-collapsible/Accordion';
import FastImage from "react-native-fast-image";
import SearchInput, { createFilter } from 'react-native-search-filter';
import { async } from "validate.js";

// Main Cintainer stle
const ROOT: ViewStyle = {
  flex: 1,
}

// Height for user detail view animations
const HEADER_MAX_HEIGHT = 230;
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
const ProfileImage: ImageStyle = {
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
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 6,
}
const Emailaddress: TextStyle = {
  ...TEXT,
  fontSize: 18
}
const BirthDate: TextStyle = {
  ...TEXT,
  fontSize: 18
}
// -- User Details View Ends -- //

// -- Saved categories view Starts -- //
// Content view
const CONTENTVIEWHEIGHT = DEVICE_HEIGHT - HEADER_MIN_HEIGHT - DEVICE_HEIGHT * 0.1 - 75;
const ContentView: ViewStyle = {
  marginTop: HEADER_SCROLL_DISTANCE,
  minHeight: CONTENTVIEWHEIGHT,
  backgroundColor: color.palette.blackBackground,
  paddingHorizontal: spacing[6],
  paddingVertical: spacing[5],
}
const SavedCategoryHeading: TextStyle = {
  color: color.palette.golden,
  fontSize: 20,
}
const TextFieldView: ViewStyle = {
  borderBottomWidth: 1,
  borderBottomColor: color.palette.white,
  height: 40,
  paddingTop: Platform.OS == 'ios' ? 10 : 0,
}
// Accordion style
const ListOfCategory: ViewStyle = {
  marginTop: spacing[4],
}
const AccordionHeader: ViewStyle = {
  paddingVertical: spacing[3],
  paddingHorizontal: spacing[3],
  marginBottom: spacing[2],
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
  textTransform: 'uppercase'
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

export const ProfileScreen = observer(function ProfileScreen() {

  const navigation = useNavigation()
  const [activeSections, setActiveSections] = useState([0]);
  const [sections, setSections] = useState([]);
  const { userAuth, categoryData, subCategories, activityLoader } = useStores();
  const isFocused = useIsFocused();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (isFocused) {
      activityLoader.setLoading(true);
      getVisitedCategories();
      activityLoader.setLoading(false);
    }

  }, [isFocused]);

  useEffect(() => {
    activityLoader.setLoading(true);
    getVisitedCategories();
    activityLoader.setLoading(false);
  }, [refresh])

  const getVisitedCategories = () => {
    const SECTIONS = [];
    categoryData.categoryData.forEach(element => {
      subCategories.subCategoryData.forEach(subData => {
        if (subData.parentId == element.id) {
          let VisitedMedia = [];
          subData.data.forEach(dataElement => {
            let tempElement = dataElement;
            if (dataElement.type != 'None') {
              let temp = dataElement.media.filter((item) => {
                console.tron.log(item, subCategories.visitedSubCategoryIds.indexOf(item.id) > -1)
                return subCategories.visitedSubCategoryIds.indexOf(item.id) > -1;
              })
              if (temp.length != 0) {
                tempElement.media = temp;
                VisitedMedia.push(tempElement);
              }
            }
          });
          SECTIONS.push({ title: element.name, content: VisitedMedia });
        }
      });
    });
    setSections(SECTIONS);
  }

  const _renderHeader = (item, index, isExpanded) => {
    return (
      <View style={isExpanded ? HeaderActive : HeaderInActive}>
        <Text style={isExpanded ? ActiveHeaderText : InActiveHeaderText}>{item.title}</Text>
        <Icon icon='back' style={isExpanded ? ActiveHeaderIcon : InActiveHeaderIcon} />
      </View>
    );
  };



  const _renderContent = (data, index) => {
    if (data.content.length == 0) {
      return (
        <Text text='Nothing Here.!' style={{ textAlign: 'left' }} />
      )
    }
    return (
      <View key={index}>
        {data.content.map((element, key) => {
          return (
            <View key={key} style={{ marginBottom: spacing[2] }}>
              <Text style={{ marginBottom: spacing[2] }}>{element.name}</Text>
              <FlatList
                data={element.media}
                keyExtractor={(item, index) => index.toString()}
                horizontal={true}
                ListEmptyComponent={() => {
                  return (
                    <View style={{ marginRight: spacing[3], marginBottom: spacing[2] }}>
                      <FastImage source={{ uri: null, priority: FastImage.priority.normal }} style={{ height: 60, width: 60, borderWidth: 2, borderColor: color.palette.golden, borderRadius: 300, backgroundColor: color.palette.white }} resizeMode={FastImage.resizeMode.contain} />
                    </View>
                  )
                }}
                renderItem={({ item, index }: any) => {
                  return (
                    <View
                      key={index}
                      style={{ marginRight: spacing[3], marginBottom: spacing[2] }}
                    >
                      <TouchableOpacity
                        style={{ position: 'absolute', right: 0, top: 0, zIndex: 1, borderRadius: 10, backgroundColor: 'red', padding: 5 }}
                        onPress={() => {
                          subCategories.removeSubCategoryVisited(item.id)
                          setRefresh(!refresh);
                        }}
                      >
                        <Icon icon='delete' style={{ height: 10, width: 10 }} />
                      </TouchableOpacity>
                      <View>

                        <FastImage source={{ uri: item.type == 'Image' ? item.url : item.video_cover, priority: FastImage.priority.normal }} style={{ height: 60, width: 60, borderWidth: 2, zIndex: 0, borderColor: color.palette.golden, borderRadius: 300, backgroundColor: color.palette.white }} resizeMode={FastImage.resizeMode.contain} />
                      </View>
                    </View>
                  )
                }}
              />
            </View>
          )
        })}
      </View>
    );
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });
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

  const searchCategories = (term) => {
    setSearchTerm(term)
    let filteredArray = sections.filter(createFilter(searchTerm, ['title']))
    setSections(filteredArray);
  }

  return (

    <Screen style={ROOT} preset="fixed">
      <Header headerText='Profile' />
      <View>
        <Animated.View
          style={[ProfileDetailsLarge, { maxHeight: headerHeight }]}
        >
          <Animated.View style={{ position: 'absolute', top: ImageTop, bottom: 0, left: ImageLeft }}>
            <Image
              source={userAuth.userObj.profileUrl != '' ? { uri: userAuth.userObj.profileUrl } : icons.profile_placeholder}
              style={ProfileImage} />
          </Animated.View>
          <Animated.View style={{ position: 'absolute', top: UserDetailsTop, left: UserDetailsLeft, right: UserDetailsRight, height: 100, justifyContent: 'center' }}>
            <Animated.Text style={[NameText, { minWidth }]} numberOfLines={1} >{userAuth.userObj.userName != '' ? userAuth.userObj.userName : 'Test User'}</Animated.Text>
            <Animated.Text style={[Emailaddress, { minWidth }]} numberOfLines={1} >{userAuth.userObj.userEmail}</Animated.Text>
            <Animated.Text style={[BirthDate, { minWidth }]} numberOfLines={1} >{'29th March, 1999'}</Animated.Text>
          </Animated.View>
        </Animated.View>
      </View>
      <View style={{ flexGrow: 1, marginTop: HEADER_MIN_HEIGHT }} >
        <Animated.ScrollView
          style={{ flex: 1 }}
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
              <View style={{ marginTop: spacing[1] }}>
                <Icon icon='search' style={{ height: 16, width: 16, position: 'absolute', right: 10, top: 12 }} />
                <SearchInput
                  // onChangeText={(term) => { setSearchTerm(term) }}
                  onChangeText={(term) => searchCategories(term)}
                  placeholderTextColor={color.palette.offWhite}
                  style={{ color: color.palette.white }}
                  inputViewStyles={TextFieldView}
                  placeholder="Search categories"
                  fuzzy={true}
                />
              </View>
            </View>
            <View style={ListOfCategory}>
              <Accordion
                sections={sections}
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
