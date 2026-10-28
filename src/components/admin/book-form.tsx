"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookCover } from "@/components/shop/book-cover";
import { adminSend, useAdminQuery } from "@/lib/admin-api";
import type { Author, BookDetail, Category } from "@/lib/types";
import { btn, Card, ErrorNote, Field, inputCls, Toggle } from "./ui";

const COVER_SWATCHES = ["#1F3A5F", "#4B3F72", "#9E4130", "#2F5D50", "#9A5B17", "#3E6C8A", "#7A3E5C", "#4E6E55", "#2B2B2B"];

type FormState = {
  title: string;
  slug: string;
  authorId: string;
  categoryId: string;
  price: string;
  oldPrice: string;
  stock: string;
  coverColor: string;
  coverImage: string;
  summary: string;
  description: string;
  badge: string;
  tag: string;
  translator: string;
  pages: string;
  binding: "" | "soft" | "hard";
  isbn: string;
  isNew: boolean;
  isBestseller: boolean;
  isComingSoon: boolean;
  isFeatured: boolean;
  isPublished: boolean;
};

function toForm(b?: BookDetail): FormState {
  const s = (v: string | number | null | undefined) => (v == null ? "" : String(v));
  return {
    title: s(b?.title),
    slug: s(b?.slug),
    authorId: s(b?.authorId),
    categoryId: s(b?.categoryId),
    price: s(b?.price),
    oldPrice: s(b?.oldPrice),
    stock: s(b?.stock ?? 0),
    coverColor: b?.coverColor ?? COVER_SWATCHES[0],
    coverImage: s(b?.coverImage),
    summary: s(b?.summary),
    description: s(b?.description),
    badge: s(b?.badge),
    tag: s(b?.tag),
    translator: s(b?.translator),
    pages: s(b?.pages),
    binding: b?.binding ?? "",
    isbn: s(b?.isbn),
    isNew: b?.isNew ?? false,
    isBestseller: b?.isBestseller ?? false,
    isComingSoon: b?.isComingSoon ?? false,
    isFeatured: b?.isFeatured ?? false,
    isPublished: b?.isPublished ?? true,
  };
}

/** Empty text → null so optional columns are cleared rather than set to "". */
function toPayload(f: FormState, isNew: boolean) {
  const text = (v: string) => (v.trim() === "" ? null : v.trim());
  const num = (v: string) => (v.trim() === "" ? null : Number(v));
  const payload: Record<string, unknown> = {
    title: f.title.trim(),
    authorId: num(f.authorId),
    categoryId: num(f.categoryId),
    price: Number(f.price),
    oldPrice: num(f.oldPrice),
    stock: Number(f.stock || 0),
    coverColor: f.coverColor,
    coverImage: text(f.coverImage),
    summary: text(f.summary),
    description: text(f.description),
    badge: text(f.badge),
    tag: text(f.tag),
    translator: text(f.translator),
    pages: num(f.pages),
    binding: f.binding || null,
    isbn: text(f.isbn),
    isNew: f.isNew,
    isBestseller: f.isBestseller,
    isComingSoon: f.isComingSoon,
    isFeatured: f.isFeatured,
    isPublished: f.isPublished,
  };
  // A blank slug on create lets the API derive one from the title
  if (f.slug.trim() || !isNew) payload.slug = f.slug.trim() || undefined;
  return payload;
}

