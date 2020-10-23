/**
 * Image details screen for media type Image
 * Dislay Details using carousel
 */

import React, { useEffect, useRef, useState } from "react"
import { Dimensions, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { useIsFocused, useNavigation } from "@react-navigation/native"

import { observer } from "mobx-react-lite"
import { useStores } from "../../models"

import FastImage from 'react-native-fast-image'
import HTML from 'react-native-render-html';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { CirclesRotationScaleLoader } from 'react-native-indicator';

import { ActivityLoader, Header, Icon, NavButton, Screen, Text } from "../../components"
import { color } from "../../theme"

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

// Empty List Container
const ErrorView: ViewStyle = {
  alignItems: 'center',
  paddingBottom: 50,
}
const ErrorIcon: ImageStyle = {
  height: 30,
  tintColor: color.palette.white
}
const ErrorText: TextStyle = {
  textAlign: 'center',
  fontSize: 18,
  fontWeight: 'bold'
}

export const ImageDetailScreen = observer(function ImageDetailScreen({ route }: ImageDetailsProps) {
  // Return true on Screen Focus
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  // Store for Subcategory Data
  const { subCategories, visitedSubcategories } = useStores();
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [imageLoading, setImageLoading] = useState(false);
  const [response, setResponse] = useState<boolean>();
  const carousel = useRef()
  // Data fetch on screen focus
  useEffect(() => {
    if (isFocused) {
      getSubCategoryData(route.params.categoryId, route.params.subCategoryId);
    }

    return function cleanup() {
      setResponse(false)
      subCategories.clearSubCategoryMedia();
    };
  }, [isFocused, route.params.subCategoryId]);

  const setVisitedMedia = (index: number) => {
    visitedSubcategories.setSubCategoryVisited(subCategories.subCategoryMedia[index].id);
  }

  // Load data from Api and store in subcategories model
  const getSubCategoryData = async (parentId: number, subCategoryId: number) => {
    await subCategories.getSubCategoryData(parentId);
    setResponse(true);
    subCategories.getCurrentSubCategories(parentId);
    subCategories.getSubCategoryMedia(subCategoryId);
    visitedSubcategories.setCurrentSubCategoryIndex(parentId);
    visitedSubcategories.setSubCategoryVisited(activeSlide + 1);
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
          />
          {imageLoading && (
            <View style={ActivityLoaderStyle}>
              <CirclesRotationScaleLoader
                color={color.palette.golden} />
            </View>
          )}
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

  const EmptyMedia = () => {
    if (!response) return null;
    let errorText = (route.params.mediaType == 'None') ? 'No Data Found..!' : 'Something went Wrong..!!';
    return (
      <View style={ErrorView}>
        <Icon icon='notFound' style={ErrorIcon} />
        <Text text={errorText} style={ErrorText} />
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
            ListEmptyComponent={EmptyMedia}
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
