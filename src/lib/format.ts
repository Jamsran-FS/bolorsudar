import type { OrderStatus } from "./types";

export function formatPrice(value: number) {
  return value.toLocaleString("en-US") + "₮";
}

export function formatDate(value: string | Date) {
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Хүлээгдэж буй",
  confirmed: "Баталгаажсан",
  shipped: "Хүргэлтэнд гарсан",
  delivered: "Хүргэгдсэн",
  cancelled: "Цуцлагдсан",
};

export const ORDER_STATUS_STYLE: Record<OrderStatus, string> = {
  pending: "bg-[#FDF1D8] text-[#8A5A0B]",
  confirmed: "bg-[#E5ECF6] text-[#1F3A5F]",
  shipped: "bg-lilac text-[#4B3F72]",
  delivered: "bg-brand-soft text-brand",
  cancelled: "bg-[#F6E6E3] text-sale",
};
