import React from "react"
import { View, ViewStyle, TextStyle, ImageStyle } from "react-native"
import { HeaderProps } from "./header.props"
import { Button } from "../button/button"
import { Text } from "../text/text"
import { Icon } from "../icon/icon"
import { color, fontSize, horizantalSpacing, typography, verticalSpacing } from "../../theme"
import { translate } from "../../i18n/"
import { useNavigation } from "@react-navigation/native"
import { DrawerActions } from '@react-navigation/native';

// static styles
const ROOT: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  paddingHorizontal: horizantalSpacing[4],
  paddingVertical: verticalSpacing[4],
  borderBottomColor: color.palette.offWhite,
  borderBottomWidth: 0.3
}
const TITLE: TextStyle = {
  fontFamily: typography.bold,
  textAlign: "center",
  fontSize: fontSize.FONT_24Px,
  textTransform: 'capitalize'
}
const TITLE_MIDDLE: ViewStyle = { flex: 6, justifyContent: "center" }
const LEFT: ViewStyle = { flex: 1 }
const RIGHT: ViewStyle = { flex: 1 }
const IconStyle: ImageStyle = {
  height: fontSize.FONT_21Px,
  resizeMode: 'contain'
}

/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 */
export function Header(props: HeaderProps) {
  const {
    rightIcon,
    leftIcon,
    headerText,
    headerTx,
    style,
    titleStyle,
    onLeftPress
  } = props
  const header = headerText || (headerTx && translate(headerTx)) || ""

  const navigation = useNavigation();

  return (
    <View style={{ ...ROOT, ...style }}>
      {/* Back Button for Previous screen navigation */}
      {leftIcon ? (
        <Button preset="link" style={LEFT} onPress={() => onLeftPress()}>
          <Icon icon={leftIcon} style={IconStyle} />
        </Button>
      ) : (
          <View style={LEFT} />
        )}
      {/* Screen Title */}
      <View style={TITLE_MIDDLE}>
        <Text style={{ ...TITLE, ...titleStyle }} text={header} numberOfLines={1} />
      </View>
      {/* Drawer opne Icon */}
      {rightIcon ? (
        <Button preset="link" style={RIGHT} onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
          <Icon icon={rightIcon} style={IconStyle} />
        </Button>
      ) : (
          <View style={RIGHT} />
        )
      }
    </View >
  )
}
