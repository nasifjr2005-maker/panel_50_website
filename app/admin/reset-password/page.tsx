import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminResetPassword } from "@/components/admin/admin-reset-password";

export const metadata: Metadata = {
  title: "Reset Admin Password | PANEL 50",
  robots: { index: false, follow: false }
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className="min-h-screen p-6 text-white">Loading reset form...</main>}>
      <AdminResetPassword />
    </Suspense>
  );
}
