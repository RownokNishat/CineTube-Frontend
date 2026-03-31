"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, Loader2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { verifyMediaPurchaseAction } from "@/app/_actions/media.actions"

type VerifyState = "polling" | "confirmed" | "failed"

const MAX_ATTEMPTS = 5
const POLL_INTERVAL_MS = 1500

interface MediaPurchaseSuccessProps {
    sessionId: string
}

export default function MediaPurchaseSuccess({ sessionId }: MediaPurchaseSuccessProps) {
    const router = useRouter()
    const [state, setState] = useState<VerifyState>("polling")
    const [mediaId, setMediaId] = useState<string | null>(null)
    const [errorText, setErrorText] = useState<string>("")
    const [isUnauthorized, setIsUnauthorized] = useState(false)
    const attemptsRef = useRef(0)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const verify = useCallback(async function verifyFn() {
        try {
            const result = await verifyMediaPurchaseAction(sessionId)

            if (!result.success) {
                if (result.statusCode === 401) {
                    setIsUnauthorized(true)
                    setErrorText("Please sign in to confirm your purchase and unlock the movie.")
                    setState("failed")
                    return
                }

                attemptsRef.current += 1
                if (attemptsRef.current >= MAX_ATTEMPTS) {
                    setErrorText(result.message || "Payment verification is taking longer than expected. Please try again.")
                    setState("failed")
                    return
                }

                timerRef.current = setTimeout(() => {
                    void verifyFn()
                }, POLL_INTERVAL_MS)
                return
            }

            if (result.data.hasAccess) {
                const resolvedMediaId =
                    result.data.mediaId ||
                    result.data.purchase?.media?.id ||
                    null

                setState("confirmed")
                if (resolvedMediaId) {
                    setMediaId(resolvedMediaId)
                }
                return
            }
        } catch {
            // network error — keep polling until max attempts
        }

        attemptsRef.current += 1
        if (attemptsRef.current >= MAX_ATTEMPTS) {
            setErrorText("Payment verification is taking longer than expected. Please try again.")
            setState("failed")
            return
        }

        timerRef.current = setTimeout(() => {
            void verifyFn()
        }, POLL_INTERVAL_MS)
    }, [sessionId])

    useEffect(() => {
        verify()
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [verify])

    useEffect(() => {
        if (state === "confirmed" && mediaId) {
            router.replace(`/media/${mediaId}?purchased=true&purchase_session=${encodeURIComponent(sessionId)}`)
        }
    }, [state, mediaId, router, sessionId])

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
                        Purchase verified. Redirecting you to the media page...
                    </p>
                </div>
                <div className="flex gap-3">
                    {mediaId && (
                        <Button asChild>
                            <Link href={`/media/${mediaId}?purchased=true&purchase_session=${encodeURIComponent(sessionId)}`}>Go Now</Link>
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
                    {errorText || "Your payment may still be processing. Please refresh and try again."}
                </p>
            </div>
            <div className="flex gap-3">
                {isUnauthorized ? (
                    <Button asChild>
                        <Link href={`/login?redirect=${encodeURIComponent(`/payment/success?session_id=${sessionId}`)}`}>
                            Sign In to Continue
                        </Link>
                    </Button>
                ) : (
                    <Button onClick={() => { attemptsRef.current = 0; setErrorText(""); setState("polling"); verify() }}>
                        Try Again
                    </Button>
                )}
                <Button variant="outline" asChild>
                    <Link href="/media">Browse Media</Link>
                </Button>
            </div>
        </section>
    )
}
