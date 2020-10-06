import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { Api } from "../../services/api";

const api = new Api();
api.setup();
/**
 * Model description here for TypeScript hints.
 */
export const SubCategoriesModel = types
  .model("SubCategories")
  .props({
    subCategory: types.optional(types.frozen(), []),
    subCategoryMedia: types.optional(types.frozen(), [])
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    getSubCategoryData: flow(function* getSubCategoryData(parentId: number) {
      try {
        const res = yield api.getSubCategories(parentId);
        if (res.kind === "ok" && res.data.status == 200) {
          if (res.data.ok) {
            self.subCategory = res.data.data.data;
          }
        }
        else {
          return { response: false, message: "Something went wrong." };
        }
      } catch (error) {
        return { response: false, message: "Something went wrong." };
      }
      return { response: false, message: "Something went wrong." };
    }),

    getSubCategoryMedia(subCategoryId: number) {
      console.tron.log('Subcategory', self.subCategory);
      const indexOfsubCategory = self.subCategory.findIndex(x => x.id == subCategoryId);
      self.subCategoryMedia = self.subCategory[indexOfsubCategory].media;
      console.tron.log('media', self.subCategoryMedia);
    }

  })) // eslint-disable-line @typescript-eslint/no-unused-vars

/**
* Un-comment the following to omit model attributes from your snapshots (and from async storage).
* Useful for sensitive data like passwords, or transitive state like whether a modal is open.

* Note that you'll need to import `omit` from ramda, which is already included in the project!
*  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
*/

type SubcategoriesType = Instance<typeof SubCategoriesModel>
export interface Subcategories extends SubcategoriesType { }
type SubcategoriesSnapshotType = SnapshotOut<typeof SubCategoriesModel>
export interface SubcategoriesSnapshot extends SubcategoriesSnapshotType { }
