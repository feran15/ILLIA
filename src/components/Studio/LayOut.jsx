import { useLocation } from "react-router-dom";

const NAV = [
  ["Home", "/studio"],
  ["Create", "/studio/create"],
  ["Trends", "/studio/trends"],
  ["Calendar", "/studio/calendar"],
  ["Analytics", "/studio/analytics"],
  ["Profile", "/studio/profile"],
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

  return (
    <div className="min-h-screen w-full bg-white text-ink">
      {children}
    </div>
  );
}