export function BookForm({ book }: { book?: BookDetail }) {
  const router = useRouter();
  const isNew = !book;
  const [f, setF] = useState<FormState>(() => toForm(book));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authors = useAdminQuery<Author[]>("/admin/authors");
  const categories = useAdminQuery<Category[]>("/admin/categories");

  const set = <K extends keyof FormState>(key: K) => (value: FormState[K]) => setF((s) => ({ ...s, [key]: value }));
  const onText = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((s) => ({ ...s, [key]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const saved = await adminSend<BookDetail>(isNew ? "POST" : "PATCH", isNew ? "/admin/books" : `/admin/books/${book.id}`, toPayload(f, isNew));
      if (isNew) router.replace(`/admin/books/${saved.id}`);
      else setF(toForm(saved));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Хадгалж чадсангүй");
    } finally {
      setSaving(false);
    }
  }

  const authorName = authors.data?.find((a) => String(a.id) === f.authorId)?.name ?? null;

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-6">
        <Card className="grid gap-4 p-5 sm:grid-cols-2">
          <Field label="Номын нэр *" className="sm:col-span-2">
            <input required value={f.title} onChange={onText("title")} className={inputCls} />
          </Field>
          <Field label="Slug (URL)" hint={isNew ? "Хоосон үлдээвэл нэрнээс автоматаар үүснэ" : undefined}>
            <input value={f.slug} onChange={onText("slug")} pattern="[a-z0-9-]+" className={inputCls} placeholder="klara-nar-khoer" />
          </Field>
          <Field label="ISBN">
            <input value={f.isbn} onChange={onText("isbn")} maxLength={20} className={inputCls} />
          </Field>
          <Field label="Зохиолч">
            <select value={f.authorId} onChange={onText("authorId")} className={inputCls}>
              <option value="">— Сонгоогүй —</option>
              {authors.data?.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Ангилал">
            <select value={f.categoryId} onChange={onText("categoryId")} className={inputCls}>
              <option value="">— Сонгоогүй —</option>
              {categories.data?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
        </Card>

        <Card className="grid gap-4 p-5 sm:grid-cols-3">
          <Field label="Үнэ (₮) *">
            <input required type="number" min={0} step={100} value={f.price} onChange={onText("price")} className={inputCls} />
          </Field>
          <Field label="Хуучин үнэ (₮)" hint="Хямдралд байгаа бол">
            <input type="number" min={0} step={100} value={f.oldPrice} onChange={onText("oldPrice")} className={inputCls} />
          </Field>
          <Field label="Үлдэгдэл">
            <input type="number" min={0} value={f.stock} onChange={onText("stock")} className={inputCls} />
          </Field>
        </Card>

        <Card className="grid gap-4 p-5">
          <Field label="Товч танилцуулга" hint="Үнийн доор харагдана">
            <textarea rows={3} value={f.summary} onChange={onText("summary")} className={`${inputCls} py-2`} />
          </Field>
          <Field label="Дэлгэрэнгүй тайлбар" hint="“Тайлбар” табд харагдана">
            <textarea rows={6} value={f.description} onChange={onText("description")} className={`${inputCls} py-2`} />
          </Field>
        </Card>

        <Card className="grid gap-4 p-5 sm:grid-cols-2">
          <Field label="Орчуулагч">
            <input value={f.translator} onChange={onText("translator")} className={inputCls} />
          </Field>
          <Field label="Хуудасны тоо">
            <input type="number" min={1} value={f.pages} onChange={onText("pages")} className={inputCls} />
          </Field>
          <Field label="Хавтас">
            <select value={f.binding} onChange={onText("binding")} className={inputCls}>
              <option value="">—</option>
              <option value="soft">Зөөлөн</option>
              <option value="hard">Хатуу</option>
            </select>
          </Field>
          <Field label="Тэмдэг" hint="Жишээ: Нобелийн шагналт зохиолч">
            <input value={f.badge} onChange={onText("badge")} maxLength={80} className={inputCls} />
          </Field>
          <Field label="Картын шошго" hint="Хавтасны буланд: Шинэ, Топ 1…">
            <input value={f.tag} onChange={onText("tag")} maxLength={40} className={inputCls} />
          </Field>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="flex flex-col gap-4 p-5">
          <BookCover
            book={{ title: f.title || "Номын нэр", authorName, coverColor: f.coverColor, coverImage: f.coverImage || null }}
            className="mx-auto w-40"
          />
          <Field label="Хавтасны өнгө">
            <div className="flex flex-wrap gap-1.5">
              {COVER_SWATCHES.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={c}
                  aria-pressed={f.coverColor === c}
                  onClick={() => set("coverColor")(c)}
                  className={`h-7 w-7 cursor-pointer rounded-md ${f.coverColor === c ? "ring-2 ring-brand ring-offset-2" : ""}`}
                  style={{ background: c }}
                />
              ))}
              <input type="color" value={f.coverColor} onChange={onText("coverColor")} aria-label="Өөр өнгө" className="h-7 w-9 cursor-pointer" />
            </div>
          </Field>
          <Field label="Хавтасны зураг (URL)" hint="Оруулбал өнгөний оронд зураг харагдана">
            <input type="url" value={f.coverImage} onChange={onText("coverImage")} className={inputCls} placeholder="https://…" />
          </Field>
        </Card>

        <Card className="flex flex-col gap-3 p-5">
          <Toggle label="Сайтад нийтлэх" checked={f.isPublished} onChange={set("isPublished")} />
          <Toggle label="Шинэ" checked={f.isNew} onChange={set("isNew")} />
          <Toggle label="Бэстселлер" checked={f.isBestseller} onChange={set("isBestseller")} />
          <Toggle label="Тун удахгүй" checked={f.isComingSoon} onChange={set("isComingSoon")} />
          <Toggle label="Сарын онцлох" checked={f.isFeatured} onChange={set("isFeatured")} />
        </Card>

        <ErrorNote message={error} />
        <button type="submit" disabled={saving} className={`${btn.primary} min-h-11`}>
          {saving ? "Хадгалж байна…" : isNew ? "Ном нэмэх" : "Хадгалах"}
        </button>
        {!isNew && (
          <a href={`/books/${book.slug}`} target="_blank" className="text-center text-sm text-brand">
            Сайт дээр харах ↗
          </a>
        )}
      </div>
    </form>
  );
}
