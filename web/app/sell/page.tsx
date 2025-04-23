import { AppShell } from "@/components/app-shell"
import { InvoiceForm } from "@/components/invoice-form"

export default function SellPage() {
  return (
    <AppShell>
      <div className="p-4">
        <InvoiceForm />
      </div>
    </AppShell>
  )
}
