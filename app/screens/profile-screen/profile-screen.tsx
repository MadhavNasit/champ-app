import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Image, ImageStyle, ScrollView, TextStyle, View, ViewStyle, FlatList, Animated, Dimensions } from "react-native"
import { Header, Icon, Screen, Text, TextField } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { icons } from "../../components/icon/icons"

import Accordion from 'react-native-collapsible/Accordion';
import { useStores } from "../../models"
import { useIsFocused } from "@react-navigation/native"
import FastImage from "react-native-fast-image"
import * as Animatable from 'react-native-animatable';
// import Animated from "react-native-reanimated"

const ROOT: ViewStyle = {
  flex: 1,
}
// const HEADER_MAX_HEIGHT = 200;
// const HEADER_MIN_HEIGHT = 150;
// const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const ProfileDetails: ViewStyle = {
  // position: 'absolute',
  // top: 100,
  // right: 0,
  // left: 0,
  // bottom: 0,
  flexDirection: 'column',
  paddingVertical: spacing[5],
  paddingHorizontal: spacing[6],
  alignItems: 'center',
  justifyContent: 'center',
}
const ProfileImageView: ViewStyle = {
  marginBottom: 8,
}
const ProfileImage: ImageStyle = {
  height: 100,
  width: 100,
  borderRadius: 50,
  borderWidth: 3,
  borderColor: color.palette.golden
}

const TEXT: TextStyle = {
  color: color.palette.white,
  textAlign: 'center'
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

const ContentView: ViewStyle = {
  // marginTop: HEADER_MAX_HEIGHT,
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
  paddingBottom: spacing[0],
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


export const ProfileScreen = observer(function ProfileScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  // OR
  // const rootStore = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  const [activeSections, setActiveSections] = useState([0]);
  const [sections, setSections] = useState([]);
  const { apiData, subCategories } = useStores();
  const isFocused = useIsFocused();
  const [scrollY, setScrollY] = useState(new Animated.Value(0))

  console.tron.log(scrollY);

  useEffect(() => {
    if (isFocused) {
      getVisitedCategories();
    }
  }, [isFocused]);

  const getVisitedCategories = () => {
    let SECTIONS = [];
    apiData.categoryData.forEach(element => {
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

  const _renderHeader = (item, index, isExpanded, isActive) => {
    return (
      <View style={isExpanded ? HeaderActive : HeaderInActive}>
        <Text style={isExpanded ? ActiveHeaderText : InActiveHeaderText}>{item.title}</Text>
        <Icon icon='back' style={isExpanded ? ActiveHeaderIcon : InActiveHeaderIcon} />
      </View>
    );
  };

  const _renderContent = (item, index) => {
    return (
      <View key={index}>
        {item.content.map((element, key) => {
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
                    <View key={index} style={{ marginRight: spacing[3], marginBottom: spacing[2] }}>
                      <FastImage source={{ uri: item.type == 'Image' ? item.url : item.video_cover, priority: FastImage.priority.normal }} style={{ height: 60, width: 60, borderWidth: 2, borderColor: color.palette.golden, borderRadius: 300, backgroundColor: color.palette.white }} resizeMode={FastImage.resizeMode.contain} />
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

  // const headerHeight = scrollY.interpolate({
  //   inputRange: [0, HEADER_SCROLL_DISTANCE],
  //   outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
  //   extrapolate: 'clamp',
  // });
  return (

    <Screen style={ROOT} preset="fixed">
      <Header headerText='Profile' />

      <Animatable.View
        // duration={300}
        // transition='flexDirection'
        style={[ProfileDetails]}

      >
        <View style={ProfileImageView}>
          <Image source={icons.profile_placeholder} style={ProfileImage} />
        </View>
        <View>
          <Text text='Luke Johnson' style={NameText} />
          <Text text='test@email.com' style={Emailaddress} />
          <Text text='29th March, 1999' style={BirthDate} />
        </View>
      </Animatable.View>
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }]
          )}
        >
          <View style={ContentView}>
            <View>
              <Text text='Saved Category' style={SavedCategoryHeading} />
              {/* </View>
          <View> */}
              <TextField
                placeholder="Search categories"
                // value={password}
                // onChangeText={(password) => handlePassword(password)}
                style={TextFieldView}
                returnKeyType="done"
              />
            </View>
            <View style={ListOfCategory}>
              <Accordion
                sections={sections}
                activeSections={activeSections}
                // renderSectionTitle={_renderSectionTitle}
                renderHeader={_renderHeader}
                renderContent={_renderContent}
                onChange={(activeSections) => setActiveSections(activeSections)}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </Screen>
  )
})
