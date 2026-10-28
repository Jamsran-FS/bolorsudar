"use client";

import Link from "next/link";
import { useState } from "react";
import { btn, Card, Empty, ErrorNote, Field, inputCls, Loading, Modal, PageHeader, td, th, Toggle } from "@/components/admin/ui";
import { adminSend, useAdminQuery } from "@/lib/admin-api";
import type { Author } from "@/lib/types";

type Draft = { id?: number; name: string; slug: string; initials: string; bio: string; bg: string; fg: string; isFeatured: boolean };

const blank: Draft = { name: "", slug: "", initials: "", bio: "", bg: "#E3F1EB", fg: "#0E6B53", isFeatured: false };

export default function AdminAuthorsPage() {
  const { data, error, loading, reload } = useAdminQuery<Author[]>("/admin/authors");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;
    setSaving(true);
    setFormError(null);
    const body = {
      name: draft.name.trim(),
      slug: draft.slug.trim() || undefined,
      initials: draft.initials.trim() || undefined,
      bio: draft.bio.trim() || null,
      bg: draft.bg,
      fg: draft.fg,
      isFeatured: draft.isFeatured,
    };
    try {
      await adminSend(draft.id ? "PATCH" : "POST", draft.id ? `/admin/authors/${draft.id}` : "/admin/authors", body);
      setDraft(null);
      reload();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Хадгалж чадсангүй");
    } finally {
      setSaving(false);
    }
  }

  async function remove(a: Author) {
    const msg = a.bookCount ? `"${a.name}" ${a.bookCount} номтой. Устгавал тэдгээр ном зохиолчгүй болно. Үргэлжлүүлэх үү?` : `"${a.name}"-г устгах уу?`;
    if (!confirm(msg)) return;
    try {
      await adminSend("DELETE", `/admin/authors/${a.id}`);
      reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Устгаж чадсангүй");
    }
  }

  const edit = (a: Author) =>
    setDraft({ id: a.id, name: a.name, slug: a.slug, initials: a.initials, bio: a.bio ?? "", bg: a.bg, fg: a.fg, isFeatured: a.isFeatured });

  return (
    <>
      <PageHeader title="Зохиолчид">
        <button type="button" className={btn.primary} onClick={() => setDraft({ ...blank })}>
          + Шинэ зохиолч
        </button>
      </PageHeader>
      <ErrorNote message={error || actionError} />
      {!data ? (
        loading && <Loading />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="border-b border-line bg-surface/60">
              <tr>
                <th className={th}>Зохиолч</th>
                <th className={th}>Нүүрэнд</th>
                <th className={`${th} text-right`}>Ном</th>
                <th className={th} />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data.map((a) => (
                <tr key={a.id}>
                  <td className={td}>
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full font-display text-xs font-semibold" style={{ background: a.bg, color: a.fg }}>
                        {a.initials}
                      </span>
                      <span className="font-semibold">{a.name}</span>
                    </div>
                  </td>
                  <td className={td}>{a.isFeatured ? "✓ Тийм" : "—"}</td>
                  <td className={`${td} text-right`}>
                    <Link href={`/books?author=${a.slug}`} target="_blank" className="text-brand">
                      {a.bookCount}
                    </Link>
                  </td>
                  <td className={`${td} text-right`}>
                    <div className="flex justify-end gap-1">
                      <button type="button" className={btn.ghost} onClick={() => edit(a)}>
                        Засах
                      </button>
                      <button type="button" className={btn.danger} onClick={() => remove(a)}>
                        Устгах
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && <Empty>Зохиолч алга.</Empty>}
        </Card>
      )}

      {draft && (
        <Modal title={draft.id ? "Зохиолч засах" : "Шинэ зохиолч"} onClose={() => setDraft(null)}>
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
            <Field label="Нэр *" className="sm:col-span-2">
              <input required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Slug" hint="Хоосон бол нэрнээс үүснэ">
              <input pattern="[a-z0-9-]+" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Товчлол" hint="Хоосон бол автоматаар">
              <input maxLength={4} value={draft.initials} onChange={(e) => setDraft({ ...draft, initials: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Намтар" className="sm:col-span-2">
              <textarea rows={3} value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} className={`${inputCls} py-2`} />
            </Field>
            <Field label="Дэвсгэр өнгө">
              <input type="color" value={draft.bg} onChange={(e) => setDraft({ ...draft, bg: e.target.value })} className="h-10 w-full cursor-pointer rounded-xl" />
            </Field>
            <Field label="Текстийн өнгө">
              <input type="color" value={draft.fg} onChange={(e) => setDraft({ ...draft, fg: e.target.value })} className="h-10 w-full cursor-pointer rounded-xl" />
            </Field>
            <div className="sm:col-span-2">
              <Toggle label="Нүүр хуудасны “Алдартай зохиолчид” хэсэгт харуулах" checked={draft.isFeatured} onChange={(v) => setDraft({ ...draft, isFeatured: v })} />
            </div>
            <div className="sm:col-span-2">
              <ErrorNote message={formError} />
            </div>
            <div className="flex justify-end gap-2 sm:col-span-2">
              <button type="button" className={btn.ghost} onClick={() => setDraft(null)}>
                Болих
              </button>
              <button type="submit" disabled={saving} className={btn.primary}>
                {saving ? "Хадгалж байна…" : "Хадгалах"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
