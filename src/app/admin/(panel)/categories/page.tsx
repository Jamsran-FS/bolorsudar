"use client";

import { useState } from "react";
import { btn, Card, Empty, ErrorNote, Field, inputCls, Loading, Modal, PageHeader, td, th } from "@/components/admin/ui";
import { adminSend, useAdminQuery } from "@/lib/admin-api";
import type { Category } from "@/lib/types";

type Draft = { id?: number; name: string; slug: string; bg: string; fg: string; sortOrder: string };

const blank: Draft = { name: "", slug: "", bg: "#E3F1EB", fg: "#0E6B53", sortOrder: "0" };

export default function AdminCategoriesPage() {
  const { data, error, loading, reload } = useAdminQuery<Category[]>("/admin/categories");
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
      bg: draft.bg,
      fg: draft.fg,
      sortOrder: Number(draft.sortOrder || 0),
    };
    try {
      await adminSend(draft.id ? "PATCH" : "POST", draft.id ? `/admin/categories/${draft.id}` : "/admin/categories", body);
      setDraft(null);
      reload();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Хадгалж чадсангүй");
    } finally {
      setSaving(false);
    }
  }

  async function remove(c: Category) {
    const msg = c.bookCount ? `"${c.name}" ангилалд ${c.bookCount} ном байна. Устгавал тэдгээр ном ангилалгүй болно. Үргэлжлүүлэх үү?` : `"${c.name}" ангиллыг устгах уу?`;
    if (!confirm(msg)) return;
    try {
      await adminSend("DELETE", `/admin/categories/${c.id}`);
      reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Устгаж чадсангүй");
    }
  }

  const edit = (c: Category) => setDraft({ id: c.id, name: c.name, slug: c.slug, bg: c.bg, fg: c.fg, sortOrder: String(c.sortOrder) });

  return (
    <>
      <PageHeader title="Ангилал">
        <button type="button" className={btn.primary} onClick={() => setDraft({ ...blank })}>
          + Шинэ ангилал
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
                <th className={th}>Нэр</th>
                <th className={th}>Slug</th>
                <th className={`${th} text-right`}>Дараалал</th>
                <th className={`${th} text-right`}>Ном</th>
                <th className={th} />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data.map((c) => (
                <tr key={c.id}>
                  <td className={td}>
                    <span className="rounded-full px-3 py-1.5 text-sm font-semibold" style={{ background: c.bg, color: c.fg }}>
                      {c.name}
                    </span>
                  </td>
                  <td className={`${td} font-mono text-xs text-muted`}>{c.slug}</td>
                  <td className={`${td} text-right`}>{c.sortOrder}</td>
                  <td className={`${td} text-right`}>{c.bookCount}</td>
                  <td className={`${td} text-right`}>
                    <div className="flex justify-end gap-1">
                      <button type="button" className={btn.ghost} onClick={() => edit(c)}>
                        Засах
                      </button>
                      <button type="button" className={btn.danger} onClick={() => remove(c)}>
                        Устгах
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && <Empty>Ангилал алга.</Empty>}
        </Card>
      )}

      {draft && (
        <Modal title={draft.id ? "Ангилал засах" : "Шинэ ангилал"} onClose={() => setDraft(null)}>
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
            <Field label="Нэр *" className="sm:col-span-2">
              <input required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Slug" hint="Хоосон бол нэрнээс үүснэ">
              <input pattern="[a-z0-9-]+" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Дараалал">
              <input type="number" value={draft.sortOrder} onChange={(e) => setDraft({ ...draft, sortOrder: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Дэвсгэр өнгө">
              <input type="color" value={draft.bg} onChange={(e) => setDraft({ ...draft, bg: e.target.value })} className="h-10 w-full cursor-pointer rounded-xl" />
            </Field>
            <Field label="Текстийн өнгө">
              <input type="color" value={draft.fg} onChange={(e) => setDraft({ ...draft, fg: e.target.value })} className="h-10 w-full cursor-pointer rounded-xl" />
            </Field>
            <div className="sm:col-span-2">
              <span className="rounded-full px-4 py-3 text-sm font-semibold" style={{ background: draft.bg, color: draft.fg }}>
                {draft.name || "Урьдчилан харах"}
              </span>
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
