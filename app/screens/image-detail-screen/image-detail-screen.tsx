/**
 * Image details screen for media type Image
 * Dislay Details using carousel
 */

import React, { useEffect, useRef, useState } from "react"
import { BackHandler, Dimensions, TextStyle, View, ViewStyle } from "react-native"
import { useIsFocused, useNavigation } from "@react-navigation/native"

import { observer } from "mobx-react-lite"
import { useStores } from "../../models"

import FastImage from 'react-native-fast-image'
import HTML from 'react-native-render-html';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { CirclesRotationScaleLoader } from 'react-native-indicator';
import {
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"

import { ActivityLoader, Header, NavButton, Screen, Text } from "../../components"
import { color, fontSize, horizantalSpacing, typography } from "../../theme"
import { useNetInfo } from "@react-native-community/netinfo"

interface ImageDetailsProps {
  route,
}

// Screen style
const ROOT: ViewStyle = {
  flex: 1,
}
const CONTAINER: ViewStyle = {
  flex: 1,
}

// Swiper Render View Style
const SwipeImageView: ViewStyle = {
  flex: 8,
  paddingVertical: hp('1.5%')
}
const SwipeImageStyle = {
  flex: 1
}
const SwipeTextView: ViewStyle = {
  flex: 5,
  paddingVertical: hp('0.75%'),
  alignItems: 'center'
}
const ItemCaption: TextStyle = {
  color: color.palette.white,
  fontSize: fontSize.FONT_20Px,
  fontFamily: typography.bold
}

// Swiper Component Styles
const SwiperWrapper: ViewStyle = {
  flex: 1,
  marginBottom: hp('1.5%'),
}
const SwiperSlide: ViewStyle = {
  flex: 1,
}
const PaginationContainer = {
  backgroundColor: color.transparent
}
const DotStyle = {
  width: hp('1.6%'),
  height: hp('1.6%'),
  borderRadius: hp('1.6%'),
  marginHorizontal: horizantalSpacing[2],
  backgroundColor: color.palette.white
}

// Activity loader style
const ActivityLoaderStyle: ViewStyle = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  justifyContent: 'center',
  alignItems: 'center'
}


export const ImageDetailScreen = observer(function ImageDetailScreen({ route }: ImageDetailsProps) {
  // Return true on Screen Focus
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const netInfo = useNetInfo();
  // Store for Subcategory Data
  const { subCategories, visitedSubcategories } = useStores();
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [imageLoading, setImageLoading] = useState(false);
  const [response, setResponse] = useState<boolean>();
  const [imageError, setImageError] = useState(false);
  const carousel = useRef()
  // Data fetch on screen focus
  useEffect(() => {
    if (isFocused) {
      getSubCategoryData(route.params.categoryId, route.params.subCategoryId);
      BackHandler.addEventListener("hardwareBackPress", backAction);
    }

    return function cleanup() {
      setResponse(false);
      setImageLoading(false);
      BackHandler.removeEventListener("hardwareBackPress", backAction);
      subCategories.clearSubCategoryMedia();
    };
  }, [isFocused, route.params.subCategoryId]);

  useEffect(() => {
    if (netInfo.isConnected) {
      setImageError(false);
    }
  }, [netInfo.isConnected]);

  const setVisitedMedia = (index: number) => {
    visitedSubcategories.setSubCategoryVisited(subCategories.subCategoryMedia[index].id);
  }

  // Back on first screen for android
  const backAction = () => {
    navigation.navigate('subcategory', {
      parentId: route.params.categoryId,
    })
    return true;
  }

  // Load data from Api and store in subcategories model
  const getSubCategoryData = async (parentId: number, subCategoryId: number) => {
    await subCategories.getSubCategoryData(parentId);
    subCategories.getCurrentSubCategories(parentId);
    subCategories.getSubCategoryMedia(subCategoryId);
    visitedSubcategories.setCurrentSubCategoryIndex(parentId);
    visitedSubcategories.setSubCategoryVisited(activeSlide + 1);
    setResponse(true);
  }

  // Carousel Renderitem and Pagination
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

  // Render Swiper view
  const renderItem = ({ item, index }) => {
    if (!response) return null;
    return (
      <View key={index} style={SwiperSlide} >
        <View style={SwipeImageView}>
          <FastImage
            source={{ uri: item.url, priority: FastImage.priority.normal, }}
            style={SwipeImageStyle}
            resizeMode={FastImage.resizeMode.contain}
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
            onError={() => setImageError(true)}
          />
          {imageError && (
            <View style={ActivityLoaderStyle}>
              <Text text="No internet conncetion..!" />
            </View>
          )}
          {imageLoading && !imageError && (
            <View style={ActivityLoaderStyle}>
              <CirclesRotationScaleLoader
                color={color.palette.golden} />
            </View>
          )}
        </View>
        <View style={SwipeTextView} >
          <Text text={item.caption} style={ItemCaption} />
          <HTML tagsStyles={{
            ul: { color: 'white', fontSize: fontSize.FONT_16Px, fontFamily: typography.light },
            p: { color: 'white', fontSize: fontSize.FONT_16Px, fontFamily: typography.light },
            h2: { color: 'white', fontFamily: typography.semiBold }
          }}
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
        onLeftPress={() => navigation.navigate('subcategory', {
          parentId: route.params.categoryId,
        })}
      />
      {/* Main contetnt View  */}
      <View style={CONTAINER}>
        {/* Nav Buttons */}
        <NavButton
          parentId={route.params.categoryId}
          subCategoryId={route.params.subCategoryId}
        />
        {/* Swiper component */}
        <View style={SwiperWrapper}>
          <ActivityLoader />
          <Carousel
            ref={carousel}
            data={subCategories.subCategoryMedia}
            renderItem={renderItem}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={ITEM_WIDTH}
            inactiveSlideOpacity={0}
            inactiveSlideShift={0}
            loop={false}
            onSnapToItem={(index) => {
              setActiveSlide(index);
              setVisitedMedia(index);
            }
            }
          />
          {pagination()}
        </View>
      </View>
    </Screen>
  )
})
