import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const UserAuthModel = types
  .model("UserAuth")
  .props({
    isTokenAvaible: types.optional(types.boolean, false)
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    // Set Boolean true if Token Avaible
    setTokenAvaible() {
      self.isTokenAvaible = true;
    },
    // Set token false if user Logged out
    removeTokenAvaible() {
      self.isTokenAvaible = false;
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

/**
* Un-comment the following to omit model attributes from your snapshots (and from async storage).
* Useful for sensitive data like passwords, or transitive state like whether a modal is open.

* Note that you'll need to import `omit` from ramda, which is already included in the project!
*  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
*/

type UserAuthType = Instance<typeof UserAuthModel>
export interface UserAuth extends UserAuthType { }
type UserAuthSnapshotType = SnapshotOut<typeof UserAuthModel>
export interface UserAuthSnapshot extends UserAuthSnapshotType { }
