"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useKeyboardShortcuts() {

    const router = useRouter();

    useEffect(() => {

        const handleKey = (e: KeyboardEvent) => {

            // Alt + L
            if (e.altKey && e.key.toLowerCase() === "l") {
                e.preventDefault();
                router.push("/masters/ledgers/create");
            }

            // Alt + G
            if (e.altKey && e.key.toLowerCase() === "g") {
                e.preventDefault();
                router.push("/masters/groups/create");
            }

            // Alt + S
            if (e.altKey && e.key.toLowerCase() === "s") {
                e.preventDefault();
                router.push("/masters/stock-items/create");
            }

            // Alt + U
            if (e.altKey && e.key.toLowerCase() === "u") {
                e.preventDefault();
                router.push("/masters/units/create");
            }

            // F8
            if (e.key === "F8") {
                e.preventDefault();
                router.push("/vouchers/sales");
            }

            // F9
            if (e.key === "F9") {
                e.preventDefault();
                router.push("/vouchers/purchase");
            }

            // Ctrl+B
            if (e.ctrlKey && e.key.toLowerCase() === "b") {
                e.preventDefault();
                router.push("/billing/invoice/create");
            }

            // Ctrl+H
            if (e.ctrlKey && e.key.toLowerCase() === "h") {
                e.preventDefault();
                router.push("/dashboard");
            }

            // Ctrl+Q
            if (e.ctrlKey && e.key.toLowerCase() === "q") {
                e.preventDefault();

                localStorage.clear();

                router.push("/");
            }

        };

        window.addEventListener("keydown", handleKey);

        return () =>
            window.removeEventListener("keydown", handleKey);

    }, [router]);

}