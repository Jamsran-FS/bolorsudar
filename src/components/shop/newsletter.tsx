"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      await apiFetch("/subscribers", { method: "POST", body: JSON.stringify({ email }) });
      setState("done");
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Алдаа гарлаа");
      setState("error");
    }
  }

  return (
    <section id="news" className="mx-auto max-w-[1280px] px-4 py-14 md:px-6 md:py-20">
      <div className="flex flex-wrap items-center justify-between gap-8 rounded-[24px] border border-line p-6 md:rounded-[28px] md:p-12">
        <div className="flex flex-[1_1_360px] flex-col gap-2.5">
          <h2 className="font-display text-xl font-semibold tracking-[-0.02em] md:text-[28px]">Шинэ номын мэдээ авах</h2>
          <p className="leading-relaxed text-muted">Шинээр ирсэн ном, хямдралын мэдээллийг имэйлээр түрүүлж аваарай.</p>
        </div>
        <form onSubmit={submit} className="flex flex-[1_1_400px] flex-wrap gap-2.5">
          <label htmlFor="email" className="sr-only">
            Имэйл хаяг
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Имэйл хаягаа оруулна уу"
            className="min-h-[52px] flex-[1_1_220px] rounded-full border border-line-strong px-5 text-[15px] text-ink"
          />
          <button
            type="submit"
            disabled={state === "sending"}
            className="min-h-[52px] cursor-pointer rounded-full bg-brand px-7 text-base font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {state === "sending" ? "Илгээж байна…" : "Бүртгүүлэх"}
          </button>
          <p aria-live="polite" className={`w-full text-sm ${state === "error" ? "text-sale" : "text-brand"}`}>
            {state === "done" && "Баярлалаа! Та амжилттай бүртгүүллээ."}
            {state === "error" && error}
          </p>
        </form>
      </div>
    </section>
  );
}
