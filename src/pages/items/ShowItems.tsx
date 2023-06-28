import { useEffect, useState } from "react"
import { useStore } from "@/store"
import axios from "@/services/axios"
import { Item } from "@/models"

import Pager from "@/components/Pager"

import '../ShowEntities.scss'

export default function ShowItems() {
  const [key, setKey] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [paging, setPaging] = useState({curr: 0, currSize: 0, total: 0})

  const [items, setItems] = useStore.items()

  const load = (page = 0, size = 20) => {
    setLoading(true)

    axios.get(`/items/paginated?key=${key}&page=${page}&size=${size}`)
      .then((response) => {
        if (response.status == 200) {
          const data = response.data

          setItems((s: any) => ({...s, [page]: data.content}))
          setPaging({ curr: page, currSize: data.numberOfElements, total: data.totalPages })
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    setTimeout(load, 0e3)
  }, [])

  return (
    <>
      <main className="container mx-auto p-8">
        <div className="max-w-3xl mx-auto">
          {
            (paging.currSize == 0) && (isLoading || items[paging.curr] == undefined) ?
              <>
                <div className="font-brand fixed-center text-3xl">Loading...</div>
              </>
              :
              <>
                {
                  paging.currSize == 0 ?
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
                                    <td scope="row" className="row-lead">{ item.name }</td>
                                    <td>${ item.price }</td>
                                  </tr>
                                )
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="pager-container text-sm">
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
