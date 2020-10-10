import * as React from "react"
import { ImageStyle, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color, spacing, typography } from "../../theme"
import { Text } from "../"
import { Icon } from "../icon/icon"

const CONTAINER: ViewStyle = {
  justifyContent: "center",
}

const TEXT: TextStyle = {
  fontFamily: typography.primary,
  fontSize: 14,
  color: color.primary,
}

export interface NavButtonProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle
}

// nav Buttons Style
const NavButtonView: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginVertical: 14,
  paddingHorizontal: spacing[6]
}
const NavButtonStyle: ViewStyle = {
  borderWidth: 1,
  alignItems: 'center',
  paddingHorizontal: 8,
  paddingVertical: 6
}
const NavButtonPrev: ViewStyle = {
  ...NavButtonStyle,
  flexDirection: 'row',
  borderColor: color.palette.white,
}
const NavButtonNext: ViewStyle = {
  ...NavButtonStyle,
  flexDirection: 'row-reverse',
  borderColor: color.palette.golden,
  backgroundColor: color.palette.golden,
}
const NavIconStyle: ImageStyle = {
  height: 10,
  width: 8,
}
const NavIconPrev: ImageStyle = {
  ...NavIconStyle,
  marginRight: 5,
  tintColor: color.palette.white
}
const NavIconNext: ImageStyle = {
  ...NavIconStyle,
  marginLeft: 5,
  tintColor: color.palette.black
}
const NavPrevText: TextStyle = {
  color: color.palette.white
}
const NavNextText: TextStyle = {
  color: color.palette.black
}

/**
 * Describe your component here
 */
export const NavButton = observer(function NavButton(props: NavButtonProps) {
  const { style } = props

  // Prev and Next button component
  const NavButton = (props) => {
    const { buttonStyle, icon, iconStyle, buttonText, textStyle } = props;
    return (
      <TouchableOpacity
        style={buttonStyle}
      >
        <Icon icon={icon} style={iconStyle} />
        <Text text={buttonText} style={textStyle} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={NavButtonView}>
      <NavButton
        buttonStyle={NavButtonPrev}
        icon='back'
        iconStyle={NavIconPrev}
        buttonText='PREV'
        textStyle={NavPrevText}
      />
      <NavButton
        buttonStyle={NavButtonNext}
        icon='next'
        iconStyle={NavIconNext}
        buttonText='NEXT'
        textStyle={NavNextText}
      />
    </View>
  )
})
