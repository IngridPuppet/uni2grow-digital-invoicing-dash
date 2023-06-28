import { SyntheticEvent, useEffect, useState } from "react"
import { useStore } from "@/store"
import axios from "@/services/axios"
import { Invoice } from "@/models"
import { FaArrowRightLong, FaMagnifyingGlass } from 'react-icons/fa6'

import Pager from "@/components/Pager"
import { handyDate, handyMoney } from "@/services/util"

import '../ShowEntities.scss'

export default function ShowInvoices() {
  const [key, setKey] = useState('')
  const [paging, setPaging] = useState({curr: 0, currSize: 0, total: 0})

  const [invoices, setInvoices] = useStore.invoices()

  const load = (page = 0, size = 20) => {
    axios.get(`/invoices/paginated?key=${key}&page=${page}&size=${size}`)
      .then((response) => {
        if (response.status == 200) {
          const data = response.data

          setInvoices((s: any) => ({...s, [page]: data.content}))
          setPaging({ curr: page, currSize: data.numberOfElements, total: data.totalPages })
        }
      })
  }

  useEffect(() => {
    setTimeout(load, 300)
  }, [])

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    setTimeout(load, 300)
    setInvoices(() => ({}))
  }

  return (
    <>
      <main className="container mx-auto p-8">
        <div className="max-w-5xl mx-auto">

          <div className="app-controls mb-8">
            <div className="app-left">
              <button type="button">
                Create an invoice <span className="ml-3"><FaArrowRightLong /></span>
              </button>
            </div>
            <form className="app-search-form" onSubmit={handleSubmit}>
              <input type="text" placeholder="Search by number / customer's name"
                     onChange={(e) => setKey(e.target.value)} />
              <button type="submit"><FaMagnifyingGlass /></button>
            </form>
          </div>

          {
            (invoices[paging.curr] == undefined) ?
              <>
                <div className="font-brand fixed-center text-3xl">Loading...</div>
              </>
              :
              <>
                {
                  (invoices[paging.curr].length == 0) ?
                    <>
                      <div className="font-brand fixed-center text-3xl">Empty</div>
                    </>
                    :
                    <>
                      <div className="table-super-container">
                        <div className="table-container">
                          <table>
                            <thead>
                              <tr>
                                <th scope="col"># Number</th>
                                <th scope="col">Customer</th>
                                <th scope="col">Total</th>
                                <th scope="col">Issue Date ({import.meta.env.VITE_TIMEZONE})</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                invoices[paging.curr].map((invoice: Invoice) =>
                                  <tr key={invoice.id}>
                                    <td className="row-lead">
                                      <span className="bg-slate-100 rounded-full px-2 py-1">
                                        { invoice.number.split('-')[0] }
                                      </span>
                                    </td>
                                    <td>{ invoice?.customer.name ?? "N/A" }</td>
                                    <td>${ handyMoney(invoice.total) }</td>
                                    <td>{ handyDate(invoice.issueDate) }</td>
                                  </tr>
                                )
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="pager-container">
                        <Pager paging={paging} load={load} />
                      </div>
                    </>
                }
              </>
          }
        </div>
      </main>
    </>
  )
}
