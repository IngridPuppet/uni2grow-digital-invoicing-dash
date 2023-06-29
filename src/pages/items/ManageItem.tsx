import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FaTrashCan, FaPencil, FaFloppyDisk, FaArrowLeftLong } from 'react-icons/fa6'
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
  const location = useLocation()
  const [loading, setLoading] = useState(0)
  const [editable, setEditable] = useState(false)

  // React hook form
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Item>()

  useEffect(() => {
    ;(id != null) && load()
  }, [location.key])

  const load = () => {
    setLoading((x) => x + 1)
    axios.get(`/items/${id}`)
      .then((response) => {
        if (response.status == 200) {
          // Fill form fields
          reset(response.data)
          setLoading((x) => x - 1)
        }
      })
      .catch(() => { navigate('/404') })
  }

  const onSubmit: SubmitHandler<Item> = (data) => {
    const errorMessage = 'Oops, something went wrong!\n'
                       + 'Some fields may be required unique.'
    setLoading((x) => x + 1)

    if (id == null) {
      // Send a create request
      axios.post('/items', data)
        .then((response) => {
          if (response.status == 201) {
            toast.success('Successfully created!')
            navigate(`/items/${response.data.id}`)
          }
        })
        .catch(() => { toast.error(errorMessage, {duration: 12e3}) })
        .finally(() => { setLoading((x) => x - 1) })
    } else {
      // Send an update request
      axios.put(`/items/${id}`, data)
        .then((response) => {
          if (response.status == 200) {
            toast.success('Successfully updated!')
            setEditable(false); load()
          }
        })
        .catch(() => { toast.error(errorMessage, {duration: 12e3}) })
        .finally(() => { setLoading((x) => x - 1) })
    }
  }

  const onDelete = () => {
    const errorMessage = 'You should probably not delete this item.'

    if (confirm('Deletion is irreversible. Do you really want to proceed?')) {
      setLoading((x) => x + 1)

      // Send a delete request
      axios.delete(`/items/${id}`)
        .then((response) => {
          if (response.status == 200) {
            toast.success('Successfully deleted!')
            navigate(`/items`)
          }
        })
        .catch(() => { toast.error(errorMessage, {duration: 12e3}) })
        .finally(() => { setLoading((x) => x - 1) })
    }
  }

  return (
    <>
      <main className={"container mx-auto p-8 app-show-entity " +
                       (id != null ? (editable ? "app-editable" : "app-showing") : "app-creation")}>
        <div className="max-w-xl mx-auto">

          <div className="app-controls mb-4">
            { !editable && <Link to="/items"><FaArrowLeftLong /></Link> }
            <div className="hidden md:block my-1">
              { id ? (editable ? "Editing " : "Showing ") : "Adding an " }
              item
              { id ? ` #${id}` : "" }
            </div>
            {
              !!loading &&
                <div className="app-loader text-2xl ml-4">
                  <Loader />
                </div>
            }

            <div className="app-right">
              {
                (id != null && !editable) &&
                  <>
                    <button onClick={() => setEditable(true)}>
                      <FaPencil /> Edit
                    </button>

                    <button className="app-control-delete"
                            onClick={onDelete}>
                      <FaTrashCan /> Delete
                    </button>
                  </>
              }
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="app-fields">

              <div className="app-field">
                <label>Name<span className="text-gray-500">*</span></label>
                <input type="text" className="app-field-control"
                {...register('name', {required: true})} />

                { errors.name && <p className="app-field-error">
                  This field is required.
                </p> }
              </div>

              <div className="app-field">
                <label>Price<span className="text-gray-500">*</span></label>
                <input type="number" step="0.01" className="app-field-control"
                {...register('price', {required: true, min: 0})} />

                { errors.price && <p className="app-field-error">
                  This field is required and must be positive.
                </p> }
              </div>

            </div>

            <div className="flex items-center py-4">
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
