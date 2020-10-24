/**
 * Sign in screen with email, google and facebook sign
 */

import React, { useRef, useState } from "react"
import { ImageStyle, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, TextStyle, View, ViewStyle } from "react-native"

import { useStores } from "../../models"
import { observer } from "mobx-react-lite"

// Components and Utils Import
import { Button, FacebookSignin, GoogleSignIn, Icon, Text, TextField, Wallpaper } from "../../components"
import { color, fontSize, horizantalSpacing, spacing, typography, verticalSpacing } from "../../theme"
import { validateEmail, validatePassword } from '../../utils/validation'
import { offsets } from "../../components/screen/screen.presets"
import { ActivityLoader } from "../../components/activity-loader/activity-loader"
import { ScrollView } from "react-native-gesture-handler"
import {
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"

// Style form Screen
const FULL: ViewStyle = {
  flex: 1,
  backgroundColor: color.background
}
const CONTAINER: ViewStyle = {
  flex: 1,
  justifyContent: 'space-between',
  paddingHorizontal: horizantalSpacing[7],
}

// Common Styles
const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }

const BUTTON: ViewStyle = {
  paddingVertical: verticalSpacing[4],
  borderRadius: 0,
  marginTop: verticalSpacing[1],
  marginBottom: verticalSpacing[2]
}
const TEXTBUTTON: TextStyle = {
  fontSize: fontSize.FONT_16Px,
}

// <-- Heading View Start --> //
const HeaderView: ViewStyle = {
  marginBottom: verticalSpacing[4],
  paddingTop: verticalSpacing[6]
}
// Boxing Icon Style
const BoxingIconView: ViewStyle = {
  marginBottom: verticalSpacing[1],
}
const BoxingIcon: ImageStyle = {
  height: hp('8'),
  width: hp('8%'),
}
// Welcome Back Heading
const WelcomeTextView: ViewStyle = {
  marginBottom: verticalSpacing[1],
}
const WelcomeText: TextStyle = {
  ...TEXT,
  ...BOLD,
  textAlign: 'left',
  fontSize: fontSize.FONT_30Px,
}
const SignInText: TextStyle = {
  ...TEXT,
  marginTop: -verticalSpacing[1],
  fontSize: fontSize.FONT_16Px,
}
// !-- Heading View End --! //

// <-- SignIn form view Start --> //
const SignInFormView: ViewStyle = {
  paddingVertical: verticalSpacing[2],
}
const FormFieldView: ViewStyle = {
  marginBottom: verticalSpacing[3],
}
const TextFieldView: ViewStyle = {
  borderBottomWidth: 1,
  borderBottomColor: color.palette.white,
  paddingBottom: verticalSpacing[0],
}
const errorText: TextStyle = {
  fontSize: fontSize.FONT_16Px,
  color: color.palette.angry
}
// Sign In Button
const SignInButton: ViewStyle = {
  ...BUTTON,
  marginTop: verticalSpacing[3],
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
  paddingVertical: verticalSpacing[2],
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

  // State for local store
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState([]);
  const [afterSubmitErrorCheck, setAftersubmitErrorCheck] = useState(false);

  // Refenrece for password TextInput
  const passwordRef = useRef(null);
  // Define UserAuth Store
  const { userAuth, activityLoader } = useStores();

  // Submit form handler
  const SubmitForm = () => {
    activityLoader.setLoading(true);
    Keyboard.dismiss();
    let emailValidated = EmailValidation(email);
    let passwordValidated = PasswordValidation(password);

    if (emailValidated && passwordValidated) {
      let userObj = {
        userName: '',
        profileUrl: '',
        userEmail: email
      }
      userAuth.userAuthenticate(userObj);
    }
    else {
      setAftersubmitErrorCheck(true);
    }
    activityLoader.setLoading(false);
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
    <View style={FULL}>
      {/* // Background Image set */}
      <Wallpaper />
      <ActivityLoader />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={CONTAINER}>
          <KeyboardAvoidingView
            behavior={Platform.OS == 'ios' ? "padding" : null}
            keyboardVerticalOffset={offsets["none"]}
          >
            <ScrollView
              overScrollMode='never'>
              <StatusBar barStyle={"light-content"} backgroundColor={color.background} />
              {/* Header View with Icon and Welcome message */}
              <View style={{}}>
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
                    <TextField
                      labelTx="signinScreen.emailLabel"
                      value={email}
                      autoCapitalize='none'
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
            </ScrollView>
          </KeyboardAvoidingView>
          {/* Social Account SignIn View */}
          <View style={SocialButtonView}>
            <FacebookSignin
              ButtonStyle={FacebookButton}
              TextStyle={TextSocialButton}
            />
            <GoogleSignIn
              ButtonStyle={GmailButton}
              TextStyle={TextSocialButton}
            />
          </View>
        </View>
      </SafeAreaView>
    </View >
  )
})
