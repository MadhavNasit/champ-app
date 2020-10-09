import React, { useEffect, useRef, useState } from "react"
import { Dimensions, ImageStyle, TextStyle, View, ViewStyle, TouchableOpacity } from "react-native"
import { observer } from "mobx-react-lite"
import { useIsFocused } from "@react-navigation/native"

import FastImage from 'react-native-fast-image'
import HTML from 'react-native-render-html';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import { Header, Icon, Screen, Text } from "../../components"
import { color, spacing } from "../../theme"
import { useStores } from "../../models"

// Screen style
const ROOT: ViewStyle = {
  flex: 1,
}
const CONTAINER: ViewStyle = {
  flex: 1,
}

// nav Buttons Style
const NavButtonView: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginVertical: 10,
  paddingHorizontal: spacing[6]
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
  flex: 8,
  paddingVertical: 20
}
const SwipeImageStyle = {
  flex: 1
}
const SwipeTextView: ViewStyle = {
  flex: 5,
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
const PaginationContainer = {
  backgroundColor: color.transparent
}
const DotStyle = {
  width: 13.3,
  height: 13.3,
  borderRadius: 6.5,
  marginHorizontal: 8,
  backgroundColor: color.palette.white
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

    return function cleanup() {
      subCategories.clearSubCategoryMedia();
      console.tron.log('Clean Data');
    };
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

  // Carousel Renderitem and Pagination
  const carousel = useRef()
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const SLIDER_WIDTH = Dimensions.get('window').width;
  const ITEM_WIDTH = SLIDER_WIDTH - 72;

  function pagination() {
    return (
      <Pagination
        dotsLength={subCategories.subCategoryMedia.length}
        activeDotIndex={activeSlide}
        containerStyle={PaginationContainer}
        dotStyle={DotStyle}
        dotColor={color.palette.golden}
        inactiveDotColor={color.palette.white}
        inactiveDotOpacity={1}
        inactiveDotScale={1}
      />
    );
  }

  const renderItem = ({ item, index }) => {
    return (
      <View key={index} style={SwiperSlide} >
        <View style={SwipeImageView}>
          <FastImage source={{ uri: item.url, priority: FastImage.priority.normal, }} style={SwipeImageStyle} resizeMode={FastImage.resizeMode.contain} />

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
  }

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
          <Carousel
            ref={carousel}
            layout={"default"}
            data={subCategories.subCategoryMedia}
            renderItem={renderItem}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={ITEM_WIDTH}
            inactiveSlideOpacity={0}
            inactiveSlideShift={0}
            loop={false}
            onSnapToItem={(index) => setActiveSlide(index)}
          />
          {pagination()}
        </View>
      </View>
    </Screen>
  )
})
