export interface Item {
  id: number
  name: string
  price: number
}

export interface Page<T> {
  content: T[]
  pageable: any
  number: number
  numberOfElements: number
  totalPages: number
  totalElements: number
}
