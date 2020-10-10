import { NavButtonModel, NavButton } from "./nav-button"

test("can be created", () => {
  const instance: NavButton = NavButtonModel.create({})

  expect(instance).toBeTruthy()
})