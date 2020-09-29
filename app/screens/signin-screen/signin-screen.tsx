import React, { useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, ImageStyle, SafeAreaView, TextStyle, View, ViewStyle } from "react-native"
import { Button, Header, Icon, Screen, Text, TextField, Wallpaper } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color, spacing, typography } from "../../theme"
import { icons } from "../../components/icon/icons"
import { validateEmail, validatePassword } from '../../utils/validation'
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import { LoginManager } from "react-native-fbsdk";
import { types } from "mobx-state-tree"
import { GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

const FULL: ViewStyle = {
  flex: 1,
  backgroundColor: color.background
}
const CONTAINER: ViewStyle = {
  flex: 1,
  justifyContent: 'space-between',
  backgroundColor: color.transparent,
  // borderWidth: 1,
  // borderColor: 'white',
  paddingHorizontal: spacing[6],
}
const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }

const BUTTON: ViewStyle = {
  paddingVertical: spacing[4],
  borderRadius: 0,
  marginVertical: spacing[2]
}
const TEXTBUTTON: TextStyle = {
  fontSize: 16,
}

const UpperFormView: ViewStyle = {
  paddingTop: spacing[6],
}
// <-- Heading View Start --> //
const HeaderView: ViewStyle = {
  marginBottom: spacing[4],
}
// Boxing Icon Style
const BoxingIconView: ViewStyle = {
  marginBottom: spacing[2],
}
const BoxingIcon: ImageStyle = {
  height: 80,
  width: 80,
}
// Welcome Back Heading
const WelcomeTextView: ViewStyle = {
  marginBottom: spacing[1],
}
const WelcomeText: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 26,
}
const SignInText: TextStyle = {
  ...TEXT,
  fontSize: 16,
}
// !-- Heading View End --! //

// <-- SignIn form view Start --> //
const SignInFormView: ViewStyle = {
  paddingVertical: spacing[2],
}
const FormFieldView: ViewStyle = {
  marginBottom: spacing[4],
}
const TextFieldView: ViewStyle = {
  borderBottomWidth: 1,
  borderBottomColor: color.palette.white,
  paddingBottom: spacing[0],
  // marginBottom: spacing[4],
}
const errorText: TextStyle = {
  color: color.palette.angry
}
// Sign In Button
const SignInButton: ViewStyle = {
  ...BUTTON,
  backgroundColor: color.palette.golden,
}
const TextSignInButton: TextStyle = {
  ...TEXTBUTTON,
  color: color.palette.black,
  letterSpacing: 3
}
// !-- SignIn form View Ends --! //

// <-- Social Account SignIn Start --> //
const SocialButtonView: ViewStyle = {
  // paddingHorizontal: spacing[6],
  // flex: 1,
  // flex: 1.5,
  paddingVertical: spacing[2],
  paddingBottom: spacing[6]
  // backgroundColor: 'red',
  // justifyContent: 'flex-end'
}
const TextSocialButton: TextStyle = {
  ...TEXTBUTTON,
  color: color.palette.white
}
const FacebookButton: ViewStyle = {
  ...BUTTON,
  backgroundColor: color.palette.frenchBlue
}
const GmailButton: ViewStyle = {
  ...BUTTON,
  backgroundColor: color.palette.brick
}
// !-- Social Account SignIn End --! //



