import { ActivityLoaderModel, ActivityLoader } from "./activity-loader"

test("can be created", () => {
  const instance: ActivityLoader = ActivityLoaderModel.create({})

  expect(instance).toBeTruthy()
})