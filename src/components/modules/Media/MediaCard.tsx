import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Media } from "@/types/media.types";
import { MessageCircle, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface MediaCardProps {
    media: Media;
}

const MediaCard = ({ media }: MediaCardProps) => {
    return (
        <Card className="group flex flex-col h-full overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300">
            <Link href={`/media/${media.id}`} className="relative aspect-[2/3] overflow-hidden bg-muted block">
                {media.posterUrl ? (
                    <Image
                        src={media.posterUrl}
                        alt={media.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-sm">No Image</div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant={media.pricingType === "FREE" ? "secondary" : "default"} className="text-[10px] px-2 py-0.5 shadow-md">
                        {media.pricingType}
                    </Badge>
                </div>
            </Link>
            <CardContent className="p-4 flex flex-col flex-1 bg-gradient-to-b from-transparent to-muted/10">
                <Link href={`/media/${media.id}`} className="hover:text-primary transition-colors duration-200">
                    <h3 className="font-bold text-base line-clamp-1">{media.title}</h3>
                </Link>
                <div className="flex items-center justify-between mt-2 flex-wrap gap-y-1">
                    <span className="text-xs font-medium bg-muted px-1.5 py-0.5 rounded">{media.releaseYear}</span>
                    <div className="flex items-center gap-1 text-xs font-medium">
                        <Star className="size-3.5 fill-yellow-500 text-yellow-500" />
                        <span>{media.averageRating?.toFixed(1) ?? "—"}</span>
                    </div>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span className="truncate">{media.streamingPlatform || "Platform TBA"}</span>
                    <span className="inline-flex items-center gap-1 shrink-0">
                        <MessageCircle className="size-3" />
                        {media._count?.reviews ?? 0}
                    </span>
                </div>
                
                <p className="mt-3 text-sm text-muted-foreground line-clamp-2 flex-1">
                    {media.synopsis || "No description available. Click to view more details about this title."}
                </p>

                {media.genres && media.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
                        {media.genres.slice(0, 3).map((g) => (
                            <Badge key={g.id} variant="outline" className="text-[10px] px-1.5 py-0 bg-background/50 border-muted-foreground/30">{g.name}</Badge>
                        ))}
                    </div>
                )}
                
                <div className="mt-auto pt-3 border-t">
                    <Button asChild className="w-full font-medium" variant="default">
                        <Link href={`/media/${media.id}`}>View Details</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default MediaCard;