export const SigninScreen = observer(function SigninScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  // OR
  // const rootStore = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState([]);
  const [afterSubmitErrorCheck, setAftersubmitErrorCheck] = useState(false);
  const [accessToken, setAccessToken] = useState('');

  const passwordRef = useRef(null);

  useEffect(() => {
    GoogleSignin.configure({

      webClientId: '268623996927-4u3sbg3r489fsjun36o1nep09d60late.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      iosClientId: '268623996927-vde5bou0hjaln3qbo2m120753lko9ui3.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
  }, [])

  const GoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
      console.tron.log(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };



  const FacebookSignIn = () => {
    LoginManager.logInWithPermissions(["public_profile"]).then(
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
              setAccessToken(data.accessToken.toString())
              console.log(data.accessToken.toString())
            }
          )
          console.log(result)
          const responseInfoCallback = (error, result) => {
            if (error) {
              console.log(error)
              Alert.alert('Error fetching data: ' + error.toString());
            } else {
              console.log(result)
              Alert.alert('Success fetching data: ' + result.toString());
            }
          }

          const infoRequest = new GraphRequest(
            '/me',
            {
              accessToken: accessToken,
              parameters: {
                fields: {
                  string: 'email,name,first_name,middle_name,last_name'
                }
              }
            },
            responseInfoCallback
          );

          // Start the graph request.
          new GraphRequestManager().addRequest(infoRequest).start()

        }
      },
      function (error) {
        console.log("Login fail with error: " + error);
      }
    );
  }


  const SubmitForm = () => {
    let emailValidated = EmailValidation(email);
    let passwordValidated = PasswordValidation(password);

    if (emailValidated && passwordValidated) {
      console.tron.log('Sucess');
    }
    else {
      setAftersubmitErrorCheck(true);
    }
  }

  const EmailValidation = (email) => {
    let emailValidator = validateEmail(email);
    if (emailValidator != '') {
      setEmailError(emailValidator);
      return false;
    }
    else {
      setEmailError('');
      return true;
    }
  }

  const PasswordValidation = (password) => {
    let passwordValidator = validatePassword(password);
    console.tron.log(passwordValidator);
    setPasswordError(passwordValidator);
    if (passwordValidator.length != 0) {
      return false;
    }
    else {
      return true;
    }
  }

  const handleEmail = (email) => {
    setEmail(email);
    if (afterSubmitErrorCheck) {
      EmailValidation(email);
    }
  }

  const handlePassword = (password) => {
    setPassword(password);
    if (afterSubmitErrorCheck) {
      PasswordValidation(password);
    }
  }


  return (
    <View style={FULL}>
      {/* Background Image set */}
      <Wallpaper backgroundImage={icons.background} />
      {/* <SafeAreaView style={{ flex: 1 }}> */}
      <Screen style={CONTAINER} preset="fixed" backgroundColor={color.transparent}>
        {/* Header View with Icon and Welcome message */}
        {/* <KeyboardAwareScrollView style={{ borderWidth: 1, }}> */}
        <View style={UpperFormView}>
          <View style={HeaderView}>
            <Icon containerStyle={BoxingIconView} style={BoxingIcon} icon={'logo'} />
            <View style={WelcomeTextView}>
              <Text
                tx="signinScreen.Welcome"
                style={WelcomeText} />
              <Text
                tx={"signinScreen.SignInToContinue"}
                style={SignInText}
              />
            </View>
          </View>
          {/* SignIn Form View */}
          <View style={SignInFormView}>
            <View style={FormFieldView}>
              <TextField labelTx="signinScreen.emailLabel"
                value={email}
                onChangeText={(email) => handleEmail(email)}
                placeholderTx="signinScreen.emailPlaceholder"
                style={TextFieldView}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current.focus()}
                blurOnSubmit={false}
              />
              <Text text={emailError} style={errorText} />
            </View>
            <View style={FormFieldView}>
              <TextField labelTx="signinScreen.passwordLabel"
                placeholderTx="signinScreen.passwordPlaceholder"
                value={password}
                onChangeText={(password) => handlePassword(password)}
                style={TextFieldView}
                secureTextEntry={true}
                returnKeyType="done"
                forwardedRef={passwordRef}
              />
              {passwordError.map((item, key) => (
                <Text text={item} key={key} style={errorText} />
              ))}
            </View>
            <Button
              tx="signinScreen.signinButton"
              style={SignInButton}
              textStyle={TextSignInButton}
              onPress={() => SubmitForm()}
            />
          </View>
        </View>
        {/* <View>
            <LoginButton
              onLoginFinished={
                (error, result) => {
                  if (error) {
                    console.log("login has error: " + result.error);
                  } else if (result.isCancelled) {
                    console.log("login is cancelled.");
                  } else {
                    AccessToken.getCurrentAccessToken().then(
                      (data) => {
                        console.log(data.accessToken.toString())
                      }
                    )
                  }
                }
              }
              onLogoutFinished={() => console.log("logout.")} />
          </View> */}
        {/* Social Account SignIn View */}
        <View style={SocialButtonView}>
          <Button
            tx="signinScreen.facebookSignIn"
            style={FacebookButton}
            textStyle={TextSocialButton}
            onPress={() => FacebookSignIn()}
          />
          <Button
            tx="signinScreen.gmailSignIn"
            style={GmailButton}
            textStyle={TextSocialButton}
            onPress={() => GoogleSignIn()}
          />
        </View>
        {/* </KeyboardAwareScrollView> */}
        {/* </SafeAreaView> */}
      </Screen>
      {/* <SafeAreaView>
      </SafeAreaView> */}
    </View >
  )
})
