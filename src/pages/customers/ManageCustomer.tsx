import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FaTrashCan, FaPencil, FaFloppyDisk, FaArrowLeftLong } from 'react-icons/fa6'
import { useForm, SubmitHandler } from "react-hook-form"
import { Customer, Address } from '@/models'

import '../ManageEntity.scss'
import axios from '@/services/axios'
import Loader from '@/components/Loader'
import { handyLongAddress } from '@/services/util'
import { toast } from 'react-hot-toast'

/**
 * This component handles all CRUD operations.
 */

export default function ManageCustomer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(0)
  const [editable, setEditable] = useState(false)

  // Selects. Okay, these should be autocompleted :-(
  const [addresses, setAddresses] = useState<Address[]>([])

  // React hook form
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Customer>()

  useEffect(() => {
    loadSelects()

    // Wait synchronously for selects to load
    // before attempting to load current entity
    // if any. This works around a "bug" in
    // react-hook-form.
    while (loading > 0);
    ;(id != null) && load()
  }, [location.key])

  const load = () => {
    setLoading((x) => x + 1)
    axios.get(`/customers/${id}`)
      .then((response) => {
        if (response.status == 200) {
          // Fill form fields
          reset(response.data)
          setLoading((x) => x - 1)
        }
      })
      .catch(() => { navigate('/404') })
  }

  const loadSelects = () => {
    setLoading((x) => x + 1)

    axios.get(`/addresses`)
      .then((response) => {
        if (response.status == 200) {
          setAddresses(response.data)
          setLoading((x) => x - 1)
        }
      })
  }

  const onSubmit: SubmitHandler<Customer> = (data: any) => {
    const errorMessage = 'Oops, something went wrong!\n'
                       + 'Some fields may be required unique.'
    setLoading((x) => x + 1)

    // Set whole object to null if address unset
    if (data.address.id == "") {
      delete data.address
    }

    if (id == null) {
      // Send a create request
      axios.post('/customers', data)
        .then((response) => {
          if (response.status == 201) {
            toast.success('Successfully created!')
            navigate(`/customers/${response.data.id}`)
          }
        })
        .catch(() => { toast.error(errorMessage, {duration: 12e3}) })
        .finally(() => { setLoading((x) => x - 1) })
    } else {
      // Send an update request
      axios.put(`/customers/${id}`, data)
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
    const errorMessage = 'You should probably not delete this customer.'

    if (confirm('Deletion is irreversible. Do you really want to proceed?')) {
      setLoading((x) => x + 1)

      // Send a delete request
      axios.delete(`/customers/${id}`)
        .then((response) => {
          if (response.status == 200) {
            toast.success('Successfully deleted!')
            navigate(`/customers`)
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
            { !editable && <Link to="/customers"><FaArrowLeftLong /></Link> }
            <div className="hidden md:block my-1">
              { id ? (editable ? "Editing " : "Showing ") : "Adding a " }
              customer
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
                <label>Email</label>
                <input type="email" className="app-field-control"
                {...register('email', { setValueAs: (v) => v ? v : undefined })} />
              </div>

              <div className="app-field">
                <label>Phone</label>
                <input type="text" className="app-field-control"
                {...register('phone', {
                  pattern: {
                    value: /^[0-9-()\.\+]+$/,
                    message: 'This field is not a valid phone number.',
                  },
                })} />

                { errors.phone && <p className="app-field-error">
                { errors.phone.message }
                </p> }
              </div>

              <div className="app-field">
                <label>Address</label>
                <select className="app-field-control" defaultValue={undefined}
                {...register('address.id', { })}>
                  <option value={undefined}></option>
                  {
                    addresses.map((address) => (
                      <option value={address.id} key={address.id}>{handyLongAddress(address)}</option>
                    ))
                  }
                </select>
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
