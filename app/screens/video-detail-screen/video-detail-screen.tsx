/**
 * Video details screen display video and its details 
 */

import React, { useCallback, useEffect, useState } from "react"
import { Alert, FlatList, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { useIsFocused, useNavigation } from "@react-navigation/native"

import { observer } from "mobx-react-lite"
import { useStores } from "../../models"

// Component and theme import
import { ActivityLoader, Header, Icon, NavButton, Screen, Text } from "../../components"
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
  fontWeight: 'bold'
}

export const VideoDetailScreen = observer(function VideoDetailScreen({ route }: VideoDetailsProps) {

  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { subCategories, visitedSubcategories } = useStores();
  const [response, setResponse] = useState<boolean>();

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
      setResponse(false);
      subCategories.clearSubCategoryMedia();
    };
  }, [isFocused, route.params.subCategoryId]);

  // Api call and store data in mobx model
  const getSubCategoryData = async (parentId: number, subCategoryId: number) => {
    await subCategories.getSubCategoryData(parentId);
    setResponse(true);
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
    if (!response) return null;
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
          <FlatList
            data={subCategories.subCategoryMedia}
            style={FlatListStyle}
            contentContainerStyle={FlatListContainer}
            keyExtractor={(index) => index.toString()}
            renderItem={renderMedia}
            ListEmptyComponent={EmptyMedia}
          />
        </View>
      </View>
    </Screen >
  )
})
