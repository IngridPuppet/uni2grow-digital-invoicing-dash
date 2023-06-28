import { SyntheticEvent, useEffect, useState } from "react"
import { useStore } from "@/store"
import axios from "@/services/axios"
import { Address } from "@/models"
import { FaArrowRightLong, FaMagnifyingGlass } from 'react-icons/fa6'

import Pager from "@/components/Pager"

import '../ShowEntities.scss'

export default function ShowAddresses() {
  const [key, setKey] = useState('')
  const [paging, setPaging] = useState({curr: 0, currSize: 0, total: 0})

  const [addresses, setAddresses] = useStore.addresses()

  const load = (page = 0, size = 20) => {
    axios.get(`/addresses/paginated?key=${key}&page=${page}&size=${size}`)
      .then((response) => {
        if (response.status == 200) {
          const data = response.data

          setAddresses((s: any) => ({...s, [page]: data.content}))
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
    setAddresses(() => ({}))
  }

  return (
    <>
      <main className="container mx-auto p-8 app-unready">
        <div className="max-w-5xl mx-auto">

          <div className="app-controls mb-8">
            <div className="app-left">
              <button type="button">
                Add an address <span className="ml-3"><FaArrowRightLong /></span>
              </button>
            </div>
            <form className="app-search-form" onSubmit={handleSubmit}>
              <input type="text" placeholder="Search by any property"
                     onChange={(e) => setKey(e.target.value)} />
              <button type="submit"><FaMagnifyingGlass /></button>
            </form>
          </div>

          {
            (addresses[paging.curr] == undefined) ?
              <>
                <div className="font-brand fixed-center text-3xl">Loading...</div>
              </>
              :
              <>
                {
                  (addresses[paging.curr].length == 0) ?
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
                                <th scope="col" style={{maxWidth: "10rem", wordWrap: "break-word"}}>Country</th>
                                <th scope="col">State</th>
                                <th scope="col">City</th>
                                <th scope="col">Street</th>
                                <th scope="col">ZIP Code</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                addresses[paging.curr].map((address: Address) =>
                                  <tr key={address.id}>
                                    <td style={{maxWidth: "10rem", wordWrap: "break-word"}}>{ address.country}</td>
                                    <td>{ address.state ?? "N/A" }</td>
                                    <td>{ address.city ?? "N/A" }</td>
                                    <td>{ address.street ?? "N/A" }</td>
                                    <td>{ address.zipCode ?? "N/A" }</td>
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
