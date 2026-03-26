import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

const PaymentSuccessPage = () => {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6">
      <CheckCircle2 className="size-16 text-green-500" />
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Payment Successful</h1>
        <p className="text-muted-foreground">
          Your payment has been processed and your appointment is confirmed.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard/my-appointments">View My Appointments</Link>
      </Button>
    </section>
  )
}

export default PaymentSuccessPage
