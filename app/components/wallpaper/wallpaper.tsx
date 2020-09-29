import React from "react"
import { Dimensions, Image, ImageStyle } from "react-native"
import { presets } from "./wallpaper.presets"
import { WallpaperProps } from "./wallpaper.props"

const defaultImage = require("./bg.png")



/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function Wallpaper(props: WallpaperProps) {
  // grab the props
  const { preset = "stretch", style: styleOverride, backgroundImage } = props
  const imageStyle: ImageStyle = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    resizeMode: 'cover',
  }
  // assemble the style
  const presetToUse = presets[preset] || presets.stretch
  const style = { ...presetToUse, ...imageStyle }

  // figure out which image to use
  const source = backgroundImage || defaultImage

  return <Image source={source} style={style} />
}
