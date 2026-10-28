"use client";

import Link from "next/link";
import { BookForm } from "@/components/admin/book-form";
import { PageHeader } from "@/components/admin/ui";

export default function NewBookPage() {
  return (
    <>
      <Link href="/admin/books" className="mb-2 inline-block text-sm text-muted">
        ← Номууд
      </Link>
      <PageHeader title="Шинэ ном" />
      <BookForm />
    </>
  );
}
