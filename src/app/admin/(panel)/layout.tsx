import { Suspense } from "react";
import { AdminShell } from "@/components/admin/shell";

export const metadata = { title: "Админ", robots: { index: false } };

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense fallback={<div className="flex flex-1 items-center justify-center text-sm text-muted">Ачаалж байна…</div>}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
