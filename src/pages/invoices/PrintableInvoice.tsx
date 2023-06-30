import { Invoice } from "@/models"

import './PrintableInvoice.scss'
import { handyLongAddress, handyDate } from "@/services/util"

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
            <div className="text-2xl text-right font-bold">
              <span className="text-gray-500">Invoice </span>
              <span className="">#{ invoice.id }</span>
            </div>
            <div className="text-xs">{ invoice.number }</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 my-20 p-4 bg-purple-100 rounded-lg">
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
      </div>
    </>
  )
}
