import * as React from "react"
import { Dimensions, ImageStyle, SafeAreaView, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { color } from "../../theme"
import { Icon } from "../icon/icon"

// Tab Bar style
const TabBarView: ViewStyle = {
  height: '10%',
  flexDirection: 'row',
  backgroundColor: 'black',
  alignContent: 'center'
}
const ButtonView: ViewStyle = {
  flex: 1,
}
const TabView: ViewStyle = {
  flex: 1,
  width: '100%',
}
const SafeAreaViewStyle: ViewStyle = {
  flex: 1,
}
const TabItemview: ViewStyle = {
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
}
const TabIcon: ImageStyle = {
  height: 23.3,
  resizeMode: 'contain',
  marginVertical: 2,
}
const TabLabel: TextStyle = {
  color: 'black',
  fontSize: 16.3,
  marginVertical: 2,
}

// Style for Triangle creation
const windowWidth = Dimensions.get('window').width;
let borderWidth = windowWidth / 4;
const Triangle: ViewStyle = {
  position: "absolute",
  top: -16,
  zIndex: 1,
  width: '100%',
  height: 0,
  backgroundColor: 'transparent',
  borderStyle: 'solid',
  borderLeftWidth: borderWidth,
  borderRightWidth: borderWidth,
  borderBottomWidth: 16,
  borderLeftColor: 'transparent',
  borderRightColor: 'transparent',
  borderBottomColor: 'white'
}

export function TabBar({ state, descriptors, navigation }) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={TabBarView}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;
        const icon = route.name == 'Dashboard' ? 'dashboard' : 'profile';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            activeOpacity={1}
            accessibilityRole="button"
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={ButtonView}
          >
            {isFocused ?
              <View style={Triangle} />
              : null}
            <View style={[TabView, { backgroundColor: isFocused ? color.palette.white : color.palette.golden }]}>
              <SafeAreaView style={SafeAreaViewStyle}>
                <View style={TabItemview}>
                  <Icon style={TabIcon} icon={icon} />
                  <Text style={TabLabel}>
                    {label}
                  </Text>
                </View>
              </SafeAreaView>
            </View>
          </TouchableOpacity>
        );
      })}
    </View >
  );
}

