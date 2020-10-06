import { GeneralApiProblem } from "./api-problem"

export interface User {
  id: number
  name: string
}

export type GetUsersResult = { kind: "ok"; users: User[] } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; user: User } | GeneralApiProblem
export type GetCategories = { kind: 'ok', data: any } | GeneralApiProblem
export type GetSubCategories = { kind: 'ok', data: any } | GeneralApiProblem
