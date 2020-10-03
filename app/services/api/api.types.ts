import { GeneralApiProblem } from "./api-problem"

export interface User {
  id: number
  name: string
}

export interface Category {
  id: number,
  name: string,
  has_child: boolean,
  children: SubCategoryList[]
}

export interface SubCategoryList {
  id: number,
  parent_id: number,
  name: string,
  icon: string,
  type: string,
}

export type GetUsersResult = { kind: "ok"; users: User[] } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; user: User } | GeneralApiProblem
export type GetCategories = { kind: 'ok', data: any } | GeneralApiProblem
