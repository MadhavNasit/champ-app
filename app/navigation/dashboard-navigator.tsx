/**
 * This is primary Tab navigator which contain Dashboard and Profile Screens.
 */
import React from "react"

import { createDrawerNavigator } from '@react-navigation/drawer';
import { DashboardScreen } from "../screens";
import { ViewStyle } from "react-native";
import { TabNavigator } from "./bttom-tab-navigator";

export type PrimaryParamList = {
  tab: undefined,
}

const Drawer = createDrawerNavigator<PrimaryParamList>()
const DRAWERVIEW: ViewStyle = {
  backgroundColor: 'black',
  width: "70%",
  height: '100%',
}
export function DashBoardNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="tab"
      backBehavior="initialRoute"
      drawerPosition="right"
      overlayColor="transparent"
      drawerType="slide"
      drawerStyle={DRAWERVIEW}
    >
      <Drawer.Screen name="tab" component={TabNavigator} />
    </Drawer.Navigator>
  )
}
