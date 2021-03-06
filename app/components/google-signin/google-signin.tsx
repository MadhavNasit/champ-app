import React, { useEffect } from "react"
import { Alert, TextStyle, ViewStyle } from "react-native"
import { Button } from "../button/button"
import { useStores } from "../../models";

// Google and Facebook Signin imports
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';

export interface GoogleSigninProps {
  ButtonStyle?: ViewStyle,
  TextStyle?: TextStyle
}

/**
 * Describe your component here
 */
export function GoogleSignIn(props: GoogleSigninProps) {
  const { ButtonStyle, TextStyle } = props

  const { userAuth, activityLoader } = useStores()

  useEffect(() => {
    GoogleConfigure();
  }, []);

  const GoogleConfigure = async () => {
    GoogleSignin.configure({
      webClientId: '268623996927-58msmim502qhmj4cp3hbmu1cb3jbuvlo.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }

  // Sign Function for Google Signin
  const GoogleSignIn = async () => {
    activityLoader.setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      let userObj = {
        userName: userInfo.user.name,
        profileUrl: userInfo.user.photo,
        userEmail: userInfo.user.email
      }
      activityLoader.setLoading(false);
      await userAuth.userAuthenticate(userObj);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        activityLoader.setLoading(false);
        Alert.alert("user cancelled the login flow");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        activityLoader.setLoading(false);
        Alert.alert("operation (e.g. sign in) is in progress already");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        activityLoader.setLoading(false);
        Alert.alert("play services not available or outdated");
      } else {
        activityLoader.setLoading(false);
        Alert.alert('Something went Wrong..!');
      }
    }
    activityLoader.setLoading(false);
  };

  return (
    <Button
      tx="signinScreen.gmailSignIn"
      style={ButtonStyle}
      textStyle={TextStyle}
      onPress={() => GoogleSignIn()}
    />
  )
}
