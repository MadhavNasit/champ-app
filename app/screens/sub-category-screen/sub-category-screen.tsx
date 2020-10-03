import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { Header, Screen, Text } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { FlatList, TouchableOpacity } from "react-native-gesture-handler"
import { useStores } from "../../models"

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
}
const CategoryButton: ViewStyle = {
  // borderColor: color.palette.white,
  // borderWidth: 1,
  // alignItems: 'center',
  marginVertical: spacing[2],
  paddingVertical: spacing[4]
}
const SubCategoryButton: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center'
}
const IconStyle: ImageStyle = {
  height: 60,
  width: 60,
  borderColor: color.palette.golden,
  borderWidth: 2,
  borderRadius: 60
}
const CategoryText: TextStyle = {
  color: color.palette.white,
  fontSize: 18,
  letterSpacing: 1,
  textTransform: 'capitalize',
  paddingLeft: spacing[3]
}

export const SubCategoryScreen = observer(function SubCategoryScreen({ route, navigation }) {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  // OR
  // const rootStore = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  const { apiData } = useStores();

  useEffect(() => {
    apiData.getSubCategories(route.params.parentId);
  }, []);

  return (
    <Screen style={ROOT} preset="fixed">
      <Header
        headerText={route.params.categoryName}
        rightIcon='hamburger'
        leftIcon='back'
      />
      <View style={CONTAINER}>
        <FlatList
          data={apiData.subCategory}
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
                <View style={SubCategoryButton}>
                  <Image source={{ uri: item.icon }} style={IconStyle} />
                  <Text style={CategoryText} text={item.name} />
                </View>
              </TouchableOpacity>
            )
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </Screen>
  )
})
