import React, { useCallback, useEffect, useState } from "react"
import { Alert, FlatList, View, ViewStyle } from "react-native"
import { useIsFocused } from "@react-navigation/native"

import { observer } from "mobx-react-lite"
import { useStores } from "../../models"

import { Header, NavButton, Screen, Text } from "../../components"
import { color, spacing } from "../../theme"

import HTML from 'react-native-render-html';
import YoutubePlayer, { InitialPlayerParams } from "react-native-youtube-iframe";
import { LinesLoader } from 'react-native-indicator';

interface VideoDetailsProps {
  route
}

const ROOT: ViewStyle = {
  flex: 1,
}
const CONTAINER: ViewStyle = {
  flex: 1,
}
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
  const { subCategories, activityLoader, visitedSubcategories } = useStores();

  const [playing, setPlaying] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("video has finished playing!");
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      activityLoader.setLoading(true);
      getSubCategoryData(route.params.categoryId, route.params.subCategoryId);
      activityLoader.setLoading(false);
    }

    return function cleanup() {
      subCategories.clearSubCategoryMedia();
    };
  }, [route.params.subCategoryId]);

  const getSubCategoryData = async (parentId: number, subCategoryId: number) => {
    await subCategories.getSubCategoryData(parentId);
    await visitedSubcategories.setCurrentSubCategoryIndex(parentId);
    await subCategories.getCurrentSubCategories(parentId);
    await subCategories.getSubCategoryMedia(subCategoryId);
  }

  const initialParams: InitialPlayerParams = {
    loop: false,
    controls: true,
    modestbranding: false,
    rel: false
  }

  const urlReg = /^(https?:\/\/)?((www\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-z-]+)/i;
  const renderMedia = ({ item, index }) => {
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
                <LinesLoader color={color.palette.golden} />
              </View>
            )
          }

        </View>
        <HTML tagsStyles={{ ul: { color: 'white', fontSize: 16 }, p: { color: 'white', fontSize: 16 }, h2: { color: 'white' } }}
          listsPrefixesRenderers={{
            ul: (htmlAttribs, children, convertedCSSStyles, passProps) => {
              return (
                <Text style={{ color: 'white', fontSize: 16, marginRight: 5 }}>•</Text>
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
        <FlatList
          data={subCategories.subCategoryMedia}
          style={{ flexGrow: 1, paddingBottom: 25, marginBottom: 15, paddingHorizontal: spacing[6] }}
          keyExtractor={(index) => index.toString()}
          renderItem={renderMedia}
          ListEmptyComponent={() => {
            return (
              <View style={{ flex: 1, alignItems: 'center', marginTop: '50%' }}>
                <Text style={{ fontSize: 18 }} text='No Data Found..!!' />
              </View>
            )
          }}
        />
      </View>
    </Screen >
  )
})
