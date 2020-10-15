import React, { useCallback, useEffect, useState } from "react"
import { Alert, FlatList, Route, View, ViewStyle } from "react-native"
import { useIsFocused } from "@react-navigation/native"

import { observer } from "mobx-react-lite"
import { useStores } from "../../models"

import { Header, NavButton, Screen, Text } from "../../components"
import { spacing } from "../../theme"

import HTML from 'react-native-render-html';
import YoutubePlayer, { InitialPlayerParams } from "react-native-youtube-iframe";

interface VideoDetailsProps {
  route
}

const ROOT: ViewStyle = {
  flex: 1,
}
const CONTAINER: ViewStyle = {
  flex: 1,
}

export const VideoDetailScreen = observer(function VideoDetailScreen({ route }: VideoDetailsProps) {

  const isFocused = useIsFocused();
  const { subCategories } = useStores();

  const [playing, setPlaying] = useState(false);
  const onStateChange = useCallback((state) => {
    if (state === "unstarted") {
      Alert.alert("video has ready for playing!");
    }
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("video has finished playing!");
    }
  }, []);


  useEffect(() => {
    if (isFocused) {
      getSubCategoryData(route.params.categoryId, route.params.subCategoryId);
    }

    return function cleanup() {
      subCategories.clearSubCategoryMedia();
    };
  }, [route.params.subCategoryId]);

  const getSubCategoryData = async (parentId: number, subCategoryId: number) => {
    await subCategories.getSubCategoryData(parentId);
    await subCategories.setCurrentSubCategoryIndex(parentId);
    await subCategories.getCurrentSubCategories(parentId);
    await subCategories.getSubCategoryMedia(subCategoryId);
    await subCategories.setSubCategoryVisited(parentId, subCategoryId);
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
    return (
      <View key={index}>
        <YoutubePlayer
          height={200}
          initialPlayerParams={initialParams}
          play={playing}
          videoId={videoId}
          onChangeState={onStateChange}
          onReady={() => { Alert.alert('Loaded') }}
        />
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
          style={{ paddingBottom: 25, marginBottom: 15, paddingHorizontal: spacing[6], }}
          keyExtractor={(index) => index.toString()}
          renderItem={renderMedia}
        />
      </View>
    </Screen >
  )
})
