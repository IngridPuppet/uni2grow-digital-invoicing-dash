import './Header.scss'

import { NavLink } from "react-router-dom"

export default function Header () {
  return (
    <>
      <div className="app-header container mx-auto px-4">
        <div className="flex items-center rounded px-4 py-2 my-4 bg-gray-100">

          <div className="text-2xl font-brand font-bold text-purple-900">
            DigitalInvoicing.
          </div>

          <div className="hidden md:flex items-center app-menu ml-8">
            <NavLink to="/invoices" className="app-menu-item">
              Invoices
            </NavLink>
            <NavLink to="/items" className="app-menu-item">
              Items
            </NavLink>
            <NavLink to="/customers" className="app-menu-item">
              Customers
            </NavLink>
            <NavLink to="/addresses" className="app-menu-item">
              Addresses
            </NavLink>
          </div>

        </div>
      </div>
    </>
  )
}
