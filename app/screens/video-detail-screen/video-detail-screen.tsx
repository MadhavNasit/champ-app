import React, { useCallback, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, FlatList, View, ViewStyle } from "react-native"
import HTML from 'react-native-render-html';
import { Header, NavButton, Screen, Text } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { spacing } from "../../theme"
import { useIsFocused } from "@react-navigation/native"
import { useStores } from "../../models"

import YoutubePlayer, { InitialPlayerParams } from "react-native-youtube-iframe";

const ROOT: ViewStyle = {
  flex: 1,
}

const CONTAINER: ViewStyle = {
  flex: 1,

}

const BackgroundVideo: ViewStyle = {
  height: 200,
  width: 200
}

export const VideoDetailScreen = observer(function VideoDetailScreen({ route }) {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  // OR
  // const rootStore = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()

  const isFocused = useIsFocused();
  const { apiData, subCategories } = useStores();
  const player = useRef()

  const [playing, setPlaying] = useState(false);
  const onStateChange = useCallback((state) => {
    // if(state == "unstarted"){

    // }
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
    await apiData.setSubCategoryIndex(parentId);
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
