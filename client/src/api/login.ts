import { apiClient } from "./client"

export interface LoginRole {
  id: number
  name: string
  description: string | null
  createdAt: string
}

export interface LoginUser {
  id: number
  email: string
  fullName: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  role: LoginRole
}

export interface LoginResponse {
  token: string
  user: LoginUser
}

export async function loginByEmail(email: string) {
  return apiClient.post("auth/login", { json: { email } }).json<LoginResponse>()
}
