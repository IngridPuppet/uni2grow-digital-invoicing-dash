import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FaTrashCan, FaPencil, FaFloppyDisk, FaArrowLeftLong } from 'react-icons/fa6'
import { useForm, SubmitHandler } from "react-hook-form"
import { Address } from '@/models'

import '../ManageEntity.scss'
import axios from '@/services/axios'
import countries from '@/services/countries'
import Loader from '@/components/Loader'
import { toast } from 'react-hot-toast'

/**
 * This component handles all CRUD operations.
 */

export default function ManageAddress() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(0)
  const [editing, setEditing] = useState(false)

  // Shortcuts
  const creating = () => (id == null)
  const showing = () => (id != null && !editing)

  // React hook form
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Address>({})

  useEffect(() => {
    ;(!creating()) && load()
  }, [location.key])

  const load = () => {
    setLoading((x) => x + 1)
    axios.get(`/addresses/${id}`)
      .then((response) => {
        if (response.status == 200) {
          // Fill form fields
          reset(response.data)
          setLoading((x) => x - 1)
        }
      })
      .catch(() => { navigate('/404') })
  }

  const onSubmit: SubmitHandler<Address> = (data) => {
    const errorMessage = 'Oops, something went wrong!'
    setLoading((x) => x + 1)

    if (creating()) {
      // Send a create request
      axios.post('/addresses', data)
        .then((response) => {
          if (response.status == 201) {
            toast.success('Successfully created!')
            navigate(`/addresses/${response.data.id}`)
          }
        })
        .catch(() => { toast.error(errorMessage, {duration: 12e3}) })
        .finally(() => { setLoading((x) => x - 1) })
    } else {
      // Send an update request
      axios.put(`/addresses/${id}`, data)
        .then((response) => {
          if (response.status == 200) {
            toast.success('Successfully updated!')
            setEditing(false); load()
          }
        })
        .catch(() => { toast.error(errorMessage, {duration: 12e3}) })
        .finally(() => { setLoading((x) => x - 1) })
    }
  }

  const onDelete = () => {
    const errorMessage = 'You should probably not delete this address.'

    if (confirm('Deletion is irreversible. Do you really want to proceed?')) {
      setLoading((x) => x + 1)

      // Send a delete request
      axios.delete(`/addresses/${id}`)
        .then((response) => {
          if (response.status == 200) {
            toast.success('Successfully deleted!')
            navigate(`/addresses`)
          }
        })
        .catch(() => { toast.error(errorMessage, {duration: 12e3}) })
        .finally(() => { setLoading((x) => x - 1) })
    }
  }

  return (
    <>
      <main className={"container mx-auto p-8 app-manage-entity " + (showing() ? "app-showing" : "")}>
        <div className="max-w-xl mx-auto">

          <div className="app-controls mb-4">
            { !editing && <Link to="/addresses"><FaArrowLeftLong /></Link> }
            <div className="hidden md:block my-1">
              { id ? (editing ? "Editing " : "Showing ") : "Adding an " }
              address
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
                showing() &&
                  <>
                    <button onClick={() => setEditing(true)}>
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
                <label>Street</label>
                <input type="text" className="app-field-control"
                {...register('street', {})} />
              </div>

              <div className="app-field">
                <label>City<span className="text-gray-500">*</span></label>
                <input type="text" className="app-field-control"
                {...register('city', {required: true})} />

                { errors.city && <p className="app-field-error">
                  This field is required.
                </p> }
              </div>

              <div className="app-field">
                <label>State</label>
                <input type="text" className="app-field-control"
                {...register('state', {})} />
              </div>

              <div className="app-field">
                <label>Country<span className="text-gray-500">*</span></label>
                <select className="app-field-control"
                {...register('country', {required: true})} defaultValue="Cameroon">
                  {
                    countries.map((country, index) => (
                      <option value={country.name} key={index}>{country.name}</option>
                    ))
                  }
                </select>

                { errors.country && <p className="app-field-error">
                  This field is required.
                </p> }
              </div>

              <div className="app-field">
                <label>ZIP Code</label>
                <input type="text" className="app-field-control"
                {...register('zipCode', {
                  pattern: {
                    value: /^[0-9-]+$/,
                    message: 'This field may only contain figures and hyphens.',
                  },
                })} />

                { errors.zipCode && <p className="app-field-error">
                { errors.zipCode.message }
                </p> }
              </div>

            </div>

            <div className="flex items-center py-4">
              <div className="flex-grow">&nbsp;</div>

              {
                editing &&
                  <button className="px-4 app-control-cancel ml-auto"
                          onClick={ () => {setEditing(false); load();} }>
                    Cancel
                  </button>
              }

              {
                (!showing()) &&
                  <button type="submit"><FaFloppyDisk /> Save</button>
              }
            </div>
          </form>

        </div>
      </main>
    </>
  )
}
