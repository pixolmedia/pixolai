import { Boxes, Compass, Cpu, History, Image, LayoutDashboard, Menu, Search, Settings, Sparkles, Wallet } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { WalletButton } from "./WalletButton";

const links = [
  { to: "/", label: "Create", icon: Sparkles },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/models", label: "Models", icon: Boxes },
  { to: "/providers", label: "Providers", icon: Cpu },
  { to: "/creations", label: "My Creations", icon: Image },
  { to: "/history", label: "History", icon: History },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/wallet", label: "Wallet", icon: Wallet },
  { to: "/settings", label: "Settings", icon: Settings }
];

export function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-50 border-b border-cyan-200/25 bg-[#12243b]/72 px-4 py-2 text-center text-xs font-black uppercase tracking-wide text-cyan-100 shadow-[0_12px_34px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
        PIXOLAI is under construction. Features, routing and inference providers are in active development.
      </div>
      <div className="min-h-[calc(100vh-33px)] p-0 lg:grid lg:grid-cols-[292px_1fr] lg:p-4">
      <aside className={`${open ? "block" : "hidden"} fixed inset-y-0 left-0 z-40 w-72 border-r border-white/24 bg-[#24364f]/42 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur-[28px] lg:sticky lg:top-[calc(1rem+33px)] lg:block lg:h-[calc(100vh-2rem-33px)] lg:rounded-[28px] lg:border`}>
        <div className="mb-8 flex items-center gap-3">
          <img className="h-14 w-14 object-contain drop-shadow-[0_0_22px_rgba(42,204,255,0.66)]" src="/pixol-logo.png" alt="PIXOL" />
          <div>
            <p className="text-3xl font-black tracking-wide text-white">PIXOL</p>
            <p className="text-xs font-bold uppercase text-sky-100/72">AI media network</p>
          </div>
        </div>
        <nav className="space-y-1">
          {links.map((link, index) => {
            const Icon = link.icon;
            const separated = index === 7;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `${separated ? "mt-5 border-t border-white/15 pt-5" : ""} flex items-center gap-3 rounded-[18px] px-3 py-3 text-sm font-extrabold transition ${
                    isActive ? "bg-cyan-200/18 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_12px_28px_rgba(25,145,220,0.18)]" : "text-sky-50/72 hover:bg-white/[0.11] hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-[33px] z-30 flex h-16 items-center justify-between border-b border-white/18 bg-[#20344d]/24 px-4 backdrop-blur-[24px] lg:top-[calc(1rem+33px)] lg:mx-4 lg:rounded-[24px] lg:border lg:px-5">
          <button className="grid h-10 w-10 place-items-center rounded-lg border border-white/25 bg-white/[0.14] lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
            <Menu size={20} />
          </button>
          <div className="hidden h-11 min-w-[360px] items-center gap-3 rounded-2xl border border-white/28 bg-white/[0.18] px-4 text-sm font-bold text-sky-50/78 shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] lg:flex">
            <Search size={17} />
            <span>Search tasks, models, providers</span>
          </div>
          <div className="hidden text-sm font-bold text-sky-100/72 xl:block">SOLAI routing · Local inference configurable</div>
          <WalletButton />
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
          <Outlet />
        </main>
      </div>
      </div>
    </div>
  );
}
