import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ApiDataModel } from "../api-data/api-data"
import { UserAuthModel } from "../user-auth/user-auth"

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model("RootStore").props({
  userAuth: types.optional(UserAuthModel, {}),
  apiData: types.optional(ApiDataModel, {})
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> { }

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> { }
