import { useEffect, useState } from "react"
import { useStore } from "@/store"
import axios from "@/services/axios"
import { Customer } from "@/models"
import { FaArrowRightLong, FaMagnifyingGlass } from 'react-icons/fa6'

import Pager from "@/components/Pager"
import { handyAddress } from "@/services/util"

import '../ShowEntities.scss'

export default function ShowCustomers() {
  const [key, setKey] = useState('')
  const [paging, setPaging] = useState({curr: 0, currSize: 0, total: 0})

  const [customers, setCustomers] = useStore.customers()

  const load = (page = 0, size = 20) => {
    axios.get(`/customers/paginated?key=${key}&page=${page}&size=${size}`)
      .then((response) => {
        if (response.status == 200) {
          const data = response.data

          setCustomers((s: any) => ({...s, [page]: data.content}))
          setPaging({ curr: page, currSize: data.numberOfElements, total: data.totalPages })
        }
      })
  }

  useEffect(() => {
    setTimeout(load, 300)
  }, [])

  return (
    <>
      <main className="container mx-auto p-8 app-unready">
        <div className="max-w-5xl mx-auto">

          <div className="app-controls mb-8">
            <div className="app-left">
              <button type="button">
                Add a customer <span className="ml-3"><FaArrowRightLong /></span>
              </button>
            </div>
            <form className="app-search-form" onSubmit={(e) => {load(); e.preventDefault()}}>
              <input type="text" placeholder="Search by name / email / phone"
                     onChange={(e) => setKey(e.target.value)} />
              <button type="submit"><FaMagnifyingGlass /></button>
            </form>
          </div>

          {
            (customers[paging.curr] == undefined) ?
              <>
                <div className="font-brand fixed-center text-3xl">Loading...</div>
              </>
              :
              <>
                {
                  (customers[paging.curr].length == 0) ?
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
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Phone</th>
                                <th scope="col">Address</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                customers[paging.curr].map((customer: Customer) =>
                                  <tr key={customer.id}>
                                    <td className="row-lead">{ customer.name }</td>
                                    <td>{ customer.email }</td>
                                    <td>{ customer.phone }</td>
                                    <td>{ handyAddress(customer.address) }</td>
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
