import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layouts/base.tsx";
import {
  GITHUB_SEARCH_TYPES,
  type GithubSearchTypeKey,
} from "./services/githubSearchByType.ts";

export default function App() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            index
            element={
              <Navigate
                to={`search/${GITHUB_SEARCH_TYPES.issues.path}`}
                replace
              />
            }
          />
          {(Object.keys(GITHUB_SEARCH_TYPES) as GithubSearchTypeKey[]).map(
            (key) => {
              const cfg = GITHUB_SEARCH_TYPES[key];
              return (
                <Route
                  key={cfg.value}
                  path={`search/${cfg.path}`}
                  element={<div>{cfg.value}</div>}
                />
              );
            }
          )}
          <Route path="*" element={<div className="p-6">Not Found</div>} />
        </Route>
      </Routes>
    </Suspense>
  );
}
