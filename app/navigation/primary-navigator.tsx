/**
 * This is primary Tab navigator which contain Dashboard and Profile Screens.
 */
import React from "react"
import { createNativeStackNavigator } from "react-native-screens/native-stack"

import { DashboardScreen } from "../screens"
import { SubCategoryScreen } from "../screens/sub-category-screen/sub-category-screen";
import { ImageDetailScreen } from "../screens/image-detail-screen/image-detail-screen";
import { VideoDetailScreen } from "../screens/video-detail-screen/video-detail-screen";

export type PrimaryParamList = {
  dashboard: undefined,
  subcategory: undefined,
  imagedetail: undefined,
  videodetail: undefined
}

const Stack = createNativeStackNavigator<PrimaryParamList>()
export function PrimaryNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} >
      <Stack.Screen name="dashboard" component={DashboardScreen} />
      <Stack.Screen name="subcategory" component={SubCategoryScreen} />
      <Stack.Screen name="imagedetail" component={ImageDetailScreen} />
      <Stack.Screen name="videodetail" component={VideoDetailScreen} />
    </Stack.Navigator>
  )
}




const exitRoutes = ["dashboard"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
