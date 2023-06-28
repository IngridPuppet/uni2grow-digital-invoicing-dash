import createStore from 'teaful'

export const { useStore } = createStore({
  items: {},
  customers: {},
  addresses: {},
  invoices: {},
})
