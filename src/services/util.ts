import { Address } from "@/models"

export const handyAddress = (address: Address): string => {
  const city = address.city ? address.city + ", " : ""
  const country = address.country ?? ""

  return city + country
}
