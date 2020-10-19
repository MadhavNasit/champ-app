import React, { useEffect } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle, FlatList, TouchableOpacity } from "react-native"

import { observer } from "mobx-react-lite"
import { useNavigation, useIsFocused } from "@react-navigation/native"
import FastImage from 'react-native-fast-image'

import { Header, Screen, Text } from "../../components"
import { color, spacing } from "../../theme"
import { useStores } from "../../models"

interface SubCategoryProps {
  route,
  navigation
}

const ROOT: ViewStyle = {
  flex: 1,
}
const CONTAINER: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing[6]
}
const FlatListview: ViewStyle = {
  flexGrow: 1,
  justifyContent: 'center',
}
const CategoryButton: ViewStyle = {
  // borderColor: color.palette.white,
  // borderWidth: 1,
  // alignItems: 'center',
  marginVertical: spacing[2],
  paddingVertical: spacing[4]
}
const SubCategoryButton: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center'
}
const IconStyle = {
  height: 60,
  width: 60,
  borderColor: color.palette.golden,
  borderWidth: 2,
  borderRadius: 60
}
const CategoryText: TextStyle = {
  color: color.palette.white,
  fontSize: 18,
  letterSpacing: 1,
  textTransform: 'capitalize',
  paddingLeft: spacing[3]
}

export const SubCategoryScreen = observer(function SubCategoryScreen({ route, navigation }: SubCategoryProps) {

  const isFocused = useIsFocused()
  const { subCategories, activityLoader, visitedSubcategories } = useStores();

  useEffect(() => {
    if (isFocused) {
      LoadStoreData(route.params.parentId);
      activityLoader.setLoading(false);
    }

    return function cleanup() {
      activityLoader.setLoading(true);
      subCategories.clearCurrentSubCategory();
    };
  }, [route.params.parentId]);

  const LoadStoreData = async (parentId: number) => {
    await subCategories.getSubCategoryData(parentId);
    await subCategories.getCurrentSubCategories(parentId);
    await visitedSubcategories.setCurrentSubCategoryIndex(parentId);
  }

  return (
    <Screen style={ROOT} preset="fixed">
      <Header
        headerText={route.params.categoryName}
        rightIcon='hamburger'
        leftIcon='back'
      />
      <View style={CONTAINER}>
        <FlatList
          data={subCategories.currentSubCategories}
          contentContainerStyle={FlatListview}
          renderItem={({ item, index }: any) => {
            return (
              <TouchableOpacity
                style={CategoryButton}
                key={index}
                onPress={() => navigation.navigate(item.type == 'Image' ? 'imagedetail' : 'videodetail', {
                  categoryId: item.parent_id,
                  subCategoryId: item.id,
                  subCategoryName: item.name
                })}>
                <View style={SubCategoryButton}>
                  <FastImage source={{ uri: item.icon, priority: FastImage.priority.normal, }} style={IconStyle} resizeMode={FastImage.resizeMode.contain} />
                  <Text style={CategoryText} text={item.name} />
                </View>
              </TouchableOpacity>
            )
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </Screen>
  )
})
