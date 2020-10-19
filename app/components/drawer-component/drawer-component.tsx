import * as React from "react"
import { ImageStyle, SafeAreaView, TextStyle, View, ViewStyle } from "react-native"

import { DrawerItem } from "@react-navigation/drawer"

import { observer } from "mobx-react-lite"
import { useStores } from "../../models"

import { color, spacing } from "../../theme"
import { Text } from "../"
import { Icon } from "../icon/icon"
import { Logout } from "../logout/logout"

// Styles for Drawer Screen
const TEXT: TextStyle = {
  color: color.palette.white
}
const SafeAreaViewStyle: ViewStyle = {
  flex: 1,
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
const LogOutButton: ViewStyle = {
  paddingLeft: spacing[4],
  marginBottom: spacing[2]
}

// Props
export interface DrawerComponentProps {
  navigation
}

/**
 * Describe your component here
 */
export const DrawerComponent = observer(function DrawerComponent({ navigation }: DrawerComponentProps) {
  const { categoryData, visitedSubcategories } = useStores();

  return (
    <SafeAreaView style={SafeAreaViewStyle} >
      <View style={MainView}>
        <View style={UpperView}>
          {/* Brand Name and Logo */}
          <View style={BrandDetails}>
            <Icon icon='logo' style={LogoStyle} />
            <Text text='BOXING' style={BrandName} />
            <Text text='By Tatvasoft' style={OrganizationName} />
          </View>
          {/* Drawer Items for navigation */}
          <View>
            <DrawerItem
              label="DASHBOARD"
              onPress={() => navigation.navigate('dashboard')}
              activeTintColor={color.palette.golden}
              inactiveTintColor={color.palette.white}
              labelStyle={DrawerItemLabel}
              focused={visitedSubcategories.currentSubCategoryIndex == 0 ? true : false}
              activeBackgroundColor={color.transparent}
            />
            {categoryData.mainCategoryData.map((item, key) => (
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
                focused={visitedSubcategories.currentSubCategoryIndex == item.id ? true : false}
                activeBackgroundColor={color.transparent}
              />
            ))}
          </View>
        </View>
        {/* Logout Button */}
        <View style={UpperView}>
          <Logout
            buttonStyle={LogOutButton}
            textStyle={{ ...TEXT, ...DrawerItemLabel }}
          />
        </View>
      </View>
    </SafeAreaView>
  )
})
