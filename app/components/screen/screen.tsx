import * as React from "react"
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, View, ViewStyle } from "react-native"
import { useSafeArea } from "react-native-safe-area-context"
import { ScreenProps } from "./screen.props"
import { isNonScrolling, offsets, presets } from "./screen.presets"
import { color } from "../../theme"
import { Wallpaper } from "../wallpaper/wallpaper"

const isIos = Platform.OS === "ios"

const FULL: ViewStyle = {
  flex: 1,
  backgroundColor: color.background
}

function ScreenWithoutScrolling(props: ScreenProps) {
  const insets = useSafeArea()
  const preset = presets.fixed
  const style = props.style || {}
  const backgroundStyle = props.backgroundColor ? { backgroundColor: props.backgroundColor } : { backgroundColor: color.transparent }
  const insetStyle = { paddingTop: props.unsafe ? 0 : insets.top }

  return (
    <View style={FULL}>
      {/* Background Image set */}
      <Wallpaper />
      <KeyboardAvoidingView
        style={[preset.outer, backgroundStyle]}
        behavior={isIos ? "padding" : null}
        keyboardVerticalOffset={offsets[props.keyboardOffset || "none"]}
      >
        <StatusBar barStyle={props.statusBar || "light-content"} backgroundColor={color.background} />
        <View style={[preset.inner, style, insetStyle]}>{props.children}</View>
      </KeyboardAvoidingView>
    </View>
  )
}

function ScreenWithScrolling(props: ScreenProps) {
  const insets = useSafeArea()
  const preset = presets.scroll
  const style = props.style || {}
  const backgroundStyle = props.backgroundColor ? { backgroundColor: props.backgroundColor } : { backgroundColor: color.transparent }
  const insetStyle = { paddingTop: props.unsafe ? 0 : insets.top }

  return (
    <View style={FULL}>
      {/* Background Image set */}
      <Wallpaper />
      <KeyboardAvoidingView
        style={[preset.outer, backgroundStyle]}
        behavior={isIos ? "padding" : null}
        keyboardVerticalOffset={offsets[props.keyboardOffset || "none"]}
      >
        <StatusBar barStyle={props.statusBar || "light-content"} backgroundColor={color.background} />
        <View style={[preset.outer, backgroundStyle, insetStyle]}>
          <ScrollView
            style={[preset.outer, backgroundStyle]}
            contentContainerStyle={[preset.inner, style]}
          >
            {props.children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

/**
 * The starting component on every screen in the app.
 *
 * @param props The screen props
 */
export function Screen(props: ScreenProps) {
  if (isNonScrolling(props.preset)) {
    return <ScreenWithoutScrolling {...props} />
  } else {
    return <ScreenWithScrolling {...props} />
  }
}
