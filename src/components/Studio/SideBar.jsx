
import { useState } from "react";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  ChevronRight,
  CircleHelp,
  Home,
  Lightbulb,
  Menu,
  PenLine,
  Plus,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";

const navigation = [
  {
    title: "WORKSPACE",
    items: [
      { label: "Home", href: "/home/", icon: Home },
      { label: "Create", href: "/create/", icon: PenLine, badge: "AI" },
      { label: "Trends", href: "/trends/", icon: TrendingUp },
      { label: "Calendar", href: "/calendar/", icon: CalendarDays },
      { label: "Analytics", href: "/analytics/", icon: Activity },
    ],
  },
  {
    title: "YOUR SPACE",
    items: [
      { label: "Saved ideas", href: "/ideas/", icon: Lightbulb },
      { label: "Profile", href: "/profile/", icon: Users },
    ],
  },
];

function Brand() {
  return (
    <img className="w-24" src="/ILLIA.png" alt="" />
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        className="fixed left-4 top-4 z-30 rounded-xl border border-[#EEE9F2] bg-white p-2.5 text-[#6E647C] shadow-sm lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-[#21162E]/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[258px] flex-col border-r border-[#EEE9F2] bg-white px-5 py-6 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-9 flex items-center justify-between px-1">
          <Brand />

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="rounded-lg p-2 text-[#92899F] hover:bg-[#F6F3FA] lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

      
        <div className="space-y-8">
          {navigation.map((group) => (
            <div key={group.title}>
              <p className="mb-3 px-3 text-[10px] font-extrabold tracking-[1.8px] text-[#ABA2B7]">
                {group.title}
              </p>

              <nav className="space-y-1">
                {group.items.map(({ label, href, icon: Icon, badge }) => {
                  const active =
                    window.location.pathname.replace(/\/+$/, "") ===
                    href.replace(/\/+$/, "");

                  return (
                    <a
                      key={label}
                      href={href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`group flex min-h-[43px] items-center gap-3 rounded-xl px-3 text-[13px] font-semibold transition ${
                        active
                          ? "bg-violet-50 text-violet-700"
                          : "text-[#777083] hover:bg-[#F8F6FB] hover:text-[#352541]"
                      }`}
                    >
                      <Icon
                        size={18}
                        strokeWidth={active ? 2.4 : 1.9}
                      />

                      <span>{label}</span>

                      {badge && (
                        <span className="ml-auto rounded-md bg-violet-100 px-1.5 py-0.5 text-[9px] font-black text-violet-700">
                          {badge}
                        </span>
                      )}

                      {active && (
                        <ChevronRight
                          size={15}
                          className="ml-auto opacity-60"
                        />
                      )}
                    </a>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-8">
          <div className="relative mb-5 overflow-hidden rounded-[20px] bg-[#251932] p-4 text-white">
            <div className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-fuchsia-500/20 blur-2xl" />

            <div className="relative">
              <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-fuchsia-200">
                <Zap size={18} fill="currentColor" />
              </span>

              <p className="text-[13px] font-extrabold">
                Your next big idea starts here.
              </p>

              <p className="mt-2 text-[11px] leading-5 text-white/60">
                Make something your audience will remember.
              </p>

              <a
                href="/create/"
                onClick={() => setOpen(false)}
                className="mt-4 inline-flex items-center gap-2 text-[11px] font-bold text-fuchsia-200 hover:text-white"
              >
                Open creator studio <ArrowRight size={14} />
              </a>
            </div>
          </div>

          <a
            href="/settings/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-[12px] font-semibold text-[#777083] hover:bg-[#F8F6FB]"
          >
            <Settings size={18} />
            Settings
          </a>

          <button
            type="button"
            onClick={() => window.alert("Connect your help and support page here.")}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[12px] font-semibold text-[#777083] hover:bg-[#F8F6FB]"
          >
            <CircleHelp size={18} />
            Help &amp; support
          </button>
        </div>
      </aside>
    </>
  );
}
