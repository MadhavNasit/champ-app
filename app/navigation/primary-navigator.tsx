/**
 * This is primary Tab navigator which contain Dashboard and Profile Screens.
 */
import React from "react"

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen, ProfileScreen } from "../screens"
import { TabBar } from "../components/tab-bar/tab-bar";

export type PrimaryParamList = {
  dashboard: undefined,
  profile: undefined
}

const Tab = createBottomTabNavigator<PrimaryParamList>()

export function PrimaryNavigator() {
  return (
    <Tab.Navigator tabBar={props => <TabBar {...props} />}>
      <Tab.Screen name="dashboard" component={DashboardScreen} />
      <Tab.Screen name="profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

const exitRoutes = ["dashboard"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
