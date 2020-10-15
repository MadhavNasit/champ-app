/**
 * This is Drawer navigator which contain Tab navigator Screens.
 */
import React from "react"
import { ViewStyle } from "react-native";

import { createDrawerNavigator } from '@react-navigation/drawer';

import { TabNavigator } from "./bttom-tab-navigator";
import { DrawerComponent } from "../components";

export type PrimaryParamList = {
  tab: undefined,
}

const Drawer = createDrawerNavigator<PrimaryParamList>()

const DRAWERVIEW: ViewStyle = {
  backgroundColor: 'black',
  width: "70%",
  height: '100%',
}

export function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="tab"
      backBehavior="initialRoute"
      drawerPosition="right"
      overlayColor="transparent"
      hideStatusBar={true}
      drawerType="slide"
      drawerStyle={DRAWERVIEW}
      drawerContent={(props) => <DrawerComponent {...props} />}

    >
      <Drawer.Screen name="tab" component={TabNavigator} />
    </Drawer.Navigator>
  )
}
