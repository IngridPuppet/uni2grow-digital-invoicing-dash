import Header from './components/Header'

import { Route, Routes, Navigate } from "react-router-dom"
import NotFound from "./pages/_errors/NotFound"

import './App.scss'
import ShowInvoices from './pages/invoices/ShowInvoices'
import ShowItems from './pages/items/ShowItems'
import ShowCustomers from './pages/customers/ShowCustomers'
import ShowAddresses from './pages/addresses/ShowAddresses'

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Navigate to="/invoices" replace />}></Route>

        <Route path="/invoices" element={<ShowInvoices />}></Route>
        <Route path="/items" element={<ShowItems />}></Route>
        <Route path="/customers" element={<ShowCustomers />}></Route>
        <Route path="/addresses" element={<ShowAddresses />}></Route>

        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </>
  )
}

export default App
