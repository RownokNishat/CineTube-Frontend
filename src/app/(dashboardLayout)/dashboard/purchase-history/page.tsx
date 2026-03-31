import { getPurchasedMediaAction } from "@/app/_actions/media.actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { Film, Receipt } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const dynamic = "force-dynamic"

type PurchaseListItem = {
    id: string
    mediaId: string
    title: string
    posterUrl?: string
    mediaType?: string
    pricingType?: string
    purchasedOn: string
}

const PurchaseHistoryPage = async () => {
    const response = await getPurchasedMediaAction()

    if (!response.success) {
        return (
            <div className="space-y-4">
                <h1 className="text-2xl font-bold">Purchase History</h1>
                <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                        {response.message || "Unable to load purchase history right now."}
                    </CardContent>
                </Card>
            </div>
        )
    }

    const rawPurchases = Array.isArray(response.data) ? response.data : []

    const purchases = rawPurchases.reduce<PurchaseListItem[]>((acc, item) => {
            const source = item && typeof item === "object" ? item : {}
            const media =
                "media" in source && source.media && typeof source.media === "object"
                    ? source.media
                    : source

            const mediaIdCandidate =
                "id" in media && typeof media.id === "string"
                    ? media.id
                    : "mediaId" in source && typeof source.mediaId === "string"
                      ? source.mediaId
                      : "id" in source && typeof source.id === "string"
                        ? source.id
                        : ""

            if (!mediaIdCandidate) {
                return acc
            }

            const purchaseDateRaw =
                ("purchaseDate" in source ? source.purchaseDate : undefined) ??
                ("createdAt" in source ? source.createdAt : undefined) ??
                ("createdAt" in media ? media.createdAt : undefined)

            const parsedDate = purchaseDateRaw ? new Date(String(purchaseDateRaw)) : null
            const purchasedOn = parsedDate && !Number.isNaN(parsedDate.getTime()) ? format(parsedDate, "PPP") : "Unknown date"

            acc.push({
                id:
                    ("id" in source && typeof source.id === "string" ? source.id : undefined) ??
                    mediaIdCandidate,
                mediaId: mediaIdCandidate,
                title:
                    ("title" in media && typeof media.title === "string" ? media.title : undefined) ??
                    "Untitled",
                posterUrl: "posterUrl" in media && typeof media.posterUrl === "string" ? media.posterUrl : undefined,
                mediaType: "mediaType" in media && typeof media.mediaType === "string" ? media.mediaType : undefined,
                pricingType:
                    ("pricingType" in media && typeof media.pricingType === "string" ? media.pricingType : undefined) ??
                    ("status" in source && typeof source.status === "string" ? source.status : undefined),
                purchasedOn,
            })

            return acc
        }, [])

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Purchase History</h1>
                    <p className="text-sm text-muted-foreground">All premium movies and series you have unlocked.</p>
                </div>
                <Badge variant="secondary" className="w-fit">
                    <Receipt className="mr-1 size-3" />
                    {purchases.length} Purchases
                </Badge>
            </div>

            {purchases.length === 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>No purchases yet</CardTitle>
                        <CardDescription>Buy premium media to see your history here.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/media">Browse Media</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {purchases.map((item) => (
                        <Card key={`${item.id}-${item.mediaId}`} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="relative aspect-video w-full bg-muted">
                                    {item.posterUrl ? (
                                        <Image
                                            src={item.posterUrl}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-muted-foreground">
                                            <Film className="size-8" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-3 p-4">
                                    <div>
                                        <h2 className="line-clamp-1 font-semibold">{item.title}</h2>
                                        <p className="text-sm text-muted-foreground">
                                            Purchased on {item.purchasedOn}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline">{item.mediaType ?? "MEDIA"}</Badge>
                                        <Badge variant="secondary">{item.pricingType ?? "PURCHASED"}</Badge>
                                    </div>
                                    <Button asChild className="w-full">
                                        <Link href={`/media/${item.mediaId}`}>Watch Now</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

export default PurchaseHistoryPage
