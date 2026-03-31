"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { createMediaCheckoutSession } from "@/services/media.services";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Loader2, Clapperboard } from "lucide-react";

interface RentButtonProps {
    mediaId: string;
    mediaTitle: string;
}

export default function RentButton({ mediaId, mediaTitle }: RentButtonProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [selectedDays, setSelectedDays] = useState("7");
    const [loading, setLoading] = useState(false);

    const rentalOptions = [
        { days: 7, price: 2.99 },
        { days: 30, price: 5.99 },
    ];

    const handleRent = async () => {
        if (!session) {
            toast.error("Please sign in to rent movies");
            router.push("/auth/login");
            return;
        }

        setLoading(true);
        try {
            const result = await createMediaCheckoutSession(
                mediaId,
                "RENTAL",
                parseInt(selectedDays)
            );

            if (result.success && result.data?.checkoutUrl) {
                setOpen(false);
                router.push(result.data.checkoutUrl);
            } else {
                toast.error(result.message || "Failed to start rental checkout");
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to rent media");
        } finally {
            setLoading(false);
        }
    };

    if (!session) {
        return (
            <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => router.push("/auth/login")}
            >
                <Clapperboard className="size-4" />
                Sign in to Rent
            </Button>
        );
    }

    const selectedPrice =
        rentalOptions.find((opt) => opt.days === parseInt(selectedDays))?.price ?? 2.99;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full gap-2">
                    <Clapperboard className="size-4" />
                    Rent - ${selectedPrice.toFixed(2)}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Rent {mediaTitle}</DialogTitle>
                    <DialogDescription>Choose rental duration</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-3">
                            Rental Duration
                        </label>
                        <ToggleGroup
                            type="single"
                            value={selectedDays}
                            onValueChange={setSelectedDays}
                            className="justify-start"
                        >
                            {rentalOptions.map((option) => (
                                <ToggleGroupItem
                                    key={option.days}
                                    value={option.days.toString()}
                                    className="data-[state=on]:bg-primary"
                                >
                                    <div className="flex flex-col items-center">
                                        <span>{option.days} Days</span>
                                        <span className="text-xs text-gray-500">
                                            ${option.price.toFixed(2)}
                                        </span>
                                    </div>
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                        <p className="text-sm text-blue-900 dark:text-blue-100">
                            💡 After {selectedDays} days, your access will expire automatically.
                        </p>
                    </div>

                    <Button
                        onClick={handleRent}
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            `Proceed to Checkout - $${selectedPrice.toFixed(2)}`
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
