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
    subCategoryData: types.optional(types.array(types.frozen()), []),
    currentSubCategories: types.optional(types.frozen(), []),
    subCategoryMedia: types.optional(types.frozen(), []),
    loading: types.optional(types.boolean, false)
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    // Api call for sub category and add it to array
    getSubCategoryData: flow(function* getSubCategoryData(parentId: number) {
      try {
        self.loading = true;
        const res = yield api.getSubCategories(parentId);
        if (res.kind === "ok" && res.data.status == 200) {
          if (res.data.ok) {
            let indexOfCategory = findWithAttr(self.subCategoryData, parentId);
            if (indexOfCategory == -1) {
              self.subCategoryData.push({ parentId: parentId, data: res.data.data.data });
            }
            else {
              self.subCategoryData[indexOfCategory] = { parentId: parentId, data: res.data.data.data };
            }
          }
        }
        else {
          return { response: false, message: "Something went wrong." };
        }
        self.loading = false;
      } catch (error) {
        self.loading = false;
        return { response: false, message: "Something went wrong." };
      }
      self.loading = false;
      return { response: false, message: "Something went wrong." };
    }),

    // list of current sub categorie
    getCurrentSubCategories(parentId: number) {
      let indexOfObject = findWithAttr(self.subCategoryData, parentId);
      self.currentSubCategories = self.subCategoryData[indexOfObject].data;
    },

    // set focused screen media
    getSubCategoryMedia(subCategoryId: number) {
      const indexOfsubCategory = self.currentSubCategories.findIndex(x => x.id == subCategoryId);
      if (self.currentSubCategories[indexOfsubCategory].type != 'None') {
        self.subCategoryMedia = self.currentSubCategories[indexOfsubCategory].media;
      }
      else {
        self.subCategoryMedia = [];
      }
    },

    // clear data on focused out
    clearCurrentSubCategory() {
      self.currentSubCategories = [];
    },

    clearSubCategoryMedia() {
      self.subCategoryMedia = [];
    }

  })) // eslint-disable-line @typescript-eslint/no-unused-vars

/**
* Un-comment the following to omit model attributes from your snapshots (and from async storage).
* Useful for sensitive data like passwords, or transitive state like whether a modal is open.

* Note that you'll need to import `omit` from ramda, which is already included in the project!
*  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
*/
function findWithAttr(array, parentId) {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i].parentId == parentId) {
      return i;
    }
  }
  return -1;
}

type SubcategoriesType = Instance<typeof SubCategoriesModel>
export interface Subcategories extends SubcategoriesType { }
type SubcategoriesSnapshotType = SnapshotOut<typeof SubCategoriesModel>
export interface SubcategoriesSnapshot extends SubcategoriesSnapshotType { }
