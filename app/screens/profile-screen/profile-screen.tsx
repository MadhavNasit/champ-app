import React, { useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Image, ImageStyle, ScrollView, TextStyle, View, ViewStyle, FlatList, Animated, Platform, Dimensions } from "react-native"
import { Header, Icon, Screen, Text, TextField } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// timport { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { icons } from "../../components/icon/icons"
import SearchInput, { createFilter } from 'react-native-search-filter';

import Accordion from 'react-native-collapsible/Accordion';
import { useStores } from "../../models"
import { CommonActions, useIsFocused, useNavigation } from "@react-navigation/native"
import FastImage from "react-native-fast-image"
import { TouchableOpacity } from "react-native-gesture-handler"
// import Animated from "react-native-reanimated"

const ROOT: ViewStyle = {
  flex: 1,
}
const HEADER_MAX_HEIGHT = 230;
const HEADER_MIN_HEIGHT = 150;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const DEVICE_WIDTH = Math.round(Dimensions.get('window').width);
const DEVICE_HEIGHT = Math.round(Dimensions.get('window').height);

const ProfileDetailsLarge: ViewStyle = {
  position: 'absolute',
  // top: Platform.OS == 'ios' ? 80 : 55,
  top: 0,
  right: 0,
  left: 0,
  bottom: 0,
}

// const ProfileImageView: ViewStyle = {
//   marginBottom: 8,
// }
const ProfileImage: ImageStyle = {
  height: 100,
  width: 100,
  borderRadius: 50,
  borderWidth: 3,
  borderColor: color.palette.golden
}

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
const CONTENTVIEWHEIGHT = DEVICE_HEIGHT - HEADER_MIN_HEIGHT - DEVICE_HEIGHT * 0.1 - 75;
const ContentView: ViewStyle = {
  marginTop: HEADER_SCROLL_DISTANCE,
  // flexGrow: 1,
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
  // paddingVertical: 10
}

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

const KEYS_TO_FILTERS = ['title'];

export const ProfileScreen = observer(function ProfileScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  // OR
  // const rootStore = useStores()

  // Pull in navigation via hook
  const navigation = useNavigation()
  const [activeSections, setActiveSections] = useState([0]);
  const [sections, setSections] = useState([]);
  const { userAuth, categoryData, subCategories } = useStores();
  const isFocused = useIsFocused();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (isFocused) {
      getVisitedCategories();
    }
  }, [isFocused]);

  const getVisitedCategories = () => {
    let SECTIONS = [];
    categoryData.categoryData.forEach(element => {
      subCategories.subCategoryData.forEach(subData => {
        if (subData.parentId == element.id) {
          var VisitedData = subData.data.filter(function (itm) {
            return subCategories.visitedSubCategoryIds.indexOf(itm.id) > -1;
          });
          console.tron.log('VisitedData', VisitedData);
          SECTIONS.push({ title: element.name, content: VisitedData });
        }
      });
    });
    setSections(SECTIONS);
    console.tron.log('SECTION', SECTIONS);
  }

  const _renderHeader = (item, index, isExpanded) => {
    return (
      <View style={isExpanded ? HeaderActive : HeaderInActive}>
        <Text style={isExpanded ? ActiveHeaderText : InActiveHeaderText}>{item.title}</Text>
        <Icon icon='back' style={isExpanded ? ActiveHeaderIcon : InActiveHeaderIcon} />
      </View>
    );
  };

  const filteredArray = sections.filter(createFilter(searchTerm, KEYS_TO_FILTERS))

  const _renderContent = (itemm, index) => {
    return (
      <View key={index}>
        {itemm.content.map((element, key) => {
          console.tron.log('element ', element);
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
                    <TouchableOpacity
                      key={index} style={{ marginRight: spacing[3], marginBottom: spacing[2] }}
                      onPress={() => navigation.dispatch(CommonActions.navigate(
                        'Dashboard', {
                        screen: item.type == 'Image' ? 'imagedetail' : 'videodetail',
                        params: {
                          categoryId: element.parent_id,
                          subCategoryId: element.id,
                          subCategoryName: element.name,
                          activeId: item.id
                        },
                        initial: false,
                      }))}
                    >
                      <FastImage source={{ uri: item.type == 'Image' ? item.url : item.video_cover, priority: FastImage.priority.normal }} style={{ height: 60, width: 60, borderWidth: 2, borderColor: color.palette.golden, borderRadius: 300, backgroundColor: color.palette.white }} resizeMode={FastImage.resizeMode.contain} />
                    </TouchableOpacity>
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
  const minWidth = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: ['100%', '0%'],
    extrapolate: 'clamp',
  });

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
          <Animated.View style={{ position: 'absolute', top: UserDetailsTop, left: UserDetailsLeft, height: 100, justifyContent: 'center' }}>
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
                  onChangeText={(term) => { setSearchTerm(term) }}
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
