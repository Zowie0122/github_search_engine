import { Outlet } from "react-router-dom";
import NavLink from "./NavLink";
import {
  GITHUB_SEARCH_TYPES,
  type GithubSearchTypeKey,
} from "../../services/githubSearchByType";

const AppLayout: React.FC = () => {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="mx-auto max-w-5xl p-4 flex items-center justify-between">
          <h1 className="header-title">Github Search</h1>

          <div className="flex gap-3 items-baseline">
            <span className="text-secondary"> Search By</span>
            <nav className="flex gap-2">
              {(Object.keys(GITHUB_SEARCH_TYPES) as GithubSearchTypeKey[])
                .filter(
                  (type) =>
                    (GITHUB_SEARCH_TYPES[type].requiresAuth && token) ||
                    !GITHUB_SEARCH_TYPES[type].requiresAuth
                )
                .map((type) => (
                  <NavLink
                    to={`/search/${GITHUB_SEARCH_TYPES[type].path}`}
                    key={type}
                  >
                    {GITHUB_SEARCH_TYPES[type].value}
                  </NavLink>
                ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
