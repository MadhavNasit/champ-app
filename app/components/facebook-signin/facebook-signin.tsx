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

  const { userAuth } = useStores();

  // Signin function for Facebook Signin
  const FacebookSignIn = () => {
    LoginManager.logInWithPermissions(["public_profile", "email"]).then(
      function (result) {
        if (result.isCancelled) {
          console.log("Login cancelled");
        } else {
          console.log(
            "Login success with permissions: " +
            result.grantedPermissions.toString()
          );

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
        console.log("Login fail with error: " + error);
      }
    );
  }

  // Facebook responce
  const responseInfoCallback = async (error, result) => {
    if (error) {
      Alert.alert('Something Wrong..!!')
    } else {
      console.tron.log(result);
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
