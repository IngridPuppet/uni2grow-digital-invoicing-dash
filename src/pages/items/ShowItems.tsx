import { useEffect, useState } from "react"
import { useStore } from "@/store"
import axios from "@/services/axios"
import { Item } from "@/models"
import { FaArrowRightLong, FaMagnifyingGlass } from 'react-icons/fa6'

import Pager from "@/components/Pager"

import '../ShowEntities.scss'

export default function ShowItems() {
  const [key, setKey] = useState('')
  const [paging, setPaging] = useState({curr: 0, currSize: 0, total: 0})

  const [items, setItems] = useStore.items()

  const load = (page = 0, size = 20) => {
    axios.get(`/items/paginated?key=${key}&page=${page}&size=${size}`)
      .then((response) => {
        if (response.status == 200) {
          const data = response.data

          setItems((s: any) => ({...s, [page]: data.content}))
          setPaging({ curr: page, currSize: data.numberOfElements, total: data.totalPages })
        }
      })
  }

  useEffect(() => {
    setTimeout(load, 300)
  }, [])

  return (
    <>
      <main className="container mx-auto p-8">
        <div className="max-w-3xl mx-auto">

          <div className="app-controls mb-8">
            <div className="app-left">
              <button type="button">
                Add an item <span className="ml-3"><FaArrowRightLong /></span>
              </button>
            </div>
            <form className="app-search-form" onSubmit={(e) => {load(); e.preventDefault()}}>
              <input type="text" placeholder="Search by name"
                     onChange={(e) => setKey(e.target.value)} />
              <button type="submit"><FaMagnifyingGlass /></button>
            </form>
          </div>

          {
            (items[paging.curr] == undefined) ?
              <>
                <div className="font-brand fixed-center text-3xl">Loading...</div>
              </>
              :
              <>
                {
                  (items[paging.curr].length == 0) ?
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
                                <th scope="col">Price</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                items[paging.curr].map((item: Item) =>
                                  <tr key={item.id}>
                                    <td className="row-lead">{ item.name }</td>
                                    <td>${ item.price }</td>
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
