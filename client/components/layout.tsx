import { useRouter } from "next/router";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Main content */}
      <div className="flex-grow">{children}</div>

      {/* Tab Navigation */}
      <div
        role="tablist"
        className="fixed bottom-0 left-0 right-0 tabs tabs-boxed p-3 z-30"
      >
        <a
          role="tab"
          className={`tab h-16 ${isActive("/") ? "border-2 border-accent shadow-glow" : ""}`}
          href="/"
        >
          <img src="/icons/white/home-1.svg" alt="Home" className="w-8 h-8" />
        </a>
        <a
          role="tab"
          className={`tab h-16 ${isActive("/shop") ? "border-2 border-accent shadow-glow" : ""}`}
          href="/shop"
        >
          <img src="/icons/white/basket.svg" alt="Shop" className="w-8 h-8" />
        </a>
        <a
          role="tab"
          className={`tab h-16 ${isActive("/staking") ? "border-2 border-accent shadow-glow" : ""}`}
          href="/staking"
        >
          <img src="/icons/white/invoice-1.svg" alt="Staking" className="w-8 h-8" />
        </a>
        <a
          role="tab"
          className={`tab h-16 ${isActive("/payment") ? "border-2 border-accent shadow-glow" : ""}`}
          href="/payment"
        >
          <img src="/icons/white/user-group.svg" alt="Stars" className="w-8 h-8" />
        </a>
        <a
          role="tab"
          className={`tab h-16 ${isActive("/periodic-table") ? "border-2 border-accent shadow-glow" : ""}`}
          href="/periodic-table"
        >
          <img src="/icons/white/periodic-table.svg" alt="Periodic Table" className="w-8 h-8" />
        </a>
      </div>
    </div>
  );
};

export default Layout;
