import { Suspense } from "react";
import { BottomNav, BottomNavView, Header } from "@/components/shop/header";
import { Footer } from "@/components/shop/footer";

export default function ShopLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <Suspense fallback={<BottomNavView pathname="" />}>
        <BottomNav />
      </Suspense>
    </div>
  );
}
