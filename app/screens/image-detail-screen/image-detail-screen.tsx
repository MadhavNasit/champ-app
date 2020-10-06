import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { Image, ImageStyle, StyleSheet, TextStyle, View, ViewStyle } from "react-native"
import { Button, Header, Icon, Screen, Text } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import Swiper from "react-native-swiper"
import { useStores } from "../../models"
import { TouchableOpacity } from "react-native-gesture-handler"
import HTML from 'react-native-render-html';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { useIsFocused } from "@react-navigation/native"
import { async } from "validate.js"


const ROOT: ViewStyle = {
  flex: 1,
}

const CONTAINER: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing[6]
}

const NavButtonView: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginVertical: 10
}
const NavButtonStyle: ViewStyle = {
  borderWidth: 1,
  alignItems: 'center',
  paddingHorizontal: 8,
  paddingVertical: 6
}
const NavButtonPrev: ViewStyle = {
  ...NavButtonStyle,
  flexDirection: 'row',
  borderColor: color.palette.white,
}
const NavButtonNext: ViewStyle = {
  ...NavButtonStyle,
  flexDirection: 'row-reverse',
  borderColor: color.palette.golden,
  backgroundColor: color.palette.golden,
}
const NavIconStyle: ImageStyle = {
  height: 10,
  width: 8,
}
const NavIconPrev: ImageStyle = {
  ...NavIconStyle,
  marginRight: 5,
  tintColor: color.palette.white
}
const NavIconNext: ImageStyle = {
  ...NavIconStyle,
  marginLeft: 5,
  tintColor: color.palette.black
}
const NavPrevText: TextStyle = {
  color: color.palette.white
}
const NavNextText: TextStyle = {
  color: color.palette.black
}
const TEXT: TextStyle = {
  color: color.palette.white
}
const ItemCaption: TextStyle = {
  ...TEXT,
  fontSize: 20,
  fontWeight: 'bold'
}

const SwiperWrapper: ViewStyle = {
  flex: 1,
  // justifyContent: 'center',
  // alignItems: 'center',
  // marginBottom: 15,
}
const SwiperSlide: ViewStyle = {
  flex: 1,
  // justifyContent: 'center'
}

export const ImageDetailScreen = observer(function ImageDetailScreen({ route }) {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  // OR
  // const rootStore = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()

  const isFocused = useIsFocused();
  const { subCategories } = useStores();
  useEffect(() => {
    getSubCategoryData(route.params.parentId, route.params.subCategoryId);
    console.tron.log('In fn')
  }, [isFocused])
  const getSubCategoryData = async (parentId: number, subCategoryId: number) => {
    await subCategories.getSubCategoryData(parentId);
    await subCategories.getSubCategoryMedia(subCategoryId);
  }
  const swiperItems = subCategories.subCategoryMedia.map((item, key) => {
    return (
      <View key={key} style={SwiperSlide} >
        <View style={{ flex: 5, paddingHorizontal: 10, paddingVertical: 20 }}>
          <Image source={{ uri: item.url }} resizeMode='contain' style={{ flex: 1 }} />
        </View>
        <View style={{ flex: 4, paddingVertical: 10, alignItems: 'center' }} >
          <Text text={item.caption} style={ItemCaption} />
          <HTML html={'<div style="color: white; fontSize: 17">' + item.description + "</div>"} />
        </View>
      </View>
    )
  });

  const NavButton = (props) => {
    const { buttonStyle, icon, iconStyle, buttonText, textStyle } = props;
    return (
      <TouchableOpacity style={buttonStyle}>
        <Icon icon={icon} style={iconStyle} />
        <Text text={buttonText} style={textStyle} />
      </TouchableOpacity>
    );
  }

  return (
    <Screen style={ROOT} preset="fixed">
      <Header
        headerText={route.params.subCategoryName}
        rightIcon='hamburger'
        leftIcon='back'
      />
      <View style={CONTAINER}>
        <View style={NavButtonView}>
          <NavButton
            buttonStyle={NavButtonPrev}
            icon='back'
            iconStyle={NavIconPrev}
            buttonText='PREV'
            textStyle={NavPrevText}
          />
          <NavButton
            buttonStyle={NavButtonNext}
            icon='next'
            iconStyle={NavIconNext}
            buttonText='NEXT'
            textStyle={NavNextText}
          />
        </View>
        <View style={SwiperWrapper}>
          <Swiper
            showsPagination={true}
            dotStyle={{ height: 13.3, width: 13.3, borderRadius: 13.3, marginLeft: 8, marginRight: 8 }}
            activeDotStyle={{ height: 13.3, width: 13.3, borderRadius: 13.3, marginLeft: 8, marginRight: 8 }}
            dotColor={color.palette.white}
            activeDotColor={color.palette.golden}
            loop={false}
          >
            {swiperItems}
          </Swiper>
        </View>
      </View>
    </Screen>
  )
})
