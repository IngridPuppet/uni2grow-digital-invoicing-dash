import Header from './components/Header'
import { Toaster } from 'react-hot-toast'

import { Route, Routes, Navigate } from "react-router-dom"
import NotFound from "./pages/_errors/NotFound"

import './App.scss'
import ShowInvoices from './pages/invoices/ShowInvoices'
import ShowItems from './pages/items/ShowItems'
import ManageItem from './pages/items/ManageItem'
import ShowCustomers from './pages/customers/ShowCustomers'
import ShowAddresses from './pages/addresses/ShowAddresses'
import ManageAddress from './pages/addresses/ManageAddress'

function App() {
  return (
    <>
      <Toaster
        containerClassName="app-toaster"
        position="top-right"
        reverseOrder={false}
      />

      <Header />

      <Routes>
        <Route path="/" element={<Navigate to="/invoices" replace />}></Route>

        <Route path="/invoices" element={<ShowInvoices />}></Route>

        <Route path="/items" element={<ShowItems />}></Route>
        <Route path="/items/:id" element={<ManageItem />}></Route>
        <Route path="/items/new" element={<ManageItem />}></Route>

        <Route path="/customers" element={<ShowCustomers />}></Route>

        <Route path="/addresses" element={<ShowAddresses />}></Route>
        <Route path="/addresses/:id" element={<ManageAddress />}></Route>
        <Route path="/addresses/new" element={<ManageAddress />}></Route>

        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </>
  )
}

export default App
