import { UserAuthModel, UserAuth } from "./user-auth"

test("can be created", () => {
  const instance: UserAuth = UserAuthModel.create({})

  expect(instance).toBeTruthy()
})