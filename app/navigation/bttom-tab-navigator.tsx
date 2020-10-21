/**
* Bottom tab for dashboard and my profile
*/
import React from "react"

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabBar } from "../components/tab-bar/tab-bar";
import { ProfileScreen } from '../screens';
import { PrimaryNavigator } from './primary-navigator';

export type TabParamList = {
  Dashboard: undefined,
  'My Profile': undefined,
}

const Tab = createBottomTabNavigator<TabParamList>()
export function TabNavigator() {
  return (
    <Tab.Navigator tabBar={props => <TabBar {...props} />}>
      <Tab.Screen name="Dashboard" component={PrimaryNavigator} />
      <Tab.Screen name="My Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}