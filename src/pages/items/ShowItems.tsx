import { useEffect, useState } from "react"
import { useStore } from "@/store"
import axios from "@/services/axios"
import { Item } from "@/models"

export default function ShowItems() {
  const [key, setKey] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [paging, setPaging] = useState({curr: 0, total: 0})

  const [items, setItems] = useStore.items()

  const load = (page = 0, size = 30) => {
    setLoading(true)

    axios.get(`/items/paginated?key=${key}&page=${page}&size=${size}`)
      .then((response) => {
        if (response.status == 200) {
          const data = response.data

          setItems((s: any) => ({...s, [page]: data.content}))
          setPaging({ curr: page, total: data.totalPages })
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <>
      <main className="container mx-auto p-8 text-3xl">
        {
          isLoading ?
            <>
              Loading...
            </>
            :
            <>
              <div onClick={() => load((paging.curr + 1) % paging.total)} >Show items ({paging.total})</div>
              {
                items[paging.curr]?.map((item: Item) => <div key={item.id}>{item.name}</div>)
              }
            </>
        }
      </main>
    </>
  )
}
