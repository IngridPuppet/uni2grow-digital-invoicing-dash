import { Address } from "@/models"

export const handyAddress = (address: Address): string | null => {
  const city = address.city ? address.city + ", " : ""
  const country = address.country ?? ""
  const res = city + country

  return (res == "") ? null : res
}
