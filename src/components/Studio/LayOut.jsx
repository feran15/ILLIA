import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./SideBar";
import Topbar from "./Topbar";
import { WorkspaceSearchContext } from "./WorkspaceSearch";

const NAV = [
  ["Home", "/studio"],
  ["Create", "/studio/create"],
  ["Trends", "/studio/trends"],
  ["Calendar", "/studio/calendar"],
  ["Analytics", "/studio/analytics"],
  ["Saved ideas", "/studio/ideas"],
  ["Templates", "/studio/templates"],
  ["Media", "/studio/media"],
  ["Profile", "/studio/profile"],
  ["Settings", "/studio/settings"],
  ["Feedback", "/studio/feedback"],
];

function getPageTitle(pathname) {
  const page = NAV.find(([, path]) =>
    path === "/studio"
      ? pathname === "/studio" || pathname === "/studio/"
      : pathname === path || pathname.startsWith(`${path}/`)
  );

  return page?.[0] || "Studio";
}

export default function LayOut({ children }) {
  const { pathname } = useLocation();
  const pageTitle = getPageTitle(pathname);

  const [search, setSearch] = useState("");
  const searchValue = useMemo(() => ({ search, setSearch }), [search]);

  // start each page with an empty search box
  useEffect(() => setSearch(""), [pathname]);

  return (
    <WorkspaceSearchContext.Provider value={searchValue}>
      <div
        className="flex min-h-screen w-full bg-[#241528] text-white"
        data-page={pageTitle.toLowerCase()}
      >
        <Sidebar />

        <main className="flex min-w-0 flex-1 flex-col">
          <Topbar title={pageTitle} />
          {/* pages fill the space under the header with flex-1 */}
          <div className="flex flex-1 flex-col">{children}</div>
        </main>
      </div>
    </WorkspaceSearchContext.Provider>
  );
}