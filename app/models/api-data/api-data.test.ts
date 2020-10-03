import { ApiDataModel, ApiData } from "./api-data"

test("can be created", () => {
  const instance: ApiData = ApiDataModel.create({})

  expect(instance).toBeTruthy()
})