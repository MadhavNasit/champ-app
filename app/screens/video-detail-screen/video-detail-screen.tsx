/**
 * Video details screen display video and its details 
 */

import React, { useCallback, useEffect, useState } from "react"
import { Alert, FlatList, TextStyle, View, ViewStyle } from "react-native"
import { useIsFocused } from "@react-navigation/native"

import { observer } from "mobx-react-lite"
import { useStores } from "../../models"

// Component and theme import
import { ActivityLoader, Header, NavButton, Screen, Text } from "../../components"
import { color, spacing } from "../../theme"

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
}

// Text style 
const TEXT: TextStyle = {
  color: color.palette.white
}

// Empty view for mediaType == None
const EmptyDataView: ViewStyle = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '10%'
}
const EmptyDataText: TextStyle = {
  ...TEXT,
  fontSize: 18,
  fontWeight: 'bold'
}

// FlatList View Style for main content
const FlatListContainer: ViewStyle = {
  flexGrow: 1,
}
const FlatListStyle: ViewStyle = {
  paddingBottom: 25,
  marginBottom: 15,
  paddingHorizontal: spacing[6]
}
const UnorderedListText: TextStyle = {
  ...TEXT,
  fontSize: 16
}
const ParagraphText: TextStyle = {
  ...UnorderedListText
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

export const VideoDetailScreen = observer(function VideoDetailScreen({ route }: VideoDetailsProps) {

  const isFocused = useIsFocused();
  const { subCategories, visitedSubcategories } = useStores();

  // states for manage video playing
  const [playing, setPlaying] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    if (isFocused) {
      // Load video and its details
      getSubCategoryData(route.params.categoryId, route.params.subCategoryId);
    }

    // cleanup function for screen
    return function cleanup() {
      subCategories.clearSubCategoryMedia();
    };
  }, [isFocused, route.params.subCategoryId]);

  // Api call and store data in mobx model
  const getSubCategoryData = (parentId: number, subCategoryId: number) => {
    subCategories.getSubCategoryData(parentId);
    visitedSubcategories.setCurrentSubCategoryIndex(parentId);
    subCategories.getCurrentSubCategories(parentId);
    subCategories.getSubCategoryMedia(subCategoryId);
  }

  // Alert on video playing end
  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("video has finished playing!");
    }
  }, []);

  // Parameters for video player
  const initialParams: InitialPlayerParams = {
    loop: false,
    controls: true,
    modestbranding: false,
    rel: false
  }

  // Render function for video details
  const urlReg = /^(https?:\/\/)?((www\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-z-]+)/i;
  const renderMedia = ({ item, index }) => {
    // retrive youtube video id from Youtube URL 
    let videoId = item.url.match(urlReg)[7];
    visitedSubcategories.setSubCategoryVisited(item.id);
    return (
      <View key={index}>
        <View>
          <YoutubePlayer
            height={200}
            initialPlayerParams={initialParams}
            play={playing}
            videoId={videoId}
            onChangeState={onStateChange}
            onReady={() => { setVideoReady(true) }}
          />
          {/* Show indicator while video loading */}
          {!videoReady &&
            (
              <View style={VideoActivityLoader}>
                <Text text='Loading Video...' style={{ color: color.palette.golden }} />
                <CirclesRotationScaleLoader color={color.palette.golden} />
              </View>
            )
          }
        </View>
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

  return (
    <Screen style={ROOT} preset="fixed">
      <Header
        headerText={route.params.subCategoryName}
        rightIcon='hamburger'
        leftIcon='back'
      />
      <View style={CONTAINER}>
        {/* Nav Buttons */}
        <NavButton
          parentId={route.params.categoryId}
          subCategoryId={route.params.subCategoryId}
        />
        <View style={FILL}>
          <ActivityLoader />
          {route.params.mediaType == 'None' ? (
            <View style={EmptyDataView}>
              <Text style={EmptyDataText} text='No Data Found..!!' />
            </View>
          ) : (
              <View>
                <FlatList
                  data={subCategories.subCategoryMedia}
                  style={FlatListStyle}
                  contentContainerStyle={FlatListContainer}
                  keyExtractor={(index) => index.toString()}
                  renderItem={renderMedia}
                />
              </View>
            )}
        </View>
      </View>
    </Screen >
  )
})
