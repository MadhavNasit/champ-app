/**
 * The root navigator is used to switch between major navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow (which is contained in your PrimaryNavigator) which the user
 * will use once logged in.
 */
import React from "react"
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"

import { createNativeStackNavigator } from "react-native-screens/native-stack"
import { observer } from "mobx-react-lite"
import { useStores } from "../models"
import { AuthNavigator } from "./auth-navigator"
import { DrawerNavigator } from "./drawer-navigator"


export type RootParamList = {
  primaryStack: undefined,
  authStack: undefined
}

const Stack = createNativeStackNavigator<RootParamList>()

// Root navigator which checks for is user is loggedin or not
const RootStack = observer(() => {
  const { userAuth } = useStores();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,

        stackPresentation: "modal",
      }}
    >
      {userAuth.isTokenAvaible ?
        (
          <Stack.Screen
            name="primaryStack"
            component={DrawerNavigator}
            options={{
              headerShown: false,
            }}
          />
        )
        :
        (
          <Stack.Screen
            name="authStack"
            component={AuthNavigator}
            options={{
              headerShown: false,
            }}
          />
        )
      }
    </Stack.Navigator>
  )
})

export const RootNavigator = React.forwardRef<
  NavigationContainerRef,
  Partial<React.ComponentProps<typeof NavigationContainer>>
>((props, ref) => {
  return (
    <NavigationContainer {...props} ref={ref}>
      <RootStack />
    </NavigationContainer>
  )
})

RootNavigator.displayName = "RootNavigator"
