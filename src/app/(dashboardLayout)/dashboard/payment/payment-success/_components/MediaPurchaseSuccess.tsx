"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, Loader2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { verifyMediaPurchase } from "@/services/media.services"

type VerifyState = "polling" | "confirmed" | "failed"

const MAX_ATTEMPTS = 8
const POLL_INTERVAL_MS = 2500

interface MediaPurchaseSuccessProps {
    sessionId: string
}

export default function MediaPurchaseSuccess({ sessionId }: MediaPurchaseSuccessProps) {
    const router = useRouter()
    const [state, setState] = useState<VerifyState>("polling")
    const [mediaId, setMediaId] = useState<string | null>(null)
    const attemptsRef = useRef(0)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const verify = useCallback(async () => {
        try {
            const result = await verifyMediaPurchase(sessionId)

            if (result.success && result.data.hasAccess) {
                setState("confirmed")
                if (result.data.mediaId) {
                    setMediaId(result.data.mediaId)
                }
                return
            }
        } catch {
            // network error — keep polling until max attempts
        }

        attemptsRef.current += 1
        if (attemptsRef.current >= MAX_ATTEMPTS) {
            setState("failed")
            return
        }

        timerRef.current = setTimeout(verify, POLL_INTERVAL_MS)
    }, [sessionId])

    useEffect(() => {
        verify()
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [verify])

    if (state === "polling") {
        return (
            <section className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6">
                <Loader2 className="size-16 animate-spin text-primary" />
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">Confirming your purchase…</h1>
                    <p className="text-muted-foreground">
                        Please wait while we verify your payment. This usually takes just a moment.
                    </p>
                </div>
            </section>
        )
    }

    if (state === "confirmed") {
        return (
            <section className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6">
                <CheckCircle2 className="size-16 text-green-500" />
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">Purchase Confirmed!</h1>
                    <p className="text-muted-foreground">
                        You now have permanent access to this premium title.
                    </p>
                </div>
                <div className="flex gap-3">
                    {mediaId && (
                        <Button asChild>
                            <Link href={`/media/${mediaId}`}>Watch Now</Link>
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        onClick={() => {
                            if (mediaId) {
                                router.push(`/media/${mediaId}`)
                            } else {
                                router.push("/media")
                            }
                        }}
                    >
                        Browse Media
                    </Button>
                </div>
            </section>
        )
    }

    // failed / timeout
    return (
        <section className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6">
            <XCircle className="size-16 text-destructive" />
            <div className="space-y-2">
                <h1 className="text-2xl font-bold">Verification Timed Out</h1>
                <p className="text-muted-foreground">
                    Your payment may still be processing. Check your email for a confirmation receipt.
                    If payment was taken but you can&apos;t watch the content, please contact support.
                </p>
            </div>
            <div className="flex gap-3">
                <Button onClick={() => { attemptsRef.current = 0; setState("polling"); verify() }}>
                    Try Again
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/media">Browse Media</Link>
                </Button>
            </div>
        </section>
    )
}
