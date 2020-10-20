import { SubCategoriesModel, Subcategories } from "./subcategories"

test("can be created", () => {
  const instance: Subcategories = SubCategoriesModel.create({})

  expect(instance).toBeTruthy()
})