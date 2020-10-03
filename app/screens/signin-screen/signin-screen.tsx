import React, { useEffect, useRef, useState } from "react"
import { Alert, ImageStyle, TextStyle, View, ViewStyle } from "react-native"

import { useStores } from "../../models"
import { observer } from "mobx-react-lite"

// Components and Utils Import
import { Button, Icon, Screen, Text, TextField } from "../../components"
import { color, spacing, typography } from "../../theme"
import { validateEmail, validatePassword } from '../../utils/validation'

// Google and Facebook Signin imports
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import { AccessToken } from 'react-native-fbsdk';
import { LoginManager } from "react-native-fbsdk";
import { GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { async } from "validate.js"

// Style form Screen
const CONTAINER: ViewStyle = {
  flex: 1,
  justifyContent: 'space-between',
  paddingHorizontal: spacing[6],
}

// Common Styles
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
  paddingVertical: spacing[2],
  paddingBottom: spacing[6]
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

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState([]);
  const [afterSubmitErrorCheck, setAftersubmitErrorCheck] = useState(false);
  const [accessToken, setAccessToken] = useState('');

  // Refenrece for password TextInput
  const passwordRef = useRef(null);
  // Define UserAuth Store
  const { userAuth } = useStores();

  useEffect(() => {
    GoogleConfigure();
  }, []);

  // Configuration for Google Signin
  const GoogleConfigure = async () => {
    GoogleSignin.configure({
      webClientId: '268623996927-58msmim502qhmj4cp3hbmu1cb3jbuvlo.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }

  // Sign Function for Google Signin
  const GoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      userAuth.setTokenAvaible();
      console.log(userInfo);
      console.tron.log(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("user cancelled the login flow");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert("operation (e.g. sign in) is in progress already");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("play services not available or outdated");
      } else {
        console.log(error);
      }
    }
  };

  // Signin function for Facebook Signin
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
              const infoRequest = new GraphRequest(
                '/me',
                {
                  accessToken: data.accessToken.toString(),
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
      console.log(error)
    } else {
      console.log(result)
      await userAuth.setTokenAvaible();
    }
  }

  // Submit form handler
  const SubmitForm = () => {
    let emailValidated = EmailValidation(email);
    let passwordValidated = PasswordValidation(password);

    if (emailValidated && passwordValidated) {
      console.tron.log('Sucess');
      userAuth.setTokenAvaible();
    }
    else {
      setAftersubmitErrorCheck(true);
    }
  }

  // Email Validator
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

  // Passsword Validator
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

  // function calls on change in email input
  const handleEmail = (email) => {
    setEmail(email);
    if (afterSubmitErrorCheck) {
      EmailValidation(email);
    }
  }

  // function calls on change in password input
  const handlePassword = (password) => {
    setPassword(password);
    if (afterSubmitErrorCheck) {
      PasswordValidation(password);
    }
  }

  return (
    <Screen style={CONTAINER} preset="fixed" backgroundColor={color.transparent}>
      {/* Header View with Icon and Welcome message */}
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
    </Screen>
  )
})
