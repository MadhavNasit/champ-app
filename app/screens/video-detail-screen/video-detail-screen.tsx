/**
 * Video details screen display video and its details 
 */

import React, { useEffect, useState } from "react"
import { BackHandler, FlatList, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { useIsFocused, useNavigation } from "@react-navigation/native"

import { observer } from "mobx-react-lite"
import { useStores } from "../../models"

// Component and theme import
import { ActivityLoader, Header, Icon, NavButton, Screen, Text } from "../../components"
import { color, spacing, typography } from "../../theme"

// node modules import
import HTML from 'react-native-render-html';
import YoutubePlayer, { InitialPlayerParams } from "react-native-youtube-iframe";
import { CirclesRotationScaleLoader } from 'react-native-indicator';

interface VideoDetailsProps {
  route
}

// screen container
const ROOT: ViewStyle = {
  flex: 1,
}
const CONTAINER: ViewStyle = {
  flex: 1,
}
const FILL: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing[6]
}

// Text style 
const TEXT: TextStyle = {
  color: color.palette.white
}

// FlatList View Style for main content
const FlatListContainer: ViewStyle = {
  flexGrow: 1,
}
const FlatListStyle: ViewStyle = {
  paddingBottom: 15,
}
const UnorderedListText: TextStyle = {
  ...TEXT,
  fontSize: 16,
  fontFamily: typography.light
}
const ParagraphText: TextStyle = {
  ...UnorderedListText,
  fontFamily: typography.light
}
const BulletStyle: TextStyle = {
  ...TEXT,
  fontSize: 16,
  marginRight: 5
}

// Activity loader style
const VideoActivityLoader: ViewStyle = {
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
  flex: 1,
  justifyContent: 'center',
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
  fontFamily: typography.semiBold,
}

export const VideoDetailScreen = observer(function VideoDetailScreen({ route }: VideoDetailsProps) {

  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { subCategories, visitedSubcategories } = useStores();
  const [response, setResponse] = useState<boolean>();
  const [isOnline, setIsOnline] = useState<boolean>();

  // states for manage video playing
  const [playing, setPlaying] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    if (isFocused) {
      // Load video and its details
      getSubCategoryData(route.params.categoryId, route.params.subCategoryId);
      BackHandler.addEventListener("hardwareBackPress", backAction);
    }

    // cleanup function for screen
    return function cleanup() {
      setResponse(false);
      setIsOnline(false);
      setPlaying(false);
      setVideoReady(false);
      subCategories.clearSubCategoryMedia();
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, [isFocused, route.params.subCategoryId]);

  // Api call and store data in mobx model
  const getSubCategoryData = async (parentId: number, subCategoryId: number) => {
    let res = await subCategories.getSubCategoryData(parentId);
    setIsOnline(res.response);
    setResponse(true);
    visitedSubcategories.setCurrentSubCategoryIndex(parentId);
    subCategories.getCurrentSubCategories(parentId);
    subCategories.getSubCategoryMedia(subCategoryId);
  }

  // Back on first screen for android
  const backAction = () => {
    navigation.navigate('subcategory', {
      parentId: route.params.categoryId,
    })
    return true;
  }

  // Parameters for video player
  const initialParams: InitialPlayerParams = {
    loop: false,
    controls: true,
    modestbranding: false,
    rel: false
  }

  // Render function for video details
  const renderMedia = ({ item, index }) => {
    if (!response) return null;
    visitedSubcategories.setSubCategoryVisited(item.id);
    return (
      <View key={index}>
        <HTML tagsStyles={{ ul: { ...UnorderedListText }, p: { ...ParagraphText }, h2: { ...TEXT } }}
          listsPrefixesRenderers={{
            ul: () => {
              return (
                <Text style={BulletStyle}>•</Text>
              );
            }
          }}
          html={item.description}
        />
      </View>
    )
  }

  // Render when media is null
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

  // Render Video
  const urlReg = /^(https?:\/\/)?((www\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-z-]+)/i;
  const RenderVideo = () => {
    if (!response) return null;
    return subCategories.subCategoryMedia.map((item, key) => {
      let videoId = item.url.match(urlReg)[7];
      return (
        <View key={key}>
          <YoutubePlayer
            height={200}
            initialPlayerParams={initialParams}
            play={playing}
            videoId={videoId}
            onReady={() => { setVideoReady(true) }}
          />
          {/* Show indicator while video loading */}
          {!videoReady && isOnline &&
            (
              <View style={VideoActivityLoader}>
                <Text text='Loading Video...' style={{ color: color.palette.golden }} />
                <CirclesRotationScaleLoader color={color.palette.golden} />
              </View>
            )
          }
          {!isOnline &&
            (
              <View style={[VideoActivityLoader, { borderWidth: 1, borderColor: color.palette.white }]}>
                <Text text='No Internet Connection..!!' style={{ color: color.palette.white }} />
              </View>
            )
          }
        </View>
      )
    })
  }

  return (
    <Screen style={ROOT} preset="fixed">
      <Header
        headerText={route.params.subCategoryName}
        rightIcon='hamburger'
        leftIcon='back'
        onLeftPress={() => navigation.navigate('subcategory', {
          parentId: route.params.categoryId,
        })}
      />
      <View style={CONTAINER}>
        {/* Nav Buttons */}
        <NavButton
          parentId={route.params.categoryId}
          subCategoryId={route.params.subCategoryId}
        />
        <View style={FILL}>
          <ActivityLoader />
          <View style={{ marginBottom: spacing[2] }}>
            {RenderVideo()}
          </View>
          <FlatList
            data={subCategories.subCategoryMedia}
            style={FlatListStyle}
            contentContainerStyle={FlatListContainer}
            keyExtractor={(index) => index.toString()}
            renderItem={renderMedia}
            ListEmptyComponent={EmptyMedia}
            overScrollMode='never'
          />
        </View>
      </View>
    </Screen >
  )
})
