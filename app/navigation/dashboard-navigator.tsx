/**
 * This is primary Tab navigator which contain Dashboard and Profile Screens.
 */
import React from "react"

import { createDrawerNavigator, DrawerItem } from '@react-navigation/drawer';
import { ColorPropType, ImageStyle, SafeAreaView, TextStyle, View, ViewStyle } from "react-native";
import { TabNavigator } from "./bttom-tab-navigator";
import { Icon, Text } from "../components";
import { color, spacing } from "../theme";
import { FlatList } from "react-native-gesture-handler";
import { useStores } from "../models";
import { observer } from "mobx-react-lite";
import { useNavigation, useRoute } from "@react-navigation/native";

export type PrimaryParamList = {
  tab: undefined,
}

const Drawer = createDrawerNavigator<PrimaryParamList>()
const DRAWERVIEW: ViewStyle = {
  backgroundColor: 'black',
  width: "70%",
  height: '100%',
}
const TEXT: TextStyle = {
  color: color.palette.white
}
const SafeAreaViewStyle: ViewStyle = {
  flex: 1,
  // padding: spacing[6]
}
const MainView: ViewStyle = {
  flex: 1,
  justifyContent: 'space-between',
}
const UpperView: ViewStyle = {
  paddingVertical: spacing[2],
  paddingLeft: spacing[4]
}
const BrandDetails: ViewStyle = {
  padding: spacing[4],
  marginBottom: spacing[4]
}
const LogoStyle: ImageStyle = {
  height: 36,
  width: 36
}
const BrandName: TextStyle = {
  ...TEXT,
  fontSize: 23.,
  fontWeight: 'bold'
}
const OrganizationName: TextStyle = {
  ...TEXT,
  fontSize: 5,
  letterSpacing: 3
}
const DrawerItemLabel: TextStyle = {
  fontSize: 20,
  fontWeight: 'bold'
}

const CustomDrawerContent = observer(() => {
  const { userAuth, apiData } = useStores();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={SafeAreaViewStyle} >
      <View style={MainView}>
        <View style={UpperView}>
          <View style={BrandDetails}>
            <Icon icon='logo' style={LogoStyle} />
            <Text text='BOXING' style={BrandName} />
            <Text text='By Tatvasoft' style={OrganizationName} />
          </View>
          <View>
            <DrawerItem
              label="DASHBOARD"
              onPress={() => navigation.navigate('dashboard')}
              activeTintColor={color.palette.golden}
              inactiveTintColor={color.palette.white}
              labelStyle={DrawerItemLabel}
              focused={apiData.subCategoriesIndex == 0 ? true : false}
              activeBackgroundColor={color.transparent}
            />
            {apiData.mainCategory.map((item, key) => (
              <DrawerItem
                key={key}
                label={item.name}
                onPress={() => navigation.navigate('subcategory', {
                  parentId: item.id,
                  categoryName: item.name
                })}
                activeTintColor={color.palette.golden}
                inactiveTintColor={color.palette.white}
                labelStyle={DrawerItemLabel}
                focused={apiData.subCategoriesIndex == item.id ? true : false}
                activeBackgroundColor={color.transparent}
              />
            ))}
            {/* <FlatList
              data={apiData.mainCategory}
              renderItem={({ item, index }: any) => {
                console.tron.log('id Drawer', item.id, item.name)
                return (
                  <DrawerItem
                    label={item.name}
                    onPress={() => navigation.navigate('subcategory', {
                      parentId: item.id,
                      categoryName: item.name
                    })}
                    activeTintColor={color.palette.golden}
                    inactiveTintColor={color.palette.white}
                    labelStyle={DrawerItemLabel}
                    focused={apiData.subCategoriesIndex == item.id ? true : false}
                    activeBackgroundColor={color.transparent}
                  />
                )
              }}
              keyExtractor={(item, index) => index.toString()}
            /> */}
          </View>
        </View>
        <View style={UpperView}>
          <DrawerItem
            label="LOGOUT"
            onPress={() => userAuth.removeTokenAvaible()}
            labelStyle={{ ...TEXT, ...DrawerItemLabel }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
})

export function DashBoardNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="tab"
      backBehavior="initialRoute"
      drawerPosition="right"
      overlayColor="transparent"
      hideStatusBar={true}
      drawerType="slide"
      drawerStyle={DRAWERVIEW}
      drawerContent={(props) => <CustomDrawerContent {...props} />}

    >
      <Drawer.Screen name="tab" component={TabNavigator} />
    </Drawer.Navigator>
  )
}
