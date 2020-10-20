import * as React from "react"
import { Alert, TextStyle, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Text } from "../"
import { useStores } from "../../models"
import { GoogleSignin } from "@react-native-community/google-signin"
import { TouchableOpacity } from "react-native-gesture-handler"


export interface LogoutProps {
  /**
   * An optional style override useful for padding & margin.
   */
  buttonStyle?: ViewStyle,
  textStyle?: TextStyle
}

/**
 * Describe your component here
 */
export const Logout = observer(function Logout(props: LogoutProps) {
  const { buttonStyle, textStyle } = props

  const { userAuth } = useStores();

  const LogOut = async () => {
    userAuth.removeAccess();
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      } catch (error) {
        Alert.alert("Something went wrong..!!")
      }
    }
  }

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={() => LogOut()}
    >
      <Text text='LOGOUT' style={textStyle} />
    </TouchableOpacity>
  )
})
