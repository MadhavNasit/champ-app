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
    currentSubCategoryIndex: types.optional(types.number, 0),
    subCategoryMedia: types.optional(types.frozen(), []),
    visitedSubCategoryIds: types.optional(types.array(types.frozen()), [])
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    getSubCategoryData: flow(function* getSubCategoryData(parentId: number) {
      try {
        const res = yield api.getSubCategories(parentId);
        if (res.kind === "ok" && res.data.status == 200) {
          if (res.data.ok) {
            let indexOfCategory = findWithAttr(self.subCategoryData, parentId);
            console.tron.log('called with id', parentId, indexOfCategory)
            if (indexOfCategory == -1) {
              self.subCategoryData.push({ parentId: parentId, data: res.data.data.data });
              console.tron.log(self.subCategoryData);
            }
            else {
              self.subCategoryData[indexOfCategory] = { parentId: parentId, data: res.data.data.data };
              console.tron.log(self.subCategoryData);
            }
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

    getCurrentSubCategories(parentId: number) {
      let indexOfObject = findWithAttr(self.subCategoryData, parentId);
      self.currentSubCategories = self.subCategoryData[indexOfObject].data;
    },

    setCurrentSubCategoryIndex(index: number) {
      self.currentSubCategoryIndex = index;
    },

    getSubCategoryMedia(subCategoryId: number) {
      const indexOfsubCategory = self.currentSubCategories.findIndex(x => x.id == subCategoryId);
      console.tron.log(self.currentSubCategories[indexOfsubCategory].type);
      if (self.currentSubCategories[indexOfsubCategory].type != 'None') {
        self.subCategoryMedia = self.currentSubCategories[indexOfsubCategory].media;
      }
      else {
        self.subCategoryMedia = [];
      }
      console.tron.log(self.subCategoryMedia);
    },

    setSubCategoryVisited(parentId: number, subCategoryId: number) {
      if (self.visitedSubCategoryIds.indexOf(subCategoryId) === -1) {
        self.visitedSubCategoryIds.push(subCategoryId);
      }
    },

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
