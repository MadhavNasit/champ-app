/**
 * Dashboard screen which contains list of categories
 */

import React, { useEffect, useState } from "react";
import { TextStyle, TouchableOpacity, View, FlatList, ViewStyle, BackHandler, Alert, ImageStyle } from "react-native";

import { observer } from "mobx-react-lite";
import { useIsFocused, useNavigation } from "@react-navigation/native";

// Components and Screen imports
import { Header, Icon, Screen, Text } from "../../components";
import { color, fontSize, horizantalSpacing, spacing, typography, verticalSpacing } from "../../theme";
import { useStores } from "../../models";
import { ActivityLoader } from "../../components/activity-loader/activity-loader";

import {
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"
import { useNetInfo } from "@react-native-community/netinfo";

// Screen Styles
const ROOT: ViewStyle = {
  flex: 1,
}

//Content View Styles
const CONTAINER: ViewStyle = {
  flex: 1,
  paddingHorizontal: horizantalSpacing[7]
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
  marginVertical: verticalSpacing[2],
  paddingVertical: verticalSpacing[4]
}
const CategoryText: TextStyle = {
  fontFamily: typography.regular,
  color: color.palette.white,
  letterSpacing: spacing[1]
}
// Error View
const ErrorView: ViewStyle = {
  alignItems: 'center',
  paddingBottom: hp('4.5%'),
}
const ErrorIcon: ImageStyle = {
  height: hp('4%'),
  tintColor: color.palette.white
}
const ErrorText: TextStyle = {
  textAlign: 'center',
  fontSize: fontSize.FONT_18Px,
  fontFamily: typography.semiBold,
}

export const DashboardScreen = observer(function DashboardScreen() {
  // contains navigation props and method
  const navigation = useNavigation();
  // return network status of device
  const netInfo = useNetInfo();
  // Category data mobx store
  const { categoryData, visitedSubcategories } = useStores();
  // return true if screen is focused
  const isFocused = useIsFocused()

  const [response, setResponse] = useState<boolean>(false);

  // Call api function if screen is focused
  useEffect(() => {
    if (isFocused) {
      LoadDataFromApi();
      visitedSubcategories.setCurrentSubCategoryIndex(0);
      BackHandler.addEventListener("hardwareBackPress", backAction)
    }

    return function cleanup() {
      setResponse(false);
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    }
  }, [isFocused, netInfo.isConnected]);


  // Call APi and store in model
  const LoadDataFromApi = async () => {
    await categoryData.getCategoryData();
    setResponse(true);
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
    return true;
  }


  // Render function for Categories
  const RenderCategories = ({ item, index }) => {
    if (!response) return null;
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

  const EmptyCategories = () => {
    if (!response) return null;
    return (
      <View style={ErrorView}>
        <Icon icon='notFound' style={ErrorIcon} />
        <Text text="Something went Wrong..!!" style={ErrorText} />
      </View>
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
        {/* {response && */}
        <FlatList
          data={categoryData.mainCategoryData}
          contentContainerStyle={FlatListview}
          renderItem={RenderCategories}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={EmptyCategories}
        />
        {/* } */}
      </View>
    </Screen>
  )
})
