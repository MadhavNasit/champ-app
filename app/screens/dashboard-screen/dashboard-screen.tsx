/**
 * Dashboard screen which contains list of categories
 */

import React, { useEffect } from "react";
import { TextStyle, TouchableOpacity, View, FlatList, ViewStyle, BackHandler, Alert } from "react-native";

import { observer } from "mobx-react-lite";
import { useIsFocused, useNavigation } from "@react-navigation/native";

// Components and Screen imports
import { Header, Screen, Text } from "../../components";
import { color, spacing } from "../../theme";
import { useStores } from "../../models";
import { ActivityLoader } from "../../components/activity-loader/activity-loader";

// Screen Styles
const ROOT: ViewStyle = {
  flex: 1,
}

//Content View Styles
const CONTAINER: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing[6]
}

// Category data render Styles
const FlatListview: ViewStyle = {
  flexGrow: 1,
  justifyContent: 'center',
  width: '100%',
}
const CategoryButton: ViewStyle = {
  borderColor: color.palette.white,
  borderWidth: 1,
  alignItems: 'center',
  marginVertical: spacing[2],
  paddingVertical: spacing[4]
}
const CategoryText: TextStyle = {
  color: color.palette.white,
  letterSpacing: spacing[1]
}

export const DashboardScreen = observer(function DashboardScreen() {
  // contains navigation props and method
  const navigation = useNavigation();
  // Category data mobx store
  const { categoryData, visitedSubcategories } = useStores();
  // return true if screen is focused
  const isFocused = useIsFocused()

  // Call api function if screen is focused
  useEffect(() => {
    if (isFocused) {
      LoadDataFromApi();
      visitedSubcategories.setCurrentSubCategoryIndex(0);
    }
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)

    return () => backHandler.remove()
  }, [isFocused]);

  // Call APi and store in model
  const LoadDataFromApi = async () => {
    await categoryData.getCategoryData();
  }

  // Back on first screen for android
  const backAction = () => {
    Alert.alert("Hold on!", "Are you sure you want to exit?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      { text: "YES", onPress: () => BackHandler.exitApp() },
    ])
    return true
  }


  // Render function for Categories
  const RenderCategories = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={CategoryButton}
        key={index}
        onPress={() => navigation.navigate('subcategory', {
          parentId: item.id,
        })}>
        <Text style={CategoryText} text={item.name} />
      </TouchableOpacity>
    )
  }

  return (
    <Screen style={ROOT} preset="fixed">
      <ActivityLoader />
      {/* Header Component */}
      <Header
        headerText='Dashboard'
        rightIcon='hamburger'
      />
      {/* Return Categories View */}
      <View style={CONTAINER}>
        <FlatList
          data={categoryData.mainCategoryData}
          contentContainerStyle={FlatListview}
          renderItem={RenderCategories}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </Screen>
  )
})
