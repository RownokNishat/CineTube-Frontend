"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createMediaCheckoutSessionAction } from "@/app/_actions/media.actions"
import { Loader2, Lock, AlertCircle } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface PurchaseButtonProps {
    mediaId: string
    mediaTitle: string
    isLoggedIn: boolean
    price?: number
}

export default function PurchaseButton({ mediaId, mediaTitle, isLoggedIn, price = 9.99 }: PurchaseButtonProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [error, setError] = useState<string | null>(null)

    if (!isLoggedIn) {
        return (
            <Button variant="default" className="gap-2" onClick={() => router.push("/login")}>
                <Lock className="size-4" /> Sign in to Watch
            </Button>
        )
    }

    const handlePurchase = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const result = await createMediaCheckoutSessionAction(mediaId)

            if (!result.success || !("data" in result)) {
                const message = result.message || "Failed to start purchase"
                const normalized = message.toLowerCase()

                if (
                    normalized.includes("already purchased") ||
                    normalized.includes("unique constraint") ||
                    normalized.includes("userid") && normalized.includes("mediaid")
                ) {
                    setError("You already purchased this premium title. Reloading access status...")
                    setShowConfirm(false)
                    router.refresh()
                    return
                }

                setError(message)
                setShowConfirm(false)
                return
            }

            if (result.data.checkoutUrl) {
                window.location.href = result.data.checkoutUrl
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.")
            console.error("Purchase error:", err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {error && (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertCircle className="size-4 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <Button variant="default" className="gap-2" disabled={isLoading} onClick={() => setShowConfirm(true)}>
                {isLoading ? (
                    <>
                        <Loader2 className="size-4 animate-spin" /> Processing...
                    </>
                ) : (
                    <>
                        <Lock className="size-4" /> Buy Now - ${price.toFixed(2)}
                    </>
                )}
            </Button>

            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogTitle>Purchase "{mediaTitle}"?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You are about to purchase permanent access to watch this content. You will be redirected to Stripe to complete the payment securely.
                        <br />
                        <br />
                        Price: <span className="font-semibold text-foreground">${price.toFixed(2)}</span>
                    </AlertDialogDescription>
                    <div className="flex justify-end gap-2">
                        <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handlePurchase} disabled={isLoading}>
                            {isLoading ? "Processing..." : "Continue to Payment"}
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
