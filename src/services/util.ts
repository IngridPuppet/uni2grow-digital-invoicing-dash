import { Address } from '@/models'
import { DateTime } from 'luxon'

export const handyAddress = (address: Address): string | null => {
  const city = address.city ? address.city + ", " : ""
  const country = address.country ?? ""
  const res = city + country

  return (res == "") ? null : res
}

export const handyLongAddress = (address : Address | null): string => {
  if (address == undefined || address == null) {
    return ""
  }

  const street = address.street ? address.street + ", " : ""
  const city = address.city ? address.city + ", " : ""
  const state = address.state ? address.state + ", " : ""
  const country = address.country

  return street + city + state + country
}

export const handyMoney = (money: number): string => {
  if (money == undefined || money == null) {
    return (0).toFixed(2)
  }

  let res = +(money.toFixed(2))
  if (money - res > 0) {
    res += 0.011
  }

  return res.toFixed(2)
}

export const handyDate = (date: string, withSeconds: boolean = false): string => {
  if (!date) {
    return ""
  }

  return DateTime.fromISO(date).setLocale('en').setZone(import.meta.env.VITE_TIMEZONE)
    .toLocaleString(withSeconds ? DateTime.DATETIME_MED_WITH_SECONDS : DateTime.DATETIME_MED)
}
