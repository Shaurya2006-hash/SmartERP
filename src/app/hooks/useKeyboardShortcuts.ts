"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useKeyboardShortcuts() {

    const router = useRouter();

    useEffect(() => {

        const handleKey = (e: KeyboardEvent) => {

            const key = e.key.toLowerCase();

            // ---------------------------------------------------------
            // GLOBAL
            // ---------------------------------------------------------

            // Ctrl + Alt + C -> Company Selection
            if (e.ctrlKey && e.altKey && key === "c") {
                e.preventDefault();
                router.push("/company");
                return;
            }

            // Ctrl + Alt + Y -> Financial Year
            if (e.ctrlKey && e.altKey && key === "y") {
                e.preventDefault();
                router.push("/company/financial-year");
                return;
            }

            // Ctrl + Alt + I -> Company Information
            if (e.ctrlKey && e.altKey && key === "i") {
                e.preventDefault();
                router.push("/company/info");
                return;
            }

            // Ctrl + Alt + X -> Calculator
            if (e.ctrlKey && e.altKey && key === "x") {
                e.preventDefault();
                // Widget, not a page - hook this up once a Calculator
                // modal component exists.
                console.warn("Calculator widget not implemented yet.");
                return;
            }

            // Ctrl + Alt + R -> Refresh
            if (e.ctrlKey && e.altKey && key === "r") {
                e.preventDefault();
                router.refresh();
                return;
            }

            // Alt + Left Arrow -> Previous Screen
            if (e.altKey && e.key === "ArrowLeft") {
                e.preventDefault();
                router.back();
                return;
            }

            // Ctrl + Shift + Q -> Logout
            if (e.ctrlKey && e.shiftKey && key === "q") {
                e.preventDefault();
                localStorage.clear();
                router.push("/");
                return;
            }

            // Ctrl + Alt + H -> Home
            if (e.ctrlKey && e.altKey && key === "h") {
                e.preventDefault();
                router.push("/dashboard");
                return;
            }

            // Ctrl + Alt + K -> Command Search
            if (e.ctrlKey && e.altKey && key === "k") {
                e.preventDefault();
                // Widget, not a page - hook this up once a command
                // palette component exists.
                console.warn("Command Search palette not implemented yet.");
                return;
            }

            // ---------------------------------------------------------
            // MASTERS
            // ---------------------------------------------------------

            // Alt + C -> Create Company
            if (e.altKey && !e.ctrlKey && key === "c") {
                e.preventDefault();
                router.push("/company/create");
                return;
            }

            // Alt + G -> Create Group
            if (e.altKey && !e.ctrlKey && key === "g") {
                e.preventDefault();
                router.push("/masters/groups/create");
                return;
            }

            // Alt + L -> Create Ledger
            if (e.altKey && !e.shiftKey && !e.ctrlKey && key === "l") {
                e.preventDefault();
                router.push("/masters/ledgers/create");
                return;
            }

            // Alt + Shift + L -> Edit Ledger
            if (e.altKey && e.shiftKey && key === "l") {
                e.preventDefault();
                // No single-record edit route without an ID, so send them
                // to the ledger list to pick one.
                router.push("/masters/ledgers");
                return;
            }

            // Alt + S -> Create Stock Item
            if (e.altKey && !e.ctrlKey && key === "s") {
                e.preventDefault();
                router.push("/masters/stock-items/create");
                return;
            }

            // Alt + U -> Create Unit
            if (e.altKey && !e.ctrlKey && key === "u") {
                e.preventDefault();
                router.push("/masters/units/create");
                return;
            }

            // Alt + D -> Create Godown
            if (e.altKey && !e.ctrlKey && key === "d") {
                e.preventDefault();
                router.push("/masters/godowns/create");
                return;
            }

            // ---------------------------------------------------------
            // VOUCHERS
            // ---------------------------------------------------------

            // Ctrl + Alt + P -> Purchase Voucher
            if (e.ctrlKey && e.altKey && key === "p") {
                e.preventDefault();
                router.push("/voucher/purchase");
                return;
            }

            // Ctrl + Alt + S -> Sales Voucher
            if (e.ctrlKey && e.altKey && key === "s") {
                e.preventDefault();
                router.push("/voucher/sales");
                return;
            }

            // Ctrl + Alt + T -> Receipt Voucher
            // Remapped from Ctrl+Alt+R, which collided with "Refresh".
            if (e.ctrlKey && e.altKey && key === "t") {
                e.preventDefault();
                router.push("/voucher/receipt");
                return;
            }

            // Ctrl + Alt + J -> Journal Voucher
            if (e.ctrlKey && e.altKey && key === "j") {
                e.preventDefault();
                router.push("/voucher/journal");
                return;
            }

            // Ctrl + Alt + V -> Reversing Journal
            if (e.ctrlKey && e.altKey && key === "v") {
                e.preventDefault();
                router.push("/voucher/reversing-journal");
                return;
            }

            // Ctrl + Alt + N -> Credit Note
            // Remapped from Ctrl+Alt+C, which collided with "Company Selection".
            if (e.ctrlKey && e.altKey && key === "n") {
                e.preventDefault();
                router.push("/voucher/credit-note");
                return;
            }

            // Ctrl + Alt + D -> Debit Note
            if (e.ctrlKey && e.altKey && key === "d") {
                e.preventDefault();
                router.push("/voucher/debit-note");
                return;
            }

            // ---------------------------------------------------------
            // BILLING
            // ---------------------------------------------------------

            // Ctrl + B -> New Invoice
            if (e.ctrlKey && !e.altKey && !e.shiftKey && key === "b") {
                e.preventDefault();
                router.push("/billing/invoices/create");
                return;
            }

            // Ctrl + P (Print Invoice), Ctrl+Shift+P (Download PDF),
            // Ctrl + S (Save), Ctrl+Shift+X (Cancel):
            // These are page/form-level actions, not global navigation.
            // They depend on which invoice/voucher form is currently open,
            // so they should be handled inside that specific page/component
            // rather than in this global hook.

            // ---------------------------------------------------------
            // SEARCH
            // ---------------------------------------------------------

            // Ctrl+F (Search), Ctrl+Shift+F (Global Search), Enter (Select),
            // Tab / Shift+Tab (field navigation), Arrow Keys (navigation),
            // Esc (Cancel):
            // Same as above - these depend on focus/context within a form
            // or table, so they belong in the component that owns that
            // form/table, not in a document-wide listener.
        };

        window.addEventListener("keydown", handleKey);

        return () =>
            window.removeEventListener("keydown", handleKey);

    }, [router]);

}
