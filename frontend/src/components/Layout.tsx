import { Compass, History, Image, LayoutDashboard, Menu, Settings, Sparkles, Wallet, Cpu, Boxes } from "lucide-react";
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
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside className={`${open ? "block" : "hidden"} fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 bg-[#07100f] p-5 lg:sticky lg:top-0 lg:block lg:h-screen`}>
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-pixol text-lg font-black text-ink">P</div>
          <div>
            <p className="text-lg font-black">PIXOL</p>
            <p className="text-xs font-bold uppercase text-slate-500">AI media market</p>
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
                  `${separated ? "mt-5 border-t border-white/10 pt-5" : ""} flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-extrabold transition ${
                    isActive ? "bg-pixol text-ink" : "text-slate-400 hover:bg-white/[0.07] hover:text-white"
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
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#07100f]/85 px-4 backdrop-blur lg:px-8">
          <button className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.06] lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
            <Menu size={20} />
          </button>
          <div className="hidden text-sm font-bold text-slate-400 lg:block">Mock inference protocol mode · No GPU node required</div>
          <WalletButton />
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
