import { Platform } from "react-native"

/**
 * You can find a list of available fonts on both iOS and Android here:
 * https://github.com/react-native-training/react-native-fonts
 *
 * If you're interested in adding a custom font to your project,
 * check out the readme file in ./assets/fonts/ then come back here
 * and enter your new font name. Remember the Android font name
 * is probably different than iOS.
 * More on that here:
 * https://github.com/lendup/react-native-cross-platform-text
 *
 * The various styles of fonts are defined in the <Text /> component.
 */
export const typography = {
  /**
   * The primary font.  Used in most places.
   */
  regular: Platform.select({ ios: "SFProText-Regular", android: "SFProText-Regular" }),

  /**
   * An alternate font used for perhaps titles and stuff.
   */
  bold: Platform.select({ ios: "SFProText-Bold", android: "SFProText-Bold" }),

  semiBold: Platform.select({ ios: "SFProText-Semibold", android: "SFProText-Semibold" }),
  light: Platform.select({ ios: "SFProText-light", android: "SFProText-light" }),
}
