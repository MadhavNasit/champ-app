import * as React from "react"
import { Alert, TextStyle, ViewStyle } from "react-native"
import { Button } from "../button/button";
import { useStores } from "../../models";

// Facebook Signin imports
import { AccessToken } from 'react-native-fbsdk';
import { LoginManager } from "react-native-fbsdk";
import { GraphRequest, GraphRequestManager } from 'react-native-fbsdk';



export interface FacebookSigninProps {
  /**
   * An optional style override useful for style of Button
   */
  ButtonStyle?: ViewStyle,
  TextStyle?: TextStyle
}

/**
 * Describe your component here
 */
export function FacebookSignin(props: FacebookSigninProps) {
  const { ButtonStyle, TextStyle } = props;

  const { userAuth, activityLoader } = useStores();

  // Signin function for Facebook Signin
  const FacebookSignIn = () => {
    activityLoader.setLoading(true);
    LoginManager.logInWithPermissions(["public_profile", "email"]).then(
      function (result) {
        if (result.isCancelled) {
          activityLoader.setLoading(false);
          Alert.alert("Login cancelled");
        } else {
          AccessToken.getCurrentAccessToken().then(
            (data) => {
              const infoRequest = new GraphRequest(
                '/me',
                {
                  accessToken: data.accessToken.toString(),
                  parameters: {
                    fields: {
                      string: 'email,name,last_name,picture'
                    }
                  }
                },
                responseInfoCallback
              );

              // Start the graph request.
              new GraphRequestManager().addRequest(infoRequest).start()
            }
          )

        }
      },
      function (error) {
        activityLoader.setLoading(false);
        Alert.alert("Something went wrong..!!", "Login fail");
      }
    );
  }

  // Facebook responce
  const responseInfoCallback = async (error, result) => {
    if (error) {
      activityLoader.setLoading(false);
      Alert.alert('Something Wrong..!!')
    } else {
      activityLoader.setLoading(false);
      let userObj = {
        userName: result.name,
        profileUrl: result.picture.data.url,
        userEmail: result.email
      }
      await userAuth.userAuthenticate(userObj);
    }
  }

  return (
    <Button
      tx="signinScreen.facebookSignIn"
      style={ButtonStyle}
      textStyle={TextStyle}
      onPress={() => FacebookSignIn()}
    />
  )
}
