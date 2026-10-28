"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { BookForm } from "@/components/admin/book-form";
import { ErrorNote, Loading, PageHeader } from "@/components/admin/ui";
import { useAdminQuery } from "@/lib/admin-api";
import type { BookDetail } from "@/lib/types";

export default function EditBookPage() {
  const { id } = useParams<{ id: string }>();
  const { data, error, loading } = useAdminQuery<BookDetail>(`/admin/books/${id}`);

  return (
    <>
      <Link href="/admin/books" className="mb-2 inline-block text-sm text-muted">
        ← Номууд
      </Link>
      <PageHeader title={data?.title ?? "Ном засах"} />
      <ErrorNote message={error} />
      {/* key resets the form when navigating from one book to another */}
      {data ? <BookForm key={data.id} book={data} /> : loading && <Loading />}
    </>
  );
}
