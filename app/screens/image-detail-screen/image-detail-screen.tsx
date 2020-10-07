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

// Screen style
const ROOT: ViewStyle = {
  flex: 1,
}
const CONTAINER: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing[6]
}

// nav Buttons Style
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

// Swiper Render View Style
const SwipeImageView: ViewStyle = {
  flex: 5,
  paddingHorizontal: 10,
  paddingVertical: 20
}
const SwipeImageStyle: ImageStyle = {
  flex: 1
}
const SwipeTextView: ViewStyle = {
  flex: 4,
  paddingVertical: 10,
  alignItems: 'center'
}
const ItemCaption: TextStyle = {
  color: color.palette.white,
  fontSize: 20,
  fontWeight: 'bold'
}

// Swiper Component Styles
const SwiperWrapper: ViewStyle = {
  flex: 1,
  marginBottom: 15,
}
const SwiperSlide: ViewStyle = {
  flex: 1,
}
const DotStyle: ViewStyle = {
  height: 13.3,
  width: 13.3,
  borderRadius: 13.3,
  marginLeft: 8,
  marginRight: 8
}

export const ImageDetailScreen = observer(function ImageDetailScreen({ route }) {
  // Return true on Screen Focus
  const isFocused = useIsFocused();

  // Store for Subcategory Data
  const { subCategories } = useStores();

  // Data fetch on screen focus
  useEffect(() => {
    if (isFocused) {
      getSubCategoryData(route.params.categoryId, route.params.subCategoryId);
    }
  }, [isFocused]);

  // Load data from Api and store in subcategories model
  const getSubCategoryData = async (parentId: number, subCategoryId: number) => {
    await subCategories.getSubCategoryData(parentId);
    await subCategories.getSubCategoryMedia(subCategoryId);
  }

  // Prev and Next button component
  const NavButton = (props) => {
    const { buttonStyle, icon, iconStyle, buttonText, textStyle } = props;
    return (
      <TouchableOpacity
        style={buttonStyle}
      >
        <Icon icon={icon} style={iconStyle} />
        <Text text={buttonText} style={textStyle} />
      </TouchableOpacity>
    );
  }

  // Swiper item render View
  const swiperItems = subCategories.subCategoryMedia.map((item, key) => {
    return (
      <View key={key} style={SwiperSlide} >
        <View style={SwipeImageView}>
          <Image source={{ uri: item.url }} resizeMode='contain' style={SwipeImageStyle} />
        </View>
        <View style={SwipeTextView} >
          <Text text={item.caption} style={ItemCaption} />
          <HTML tagsStyles={{ ul: { color: 'white', fontSize: 16 }, p: { color: 'white', fontSize: 16 }, h2: { color: 'white' } }}
            listsPrefixesRenderers={{
              ul: (htmlAttribs, children, convertedCSSStyles, passProps) => {
                return (
                  <Text style={{ color: 'white', fontSize: 16, marginRight: 5 }}>•</Text>
                );
              }
            }}
            html={'<div style="color: white">' + item.description + "</div>"}
          />
        </View>
      </View>
    )
  });

  return (
    <Screen style={ROOT} preset="fixed">
      {/* Header Compoennt */}
      <Header
        headerText={route.params.subCategoryName}
        rightIcon='hamburger'
        leftIcon='back'
      />
      {/* Main contetnt View  */}
      <View style={CONTAINER}>
        {/* Nav Buttons */}
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
        {/* Swiper component */}
        <View style={SwiperWrapper}>
          <Swiper
            showsPagination={true}
            dotStyle={DotStyle}
            activeDotStyle={DotStyle}
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
