import { VisitedSubcategoriesModel, VisitedSubcategories } from "./visited-subcategories"

test("can be created", () => {
  const instance: VisitedSubcategories = VisitedSubcategoriesModel.create({})

  expect(instance).toBeTruthy()
})