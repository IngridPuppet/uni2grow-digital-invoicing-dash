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
  address : Address
}

export interface Address {
  id: number
  street: string
  city: string
  state: string
  country: string
  zipCode: string
}

export interface Page<T> {
  content: T[]
  pageable: any
  number: number
  numberOfElements: number
  totalPages: number
  totalElements: number
}
