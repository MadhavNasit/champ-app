import { database } from "firebase";
import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { type } from "ramda";
import { async } from "validate.js";
import { Api } from "../../services/api";

const api = new Api();
api.setup();
/**
 * Model description here for TypeScript hints.
 */
export const ApiDataModel = types
  .model("ApiData")
  .props({
    categoryData: types.optional(types.frozen(), []),
    mainCategory: types.optional(types.frozen(), []),
    subCategory: types.optional(types.frozen(), []),
    subCategoriesIndex: types.optional(types.number, 0)
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({

    getCategoryData: flow(function* getCategoryData() {
      try {
        const res = yield api.getCategories();
        if (res.kind === "ok" && res.data.status == 200) {
          if (res.data.ok) {
            self.categoryData = res.data.data.data;
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

    getCategories() {
      const Categories = (raw) => {
        return {
          id: raw.id,
          name: raw.name
        }
      }
      try {
        const rawData = self.categoryData
        const categories = rawData.map(Categories)
        self.mainCategory = categories;
      }
      catch {
        console.log('Error');
      }
    },

    getSubCategories(parentId: number) {
      const SubCategories = (raw) => {
        return {
          id: raw.id,
          parent_id: raw.parent_id,
          name: raw.name,
          icon: raw.icon,
          type: raw.type
        }
      }
      try {
        let index = self.categoryData.findIndex(x => x.id == parentId);
        const rawData = self.categoryData[index].children;
        const subCategories = rawData.map(SubCategories)
        self.subCategory = subCategories;
      }
      catch {
        console.log('Error');
      }
    },
    setSubCategoryIndex(index: number) {
      self.subCategoriesIndex = index;
    }
  }))

// eslint-disable-line @typescript-eslint/no-unused-vars

/**
* Un-comment the following to omit model attributes from your snapshots (and from async storage).
* Useful for sensitive data like passwords, or transitive state like whether a modal is open.

* Note that you'll need to import `omit` from ramda, which is already included in the project!
*  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
*/

type ApiDataType = Instance<typeof ApiDataModel>
export interface ApiData extends ApiDataType { }
type ApiDataSnapshotType = SnapshotOut<typeof ApiDataModel>
export interface ApiDataSnapshot extends ApiDataSnapshotType { }
