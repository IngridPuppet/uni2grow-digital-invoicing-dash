import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FaTrashCan, FaPencil, FaFloppyDisk } from 'react-icons/fa6'
import { useForm, SubmitHandler } from "react-hook-form"
import { Item } from '@/models'

import '../ManageEntity.scss'
import axios from '@/services/axios'
import Loader from '@/components/Loader'
import { toast } from 'react-hot-toast'

/**
 * This component handles all CRUD operations.
 */

export default function ManageItem() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [editable, setEditable] = useState(false)

  // React hook form
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Item>()

  useEffect(() => {
    ;(id != null) && load()
  }, [])

  const load = () => {
    axios.get(`/items/${id}`)
      .then((response) => {
        if (response.status == 200) {
          // Fill form fields
          reset(response.data)
        }
      })
      .catch(() => { navigate('/404') })
  }

  const onSubmit: SubmitHandler<Item> = (data) => {
    setLoading(true)

    if (id == null) {
      // Send a create request
      axios.post('/items', data)
        .then((response) => {
          if (response.status == 201) {
            toast.success('Successfully created!')
            navigate(`/items/${response.data.id}`)
          } else {
            toast.error('Oops, something went wrong!')
          }
        })
        .catch(() => { toast.error('Oops, something went wrong!') })
        .finally(() => { setLoading(false) })
    } else {
      // Send an update request
      axios.put(`/items/${id}`, data)
        .then((response) => {
          if (response.status == 200) {
            toast.success('Successfully updated!')
            setEditable(false); load()
          } else {
            toast.error('Oops, something went wrong!')
          }
        })
        .catch(() => { toast.error('Oops, something went wrong!') })
        .finally(() => { setLoading(false) })
    }
  }

  const handleDelete = () => {
    if (confirm('Deletion is irreversible. Proceed?')) {
      // Send an update request
      axios.delete(`/items/${id}`)
        .then((response) => {
          if (response.status == 200) {
            toast.success('Successfully deleted!')
            navigate(`/items`)
          } else {
            toast.error('Oops, something went wrong!')
          }
        })
        .catch(() => { toast.error('Oops, something went wrong!') })
        .finally(() => { setLoading(false) })
    }
  }

  return (
    <>
      <main className={"container mx-auto p-8 app-show-entity"
                      + " " + (id != null ? (editable ? "app-editable" : "app-showing") : "app-creation")}>
        <div className="max-w-xl mx-auto">

          <div className="app-controls mb-4">
            <div className="hidden md:block mt-2">
              { id ? (editable ? "Editing " : "Showing ") : "Creating " }
              item
              { id ? ` #${id}` : "" }
            </div>
            <div className="app-right">
              {
                (id != null && !editable) &&
                  <>
                    <button onClick={() => setEditable(true)}>
                      <FaPencil /> Edit
                    </button>

                    <button className="app-control-delete"
                            onClick={handleDelete}>
                      <FaTrashCan /> Delete
                    </button>
                  </>
              }
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="app-fields">

              <div className="app-field">
                <label>Name</label>
                <input type="text" className="app-field-control"
                {...register('name', {required: true})} />

                { errors.name && <p>This field is required.</p> }
              </div>

              <div className="app-field">
                <label>Price</label>
                <input type="number" step="0.01" className="app-field-control"
                {...register('price', {required: true, min: 0})} />

                { errors.price && <p>This field is required and must be positive.</p> }
              </div>

            </div>

            <div className="flex items-center py-4">
              {
                loading &&
                  <div className="app-loader text-3xl">
                    <Loader />
                  </div>
              }

              <div className="flex-grow">&nbsp;</div>

              {
                editable &&
                  <button className="px-4 app-control-cancel ml-auto"
                          onClick={ () => {setEditable(false); load();} }>
                    Cancel
                  </button>
              }

              {
                (id == null || editable) &&
                  <button type="submit"><FaFloppyDisk /> Save</button>
              }
            </div>
          </form>

        </div>
      </main>
    </>
  )
}