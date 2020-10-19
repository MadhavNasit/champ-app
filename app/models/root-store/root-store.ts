import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ActivityLoaderModel } from "../activity-loader/activity-loader"
import { CategoryDataModel } from "../category-data/category-data"
import { SubCategoriesModel } from "../subcategories/subcategories"
import { UserAuthModel } from "../user-auth/user-auth"
import { VisitedSubcategoriesModel } from "../visited-subcategories/visited-subcategories"

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model("RootStore").props({
  userAuth: types.optional(UserAuthModel, {}),
  categoryData: types.optional(CategoryDataModel, {}),
  subCategories: types.optional(SubCategoriesModel, {}),
  activityLoader: types.optional(ActivityLoaderModel, {}),
  visitedSubcategories: types.optional(VisitedSubcategoriesModel, {})
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> { }

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> { }
