import React, { useEffect, useState } from "react"
import { Alert, ImageStyle, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"

import { useNavigation } from "@react-navigation/native"
import { StackActions } from '@react-navigation/native';

import { observer } from "mobx-react-lite"
import { useStores } from "../../models"

import { color, spacing, typography } from "../../theme"
import { Icon } from "../icon/icon"
import { Text } from "../text/text"

// Takes parent id and Sub category id as props
export interface NavButtonProps {
  parentId?: number,
  subCategoryId?: number
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
const TEXT: TextStyle = {
  fontFamily: typography.regular,
}
const NavPrevText: TextStyle = {
  ...TEXT,
  color: color.palette.white
}
const NavNextText: TextStyle = {
  ...TEXT,
  color: color.palette.black
}

// Main navButton Component Function
export const NavButton = observer(function NavButton(props: NavButtonProps) {
  // Defines Props, Store and Navigation
  const { parentId, subCategoryId } = props;
  const { subCategories, categoryData } = useStores()
  const navigation = useNavigation()

  // States for Disable ot Enable Buttons
  const [indexOfParent, setIndexOfParent] = useState<number>();
  const [indexOfSubCategory, setIndexOfSubCategory] = useState<number>();
  const [lengthSubCategory, setLengthSubCategory] = useState<number>();
  const [nextDisabled, setNextDisabled] = useState<boolean>(false);
  const [prevDisabled, setPrevDisabled] = useState<boolean>(false);

  useEffect(() => {
    ButtonDisable(parentId, subCategoryId);

    return function clenup() {
      setNextDisabled(false);
      setPrevDisabled(false);
    }
  }, []);

  const ButtonDisable = (parentId: number, subCategoryId: number) => {
    // Find current parentId index in subcategory store
    let indexOfParent = subCategories.subCategoryData.findIndex(x => x.parentId == parentId);
    setIndexOfParent(indexOfParent);
    // Find current subcategory index in subcategory sotre using parent index
    let indexOfSubCategory = subCategories.subCategoryData[indexOfParent].data.findIndex(y => y.id == subCategoryId);
    setIndexOfSubCategory(indexOfSubCategory);
    // Length of sub category array
    let lengthSubCategory = subCategories.subCategoryData[indexOfParent].data.length;
    setLengthSubCategory(lengthSubCategory);

    if (parentId == 1 && indexOfSubCategory == 0) {
      setPrevDisabled(true);
    }

    if (categoryData.mainCategoryData.length == parentId && lengthSubCategory == indexOfSubCategory + 1) {
      setNextDisabled(true);
    }
  }

  // Prev and Next button component
  const NavButton = (props) => {
    const { buttonStyle, icon, iconStyle, buttonText, textStyle, disabled } = props;
    return (
      <TouchableOpacity
        style={buttonStyle}
        disabled={disabled}
        {...props}
      >
        <Icon icon={icon} style={iconStyle} />
        <Text text={buttonText} style={textStyle} />
      </TouchableOpacity>
    );
  }

  // Length of categories
  const lengthOfCategory = categoryData.mainCategoryData.length;

  // Onpress function for Next Button
  // Navigates to next Screen
  const NextPress = async () => {
    // Checks for navigation in same sub category or next sub category
    if (indexOfSubCategory < lengthSubCategory - 1) {
      if (indexOfParent != -1) {
        subCategories.clearSubCategoryMedia();
        let dataOfMedia = subCategories.subCategoryData[indexOfParent].data[indexOfSubCategory + 1];
        navigation.dispatch(StackActions.push(dataOfMedia.type == 'Image' ? 'imagedetail' : 'videodetail', {
          categoryId: dataOfMedia.parent_id,
          subCategoryId: dataOfMedia.id,
          subCategoryName: dataOfMedia.name,
          mediaType: dataOfMedia.type
        }))
      }
      else {
        Alert.alert('Someting went wrong..!!');
        setNextDisabled(true)
      }
    }
    else {
      let newParentId = parentId + 1;
      if (newParentId <= lengthOfCategory) {
        await subCategories.getSubCategoryData(newParentId);
        let indexOfNewParent = subCategories.subCategoryData.findIndex(x => x.parentId == newParentId);
        if (indexOfNewParent != -1) {
          subCategories.clearSubCategoryMedia();
          let dataOfMedia = subCategories.subCategoryData[indexOfNewParent].data[0];
          navigation.dispatch(StackActions.push(dataOfMedia.type == 'Image' ? 'imagedetail' : 'videodetail', {
            categoryId: dataOfMedia.parent_id,
            subCategoryId: dataOfMedia.id,
            subCategoryName: dataOfMedia.name,
            mediaType: dataOfMedia.type
          }))
        }
        else {
          Alert.alert('Someting went wrong..!!');
          setNextDisabled(true)
        }
      }
      else {
        // Alert and Disabled button at last Screen
        Alert.alert("You're on Last Screen")
        setNextDisabled(true)
      }
    }
  }

  // Onpress function for Prev Button
  // Navigates to prev Screen
  const PrevPress = async () => {
    // Checks for navigation in same sub category or previous sub category
    if (indexOfSubCategory > 0) {
      if (indexOfParent != -1) {
        subCategories.clearSubCategoryMedia();
        let dataOfMedia = subCategories.subCategoryData[indexOfParent].data[indexOfSubCategory - 1];
        navigation.dispatch(StackActions.popToTop);
        navigation.navigate(
          dataOfMedia.type == 'Image' ? 'imagedetail' : 'videodetail',
          {
            categoryId: dataOfMedia.parent_id,
            subCategoryId: dataOfMedia.id,
            subCategoryName: dataOfMedia.name,
            mediaType: dataOfMedia.type
          }
        )
      }
      else {
        Alert.alert('Someting went wrong..!!');
        setPrevDisabled(true)
      }
    }
    else {
      let newParentId = parentId - 1;
      if (newParentId > 0) {
        await subCategories.getSubCategoryData(newParentId);
        let indexOfNewParent = subCategories.subCategoryData.findIndex(x => x.parentId == newParentId);
        if (indexOfNewParent != -1) {
          subCategories.clearSubCategoryMedia();
          let lengthOfNextSubCategory = subCategories.subCategoryData[indexOfNewParent].data.length - 1;
          let dataOfMedia = subCategories.subCategoryData[indexOfNewParent].data[lengthOfNextSubCategory];
          navigation.dispatch(StackActions.popToTop);
          navigation.navigate(
            dataOfMedia.type == 'Image' ? 'imagedetail' : 'videodetail',
            {
              categoryId: dataOfMedia.parent_id,
              subCategoryId: dataOfMedia.id,
              subCategoryName: dataOfMedia.name,
              mediaType: dataOfMedia.type
            }
          )
        }
        else {
          Alert.alert('Someting went wrong..!!');
          setPrevDisabled(true)
        }
      }
    }

  }

  return (
    <View style={NavButtonView}>
      {/* Prev button */}
      <NavButton
        buttonStyle={[NavButtonPrev, { opacity: prevDisabled ? 0.5 : 1 }]}
        icon='back'
        disabled={prevDisabled}
        iconStyle={NavIconPrev}
        buttonText='PREV'
        textStyle={NavPrevText}
        onPress={() => PrevPress()}
      />
      {/* Next Button */}
      <NavButton
        buttonStyle={[NavButtonNext, { opacity: nextDisabled ? 0.5 : 1 }]}
        icon='next'
        disabled={nextDisabled}
        iconStyle={NavIconNext}
        buttonText='NEXT'
        textStyle={NavNextText}
        onPress={() => NextPress()}
      />
    </View>
  )
})