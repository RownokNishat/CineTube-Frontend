"use client";

import { usePathname, useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, useEffect, useRef } from "react";

interface AutoFilterFormProps {
    children: ReactNode;
    className?: string;
    debounceMs?: number;
}

const NON_TEXT_INPUT_TYPES = new Set([
    "hidden",
    "checkbox",
    "radio",
    "button",
    "submit",
    "reset",
    "file",
]);

export default function AutoFilterForm({
    children,
    className,
    debounceMs = 400,
}: AutoFilterFormProps) {
    const router = useRouter();
    const pathname = usePathname();
    const formRef = useRef<HTMLFormElement | null>(null);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const submitFilters = () => {
        const form = formRef.current;
        if (!form) {
            return;
        }

        const formData = new FormData(form);
        const query = new URLSearchParams();

        for (const [key, value] of formData.entries()) {
            if (typeof value !== "string") {
                continue;
            }

            const normalizedValue = value.trim();
            if (!normalizedValue) {
                continue;
            }

            query.set(key, normalizedValue);
        }

        const nextUrl = query.size > 0 ? `${pathname}?${query.toString()}` : pathname;
        router.replace(nextUrl, { scroll: false });
    };

    const scheduleSubmit = (immediate = false) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        if (immediate) {
            submitFilters();
            return;
        }

        debounceTimerRef.current = setTimeout(() => {
            submitFilters();
        }, debounceMs);
    };

    const handleInput = (event: FormEvent<HTMLFormElement>) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLTextAreaElement)) {
            return;
        }

        if (target instanceof HTMLInputElement && NON_TEXT_INPUT_TYPES.has(target.type)) {
            return;
        }

        scheduleSubmit(false);
    };

    const handleChange = (event: FormEvent<HTMLFormElement>) => {
        const target = event.target;
        if (target instanceof HTMLSelectElement) {
            scheduleSubmit(true);
            return;
        }

        if (target instanceof HTMLInputElement && (target.type === "checkbox" || target.type === "radio")) {
            scheduleSubmit(true);
        }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        scheduleSubmit(true);
    };

    return (
        <form
            ref={formRef}
            className={className}
            onInput={handleInput}
            onChange={handleChange}
            onSubmit={handleSubmit}
        >
            {children}
        </form>
    );
}
