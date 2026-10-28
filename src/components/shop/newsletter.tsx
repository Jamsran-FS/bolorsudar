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
    <section id="news" className="scroll-mt-20 bg-brand text-white">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-8 px-4 py-14 md:px-6 md:py-20">
        <div className="flex flex-[1_1_360px] flex-col gap-2.5">
          <h2 className="font-display text-[22px] font-bold uppercase tracking-[.1em] md:text-[28px]">Шинэ номын мэдээ авах</h2>
          <p className="leading-relaxed text-white/85">Шинээр ирсэн ном, хямдралын мэдээллийг имэйлээр түрүүлж аваарай.</p>
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
            className="min-h-[54px] flex-[1_1_220px] rounded-btn border-0 bg-white px-5 text-[15px] text-ink"
          />
          <button
            type="submit"
            disabled={state === "sending"}
            className="min-h-[54px] cursor-pointer rounded-btn bg-ink px-8 font-display text-[15px] font-bold uppercase tracking-[.08em] text-white hover:bg-night disabled:opacity-60"
          >
            {state === "sending" ? "Илгээж байна…" : "Бүртгүүлэх"}
          </button>
          <p aria-live="polite" className="w-full text-sm font-medium text-white">
            {state === "done" && "Баярлалаа! Та амжилттай бүртгүүллээ."}
            {state === "error" && error}
          </p>
        </form>
      </div>
    </section>
  );
}
