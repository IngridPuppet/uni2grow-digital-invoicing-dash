import { Invoice } from "@/models"

import './PrintableInvoice.scss'
import { handyLongAddress, handyDate, handyMoney } from "@/services/util"

type PrintableInvoiceProps = {
  invoice: Invoice | null
}

export default function PrintableInvoice({invoice}: PrintableInvoiceProps) {
  if (invoice == null) {
    return <></>
  }

  return (
    <>
      <div className="app-printable-invoice p-10 bg-white">
        <div className="flex items-start">
          <div className="text-4xl font-brand font-bold text-purple-900">
            DigitalInvoicing.
          </div>
          <div className="ml-auto">
            <div className="text-2xl font-bold grid grid-cols-3">
              <span className="text-gray-500 text-sm self-center">UUID ▾ </span>
              <span className="flex items-center col-span-2">
                <span className="text-gray-500 text-sm">INVOICE ID ▸</span>
                <span className="ml-auto">#{ invoice.id }</span>
              </span>
            </div>
            <div className="text-xs">{ invoice.number }</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 my-10 p-4 bg-purple-100 rounded-lg">
          <div>
            <div className="uppercase text-sm text-purple-900 font-bold mb-2">Billing to</div>
            {
              (invoice.customer?.id) ?
                <>
                  <div className="text-xs font-bold mb-1">{ invoice.customer.name }</div>
                  <div className="text-xs mb-1">{ invoice.customer.email }</div>
                  <div className="text-xs mb-1">{ invoice.customer.phone }</div>
                  <div className="text-xs mb-1">{ handyLongAddress(invoice.customer.address) }</div>
                </>
                :
                <>
                  <div className="text-xs mb-1">N/A</div>
                </>
            }
          </div>
          <div className="space-y-5">
            <div>
              <div className="uppercase text-sm text-purple-900 font-bold mb-2">Shipping address</div>
              {
                (invoice.billingAddress?.id) ?
                  <div className="text-xs mb-1">{ handyLongAddress(invoice.billingAddress) }</div>:
                  <div className="text-xs mb-1">N/A</div>
              }

            </div>
            <div>
              <div className="uppercase text-sm text-purple-900 font-bold mb-2">Issued at</div>
              <div className="text-xs mb-1">{ handyDate(invoice.issueDate, true) }</div>
            </div>
          </div>
        </div>

        <div className="app-inventory">
          <div className="grid grid-cols-5 gap-4 bg-black text-gray-50 px-4 py-2 uppercase text-xs font-bold app-inventory-start">
            <div className="col-span-2">Item</div>
            <div className="col-span-1 text-right">Quantity</div>
            <div className="col-span-1 text-right">Unit price</div>
            <div className="col-span-1 text-right">Total</div>
          </div>

          {
            invoice.relInvoiceItems?.map((x) => <>
              <div className="grid grid-cols-5 gap-4 px-4 py-2 even:bg-gray-200 text-xs app-inventory-item">
                <div className="col-span-2 font-semibold">{ x.item.name }</div>
                <div className="col-span-1 text-right">{ x.quantity }</div>
                <div className="col-span-1 text-right">${ x.priceOfRecord }</div>
                <div className="col-span-1 text-right">${ handyMoney(x.quantity * x.priceOfRecord) }</div>
              </div>
            </>)
          }
        </div>

        <div className="app-total flex items-center mt-5">
          <span className="text-gray-500 text-sm font-bold ml-auto mr-4">GRAND TOTAL ▸</span>
          <div className="text-2xl font-bold text-purple-900">${ handyMoney(invoice.total) }</div>
        </div>
      </div>
    </>
  )
}
