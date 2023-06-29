import { Invoice } from "@/models"

import './PrintableInvoice.scss'

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
          <div className="text-2xl font-brand font-bold text-purple-900">
            DigitalInvoicing.
          </div>
          <div className="ml-auto">
            <div className="text-xs font-bold">{ invoice.number }</div>
          </div>
        </div>
      </div>
    </>
  )
}
