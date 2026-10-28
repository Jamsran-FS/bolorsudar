import { Suspense } from "react";
import { BottomNav, BottomNavView, Header, HeaderView } from "@/components/shop/header";
import { Footer } from "@/components/shop/footer";

export default function ShopLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Suspense fallback={<HeaderView pathname="" />}>
        <Header />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
      <Suspense fallback={<BottomNavView pathname="" />}>
        <BottomNav />
      </Suspense>
    </div>
  );
}
