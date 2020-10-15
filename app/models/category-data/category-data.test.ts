import { CategoryDataModel, CategoryData } from "./category-data"

test("can be created", () => {
  const instance: CategoryData = CategoryDataModel.create({})

  expect(instance).toBeTruthy()
})