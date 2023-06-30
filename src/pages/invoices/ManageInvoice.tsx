import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { FaTrashCan, FaPencil, FaFloppyDisk, FaArrowLeftLong, FaCirclePlus, FaCircleXmark, FaPrint } from 'react-icons/fa6'
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form"
import { Invoice, Address, Customer, Item } from '@/models'

import '../ManageEntity.scss'
import axios from '@/services/axios'
import Loader from '@/components/Loader'
import { handyDate, handyLongAddress, handyMoney } from '@/services/util'
import { toast } from 'react-hot-toast'

import { useReactToPrint } from 'react-to-print'
import PrintableInvoice from './PrintableInvoice'

/**
 * This component handles all CRUD operations.
 */

export default function ManageInvoice() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(0)
  const [editing, setEditing] = useState(false)

  // Shortcuts
  const creating = () => (id == null)
  const showing = () => (id != null && !editing)

  // Selects. Okay, these should be autocompleted :-(
  const [items, setItems] = useState<Item[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])

  // React hook form
  const { control, register, handleSubmit, reset, setValue, getValues, watch, formState: { errors }} = useForm<Invoice>()
  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'relInvoiceItems', // unique name for your Field Array
  })

  // Printing
  let printable = useRef(null) as any
  const handlePrint = useReactToPrint({
    content: () => printable,
    documentTitle: `digital-invoice-${id}`,
    pageStyle: 'print',
  })

  useEffect(() => {
    loadSelects()

    // Add an empty item line if on creation mode
    if ((creating()) && (getValues().relInvoiceItems.length == 0)) {
      manageInventory.onAppend()
    }

    // Wait synchronously for selects to load before attempting to load current entity
    // if any. This works around a "bug" in react-hook-form.
    while (loading > 0); (!creating()) && load()
  }, [location.key])

  const load = () => {
    setLoading((x) => x + 1)
    axios.get(`/invoices/${id}`)
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
    setLoading((x) => x + 3)

    axios.get(`/customers`)
      .then((response) => {
        if (response.status == 200) {
          setCustomers(response.data)
          setLoading((x) => x - 1)
        }
      })

    axios.get(`/addresses`)
      .then((response) => {
        if (response.status == 200) {
          setAddresses(response.data)
          setLoading((x) => x - 1)
        }
      })

    axios.get(`/items`)
      .then((response) => {
        if (response.status == 200) {
          setItems(response.data)
          setLoading((x) => x - 1)
        }
      })
  }

  const manageInventory = {
    onAppend() {
      append({ id: null, quantity: 1, priceOfRecord: 0, item: { id: null } } as any)
    },

    onRemove(index: number)  {
      return () => {
        if (getValues().relInvoiceItems.length > 1) {
          remove(index)
          this.totalize()
        }
      }
    },

    onCustomerChange(e: any) {
      // Pre-fill billing address

      const customerId = parseInt(e.target.value)
      const customer = customers.find((obj) => {
        return obj.id == customerId
      })

      setValue(`billingAddress.id`, customer?.address?.id as any)
    },

    onItemChange(index: number) {
      return (e: any) => {
        // Pre-fill 'price of record' field

        const itemId = parseInt(e.target.value)
        const item = items.find((obj) => {
          return obj.id == itemId
        })

        setValue(`relInvoiceItems.${index}.priceOfRecord`, item?.price ?? 0)
        this.totalize()
      }
    },

    totalize()  {
      let sum = 0
      getValues().relInvoiceItems.map((x) => sum += x.quantity * x.priceOfRecord)
      setValue('total', sum)
    }
  }

  const onSubmit: SubmitHandler<Invoice> = (data: any) => {
    const errorMessage = 'Oops, something went wrong!'
    setLoading((x) => x + 1)

    // Prune data

    if (!data.customer.id) {
      delete data.customer
    }

    if (!data.billingAddress.id) {
      delete data.billingAddress
    }

    // Emit requests

    if (creating()) {
      // Send a create request
      axios.post('/invoices', data)
        .then((response) => {
          if (response.status == 201) {
            toast.success('Successfully created!')
            navigate(`/invoices/${response.data.id}`)
          }
        })
        .catch(() => { toast.error(errorMessage, {duration: 12e3}) })
        .finally(() => { setLoading((x) => x - 1) })
    } else {
      // Send an update request
      axios.put(`/invoices/${id}`, data)
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
    const errorMessage = 'You should probably not delete this invoice.'

    if (confirm('Deletion is irreversible. Do you really want to proceed?')) {
      setLoading((x) => x + 1)

      // Send a delete request
      axios.delete(`/invoices/${id}`)
        .then((response) => {
          if (response.status == 200) {
            toast.success('Successfully deleted!')
            navigate(`/invoices`)
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
            { !editing && <Link to="/invoices"><FaArrowLeftLong /></Link> }
            <div className="hidden md:block my-1">
              { id ? (editing ? "Editing " : "Showing ") : "Creating an " }
              invoice
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
                    <button className="app-control-print" onClick={handlePrint}>
                      <FaPrint /> Print
                    </button>

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

              {
                !(creating()) && <>
                  <div className="app-field">
                    <label>Number</label>
                    <input type="text" className="app-field-control"
                    {...register('number', {})} disabled />
                  </div>
                  <div className="app-field">
                    <label>Issue date</label>
                    <input type="text" className="app-field-control"
                    {...register('issueDate', {})} disabled hidden />
                    <input type="text" className="app-field-control"
                    value={handyDate(getValues().issueDate, true)} disabled />
                  </div>
                </>
              }

              <div className="app-field">
                <label>
                  Customer
                  { (creating()) && <span className="text-gray-500">*</span>}
                </label>
                <select className="app-field-control" defaultValue={undefined}
                {...register('customer.id', { required: (creating()), onChange: manageInventory.onCustomerChange })}>
                  <option hidden value={undefined}></option>
                  {
                    customers.map((customer) => (
                      <option value={customer.id} key={customer.id}>{customer.name}</option>
                    ))
                  }
                </select>

                { errors.customer && <p className="app-field-error">
                  This field is required.
                </p> }
              </div>

              <div className="app-field">
                <label>
                  Billing address
                  { (creating()) && <span className="text-gray-500">*</span>}
                </label>
                <select className="app-field-control" defaultValue={undefined}
                {...register('billingAddress.id', { required: (creating()) })}>
                  <option hidden value={undefined}></option>
                  {
                    addresses.map((address) => (
                      <option value={address.id} key={address.id}>{handyLongAddress(address)}</option>
                    ))
                  }
                </select>

                { errors.billingAddress && <p className="app-field-error">
                  This field is required.
                </p> }
              </div>

              {/* Looping through inventory below */}

              <hr className='border-gray-300 mt-8' />
              <div className='-translate-y-1/2 uppercase text-xs grid grid-cols-4 gap-x-4'>
                <div className='col-span-4 text-center'>
                  <span className='bg-slate-50 px-4 text-gray-700'>Inventory</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-x-4 mt-2 app-inventory">
                <div className="col-span-2"><label>Item</label></div>
                <div className=""><label>Quantity</label></div>
                <div className=""><label>Unit price</label></div>
              </div>

              {
                fields.map((field, index) => (
                  <div className="grid grid-cols-4 gap-x-4 mt-2 app-inventory app-inventory-item" key={field.id}>

                    <div className="app-field col-span-2 flex items-center">
                      {
                        (!showing()) &&
                          <button type="button" onClick={manageInventory.onRemove(index)}>
                            <FaCircleXmark />
                          </button>
                      }

                      <select className="app-field-control" defaultValue={undefined} required
                      {...register(`relInvoiceItems.${index}.item.id`, { onChange: manageInventory.onItemChange(index) })}>
                        <option hidden value={undefined}></option>
                        {
                          items.map((item) => (
                            <option value={item.id} key={item.id}>{item.name}</option>
                          ))
                        }
                      </select>
                    </div>

                    <div className="app-field">
                      <input type="number" className="app-field-control" required
                      {...register(`relInvoiceItems.${index}.quantity`, { onChange: manageInventory.totalize })} min={1} />
                    </div>

                    <div className="app-field">
                      <input type="number" step="0.01" className="app-field-control" required
                      {...register(`relInvoiceItems.${index}.priceOfRecord`, { onChange: manageInventory.totalize })} min={0} />
                    </div>

                  </div>
                ))
              }

              <div className="grid grid-cols-4 gap-x-4 mt-4 app-inventory app-inventory-end">
                <div className="col-span-2">
                  {
                    (!showing()) &&
                      <button type="button" onClick={manageInventory.onAppend}>
                        <FaCirclePlus />Add
                      </button>
                  }
                </div>
                <div className="col-span-2 flex items-center">
                  <label className='app-label-total ml-auto'>Total</label>
                  <span className='ml-2 pr-2 text-purple-900 text-lg font-semibold'>
                    ${handyMoney(watch('total'))}
                  </span>
                </div>
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

      <div className="hidden">
        <div ref={(el) => (printable = el)}>
          <PrintableInvoice invoice={ (creating()) ? null : getValues() } />
        </div>
      </div>
    </>
  )
}
