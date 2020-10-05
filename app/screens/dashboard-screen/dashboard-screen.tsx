import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, TouchableOpacity, View, FlatList, ViewStyle } from "react-native"
import { BulletItem, Button, Header, Screen, Text } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { useStores } from "../../models"
import { icons } from "../../components/icon/icons"
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native"
import { async } from "validate.js"

const ROOT: ViewStyle = {
  flex: 1,
}
const CONTAINER: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing[6]
}
const FlatListview: ViewStyle = {
  flexGrow: 1,
  justifyContent: 'center',
  width: '100%',
}
const CategoryButton: ViewStyle = {
  borderColor: color.palette.white,
  borderWidth: 1,
  alignItems: 'center',
  marginVertical: spacing[2],
  paddingVertical: spacing[4]
}
const CategoryText: TextStyle = {
  color: color.palette.white,
  letterSpacing: spacing[1]
}

export const DashboardScreen = observer(function DashboardScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  // OR.
  // const rootStore = useStores()

  // Pull in navigation via hook

  const navigation = useNavigation()
  const { apiData } = useStores();

  useEffect(() => {
    apiData.setSubCategoryIndex(0);
  });
  useEffect(() => {
    LoadDataFromApi();
    console.tron.log('In useeffect')
  }, []);

  const LoadDataFromApi = async () => {
    await apiData.getCategoryData();
    await apiData.getCategories();
  }

  return (
    <Screen style={ROOT} preset="fixed">
      <Header
        headerText='Dashboard'
        rightIcon='hamburger'
      />
      <View style={CONTAINER}>
        <FlatList
          data={apiData.mainCategory}
          contentContainerStyle={FlatListview}
          renderItem={({ item, index }: any) => {
            return (
              <TouchableOpacity
                style={CategoryButton}
                key={index}
                onPress={() => navigation.navigate('subcategory', {
                  parentId: item.id,
                  categoryName: item.name
                })}>
                <Text style={CategoryText} text={item.name} />
              </TouchableOpacity>
            )
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </Screen>
  )
})
