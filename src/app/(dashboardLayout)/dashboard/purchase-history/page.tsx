import { getPurchasedMediaAction } from "@/app/_actions/media.actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { Film, Receipt } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const dynamic = "force-dynamic"

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

    const purchases = response.data ?? []

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
                        <Card key={item.id} className="overflow-hidden">
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
                                            Purchased on {format(new Date(item.createdAt), "PPP")}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline">{item.mediaType}</Badge>
                                        <Badge variant="secondary">{item.pricingType}</Badge>
                                    </div>
                                    <Button asChild className="w-full">
                                        <Link href={`/media/${item.id}`}>Watch Now</Link>
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
