import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const VisitedSubcategoriesModel = types
  .model("VisitedSubcategories")
  .props({
    currentSubCategoryIndex: types.optional(types.number, 0),
    visitedSubCategoryIds: types.optional(types.array(types.frozen()), [])
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({

    setCurrentSubCategoryIndex(index: number) {
      self.currentSubCategoryIndex = index;
    },

    setSubCategoryVisited(mediaId: number) {
      if (self.visitedSubCategoryIds.indexOf(mediaId) === -1) {
        self.visitedSubCategoryIds.push(mediaId);
        console.tron.log('set', self.visitedSubCategoryIds)
      }
    },

    removeSubCategoryVisited(mediaId: number) {
      let index = self.visitedSubCategoryIds.indexOf(mediaId);
      self.visitedSubCategoryIds.splice(index, 1);
      console.tron.log('remove', self.visitedSubCategoryIds)
    },

  })) // eslint-disable-line @typescript-eslint/no-unused-vars

/**
* Un-comment the following to omit model attributes from your snapshots (and from async storage).
* Useful for sensitive data like passwords, or transitive state like whether a modal is open.

* Note that you'll need to import `omit` from ramda, which is already included in the project!
*  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
*/

type VisitedSubcategoriesType = Instance<typeof VisitedSubcategoriesModel>
export interface VisitedSubcategories extends VisitedSubcategoriesType { }
type VisitedSubcategoriesSnapshotType = SnapshotOut<typeof VisitedSubcategoriesModel>
export interface VisitedSubcategoriesSnapshot extends VisitedSubcategoriesSnapshotType { }
