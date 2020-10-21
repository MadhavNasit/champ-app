/**
 * this navigator used if user is not logged in
 */
import React from "react"

import { createNativeStackNavigator } from "react-native-screens/native-stack"
import { SigninScreen } from "../screens"

export type PrimaryParamList = {
  signin: undefined
}

const Stack = createNativeStackNavigator<PrimaryParamList>()

export function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
      initialRouteName="signin"
    >
      <Stack.Screen name="signin" component={SigninScreen} />
    </Stack.Navigator>
  )
}

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 *
 * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
 */
const exitRoutes = ["signin"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
