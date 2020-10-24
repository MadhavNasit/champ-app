/**
 * Display list of sub categories
 */

import React, { useEffect, useState } from "react"
import { TextStyle, View, ViewStyle, FlatList, TouchableOpacity, ImageStyle, BackHandler } from "react-native"

import { observer } from "mobx-react-lite"
import { useIsFocused, useNavigation } from "@react-navigation/native"

// node modules import
import FastImage from 'react-native-fast-image'

// Component and theme import
import { ActivityLoader, Header, Icon, Screen, Text } from "../../components"
import { color, spacing, typography } from "../../theme"
import { useStores } from "../../models"

interface SubCategoryProps {
  route,
  navigation
}

// main container style
const ROOT: ViewStyle = {
  flex: 1,
}
const CONTAINER: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing[6]
}

// sub category view
const FlatListview: ViewStyle = {
  flexGrow: 1,
  justifyContent: 'center',
}
const CategoryButton: ViewStyle = {
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
  fontFamily: typography.regular,
  fontSize: 18,
  letterSpacing: 1,
  textTransform: 'capitalize',
  paddingLeft: spacing[3]
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
  fontFamily: typography.semiBold,
}

export const SubCategoryScreen = observer(function SubCategoryScreen({ route }: SubCategoryProps) {

  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { categoryData, subCategories, visitedSubcategories } = useStores();
  const [categoryName, setCategoryName] = useState('');
  const [response, setResponse] = useState<boolean>();

  useEffect(() => {
    if (isFocused) {
      LoadStoreData(route.params.parentId);
      GetCategoryName(route.params.parentId);
      BackHandler.addEventListener("hardwareBackPress", backAction);
    }

    return function cleanup() {
      setResponse(false);
      subCategories.clearCurrentSubCategory();
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, [isFocused, route.params.parentId]);

  // load data from api
  const LoadStoreData = async (parentId: number) => {
    await subCategories.getSubCategoryData(parentId);
    setResponse(true);
    await subCategories.getCurrentSubCategories(parentId);
    await visitedSubcategories.setCurrentSubCategoryIndex(parentId);
  }

  // Back on first screen for android
  const backAction = () => {
    navigation.navigate('dashboard')
    return true;
  }

  const GetCategoryName = (parentId: number) => {
    let index = categoryData.mainCategoryData.findIndex(x => x.id == parentId);
    setCategoryName(categoryData.mainCategoryData[index].name);
  }

  const EmptySubCategories = () => {
    if (!response) return null;
    return (
      <View style={ErrorView}>
        <Icon icon='notFound' style={ErrorIcon} />
        <Text text="Something went Wrong..!!" style={ErrorText} />
      </View>
    )
  }

  const RenderSubCategory = ({ item, index }) => {
    if (!response) return null;
    return (
      <TouchableOpacity
        style={CategoryButton}
        key={index}
        onPress={() => navigation.navigate(item.type == 'Image' ? 'imagedetail' : 'videodetail', {
          categoryId: item.parent_id,
          subCategoryId: item.id,
          subCategoryName: item.name,
          mediaType: item.type,
        })}>
        <View style={SubCategoryButton}>
          <FastImage source={{ uri: item.icon, priority: FastImage.priority.normal, }} style={IconStyle} resizeMode={FastImage.resizeMode.contain} />
          <Text style={CategoryText} text={item.name} />
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <Screen style={ROOT} preset="fixed">
      <Header
        headerText={categoryName}
        rightIcon='hamburger'
        leftIcon='back'
        onLeftPress={() => navigation.navigate('dashboard')}
      />
      <ActivityLoader />
      <View style={CONTAINER}>
        <FlatList
          data={subCategories.currentSubCategories}
          contentContainerStyle={FlatListview}
          renderItem={RenderSubCategory}
          ListEmptyComponent={EmptySubCategories}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </Screen>
  )
})
