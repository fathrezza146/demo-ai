import ky from "ky"

const rawBaseUrl = process.env.REACT_APP_API_BASE_URL?.trim()
const baseUrl = rawBaseUrl && rawBaseUrl.length > 0 ? rawBaseUrl : window.location.origin
const normalizedBaseUrl = baseUrl.replace(/\/+$/, "")

export const apiClient = ky.create({
  prefixUrl: `${normalizedBaseUrl}/api`,
  credentials: "include",
  timeout: 10000,
})
