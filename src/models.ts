export interface Item {
  id: number
  name: string
  price: number
}

export interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address: Address | null
}

export interface Address {
  id: number
  street: string
  city: string
  state: string
  country: string
  zipCode: string
}

export interface RelInvoiceItem {
  id: number
  item: Item
  quantity: number
  priceOfRecord: number
}

export interface Invoice {
  id: number
  number: string
  total: number
  issueDate: string
  customer: Customer
  billingAddress: Address
  relInvoiceItems: RelInvoiceItem[]
}
