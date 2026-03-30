"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Trash2, Trash, BookmarkX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { getWatchlist, removeFromWatchlist, clearWatchlist } from "@/services/watchlist.services"
import { WatchlistItem } from "@/types/subscription.types"
import { toast } from "sonner"

export default function WatchlistPage() {
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
    const [loading, setLoading] = useState(true)
    const [removing, setRemoving] = useState<string | null>(null)
    const [showClearDialog, setShowClearDialog] = useState(false)
    const [isClearing, setIsClearing] = useState(false)

    useEffect(() => {
        loadWatchlist()
    }, [])

    const loadWatchlist = async () => {
        try {
            setLoading(true)
            const result = await getWatchlist()
            if (result.success && "data" in result) {
                setWatchlist(result.data ?? [])
            } else {
                toast.error("Failed to load watchlist")
            }
        } catch (error) {
            console.error("Error loading watchlist:", error)
            toast.error("Error loading watchlist")
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveItem = async (mediaId: string, title: string) => {
        try {
            setRemoving(mediaId)
            const result = await removeFromWatchlist(mediaId)
            if (result.success) {
                setWatchlist(watchlist.filter(item => item.mediaId !== mediaId))
                toast.success(`Removed "${title}" from watchlist`)
            } else {
                toast.error(result.message || "Failed to remove from watchlist")
            }
        } catch (error) {
            console.error("Error removing from watchlist:", error)
            toast.error("Error removing from watchlist")
        } finally {
            setRemoving(null)
        }
    }

    const handleClearWatchlist = async () => {
        try {
            setIsClearing(true)
            const result = await clearWatchlist()
            if (result.success) {
                setWatchlist([])
                setShowClearDialog(false)
                toast.success("Watchlist cleared")
            } else {
                toast.error(result.message || "Failed to clear watchlist")
            }
        } catch (error) {
            console.error("Error clearing watchlist:", error)
            toast.error("Error clearing watchlist")
        } finally {
            setIsClearing(false)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/media">
                                <ArrowLeft className="size-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold">My Watchlist</h1>
                            <p className="text-muted-foreground mt-1">{watchlist.length} {watchlist.length === 1 ? "item" : "items"}</p>
                        </div>
                    </div>

                    {watchlist.length > 0 && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setShowClearDialog(true)}
                            disabled={isClearing}
                            className="gap-2"
                        >
                            <Trash className="size-4" />
                            Clear All
                        </Button>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <p className="text-muted-foreground">Loading your watchlist...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && watchlist.length === 0 && (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <BookmarkX className="size-12 text-muted-foreground mb-4" />
                            <p className="text-lg font-semibold text-muted-foreground mb-2">No items in watchlist</p>
                            <p className="text-sm text-muted-foreground mb-6">Start adding movies and series you want to watch</p>
                            <Button asChild>
                                <Link href="/media">Browse Media</Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Watchlist Grid */}
                {!loading && watchlist.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {watchlist.map((item) => (
                            <div key={item.id} className="group">
                                <Link href={`/media/${item.mediaId}`}>
                                    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                                        <div className="relative aspect-[2/3] bg-muted overflow-hidden">
                                            {item.media.posterUrl ? (
                                                <Image
                                                    src={item.media.posterUrl}
                                                    alt={item.media.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                                    No Image
                                                </div>
                                            )}

                                            {/* Remove Button (visible on hover) */}
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    handleRemoveItem(item.mediaId, item.media.title)
                                                }}
                                                disabled={removing === item.mediaId}
                                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                                                title="Remove from watchlist"
                                            >
                                                <Trash2 className="size-5 text-white" />
                                            </button>

                                            {/* Type Badge */}
                                            <div className="absolute top-2 left-2">
                                                <Badge variant={item.media.mediaType === "MOVIE" ? "default" : "secondary"} className="text-xs">
                                                    {item.media.mediaType === "MOVIE" ? "Movie" : "Series"}
                                                </Badge>
                                            </div>

                                            {/* Price Badge */}
                                            {item.media.pricingType === "PREMIUM" && (
                                                <div className="absolute top-2 right-2">
                                                    <Badge variant="default" className="text-xs bg-yellow-600">
                                                        Premium
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>

                                        <CardContent className="p-3">
                                            <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                                {item.media.title}
                                            </h3>
                                            <p className="text-xs text-muted-foreground mt-1">{item.media.releaseYear}</p>
                                            {item.media.genres && item.media.genres.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {item.media.genres.slice(0, 1).map((g) => (
                                                        <Badge key={g.id} variant="outline" className="text-xs px-1 py-0">
                                                            {g.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Clear Watchlist Confirmation */}
            <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
                <AlertDialogContent>
                    <AlertDialogTitle>Clear entire watchlist?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. All {watchlist.length} {watchlist.length === 1 ? "item" : "items"} will be removed from your watchlist.
                    </AlertDialogDescription>
                    <div className="flex justify-end gap-2">
                        <AlertDialogCancel disabled={isClearing}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleClearWatchlist}
                            disabled={isClearing}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isClearing ? "Clearing..." : "Clear Watchlist"}
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
