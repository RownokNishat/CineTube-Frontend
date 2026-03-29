import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Media } from "@/types/media.types";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface MediaCardProps {
    media: Media;
}

const MediaCard = ({ media }: MediaCardProps) => {
    return (
        <Link href={`/media/${media.id}`}>
            <Card className="group overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200">
                <div className="relative aspect-[2/3] overflow-hidden bg-muted">
                    {media.posterUrl ? (
                        <Image
                            src={media.posterUrl}
                            alt={media.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-sm">No Image</div>
                    )}
                    <div className="absolute top-2 left-2 flex gap-1">
                        <Badge variant={media.pricingType === "FREE" ? "secondary" : "default"} className="text-xs">
                            {media.pricingType}
                        </Badge>
                    </div>
                </div>
                <CardContent className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">{media.title}</h3>
                    <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">{media.releaseYear}</span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="size-3 fill-yellow-400 text-yellow-400" />
                            <span>{media.averageRating?.toFixed(1) ?? "—"}</span>
                        </div>
                    </div>
                    {media.genres && media.genres.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {media.genres.slice(0, 2).map((g) => (
                                <Badge key={g.id} variant="outline" className="text-xs px-1 py-0">{g.name}</Badge>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
};

export default MediaCard;
