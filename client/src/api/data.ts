import { apiClient } from "./client"

export type ApiDataItem = Record<string, unknown>

export async function getData() {
  return apiClient.get("data").json<ApiDataItem[]>()
}
