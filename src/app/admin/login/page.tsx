"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { btn, ErrorNote, Field, inputCls } from "@/components/admin/ui";
import { Logo } from "@/components/shop/header";
import { apiFetch } from "@/lib/api";
import { setToken } from "@/lib/admin-api";

type LoginResponse = { accessToken: string; user: { role: string } };

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await apiFetch<LoginResponse>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      if (res.user.role !== "admin") throw new Error("Энэ хэрэглэгч админ эрхгүй байна");
      setToken(res.accessToken);
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Нэвтрэхэд алдаа гарлаа");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-surface px-4">
      <form onSubmit={submit} className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-line bg-white p-8">
        <Logo />
        <h1 className="font-display text-xl font-semibold">Админ нэвтрэх</h1>
        <Field label="Имэйл">
          <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Нууц үг">
          <input type="password" required minLength={6} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
        </Field>
        <ErrorNote message={error} />
        <button type="submit" disabled={sending} className={`${btn.primary} min-h-11`}>
          {sending ? "Шалгаж байна…" : "Нэвтрэх"}
        </button>
      </form>
    </div>
  );
}
