import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const ActivityLoaderModel = types
  .model("ActivityLoader")
  .props({
    loading: types.optional(types.boolean, false)
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    setLoading(isLoading: boolean) {
      self.loading = isLoading;
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

/**
* Un-comment the following to omit model attributes from your snapshots (and from async storage).
* Useful for sensitive data like passwords, or transitive state like whether a modal is open.

* Note that you'll need to import `omit` from ramda, which is already included in the project!
*  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
*/

type ActivityLoaderType = Instance<typeof ActivityLoaderModel>
export interface ActivityLoader extends ActivityLoaderType { }
type ActivityLoaderSnapshotType = SnapshotOut<typeof ActivityLoaderModel>
export interface ActivityLoaderSnapshot extends ActivityLoaderSnapshotType { }
