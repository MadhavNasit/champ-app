import * as React from "react"
import { View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color } from "../../theme"
import { LinesLoader } from 'react-native-indicator';
import { useStores } from "../../models";


export interface ActivityLoaderProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle
}

/**
 * Describe your component here
 */
export const ActivityLoader = observer(function ActivityLoader() {

  const { activityLoader, subCategories, categoryData } = useStores()

  if (activityLoader.loading || subCategories.loading || categoryData.loading) {
    return (
      <View style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.5)"
      }}>
        <LinesLoader barWidth={6} barHeight={55} color={color.palette.golden} />
      </View>
    )
  }
  else {
    return null;
  }
  // return (
  //   { (activityLoader.loading) ? (

  //     )
  //       :
  //       (
  //         null
  //       )
  //   }
  // )
})
