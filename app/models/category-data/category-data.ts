import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { Api } from "../../services/api";


const api = new Api();
api.setup();
/**
 * Model description here for TypeScript hints.
 */
export const CategoryDataModel = types
  .model("CategoryData")
  .props({
    mainCategoryData: types.optional(types.frozen(), []),
    loading: types.optional(types.boolean, false)
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    // get category data
    getCategoryData: flow(function* getCategoryData() {
      self.loading = true;
      try {
        const res = yield api.getCategories();
        if (res.kind === "ok" && res.data.status == 200) {
          if (res.data.ok) {
            self.mainCategoryData = res.data.data.data;
            self.loading = false;
          }
          return { response: true, message: "data Found" };
        }
        else {
          self.loading = false;
          return { response: false, message: "Something went wrong." };
        }
      } catch (error) {
        self.loading = false;
        return { response: false, message: "Something went wrong." };
      }
    }),

    // clear sub category data
    clearCategoryData() {
      self.mainCategoryData = [];
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

/**
* Un-comment the following to omit model attributes from your snapshots (and from async storage).
* Useful for sensitive data like passwords, or transitive state like whether a modal is open.

* Note that you'll need to import `omit` from ramda, which is already included in the project!
*  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
*/

type CategoryDataType = Instance<typeof CategoryDataModel>
export interface CategoryData extends CategoryDataType { }
type CategoryDataSnapshotType = SnapshotOut<typeof CategoryDataModel>
export interface CategoryDataSnapshot extends CategoryDataSnapshotType { }
