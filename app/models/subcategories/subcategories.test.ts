import { SubcategoriesModel, Subcategories } from "./subcategories"

test("can be created", () => {
  const instance: Subcategories = SubcategoriesModel.create({})

  expect(instance).toBeTruthy()
})