# GitHub Search App

A demo React application that wraps the **GitHub Search API** with React Query and TailwindCSS.  
It allows you to search across issues, repositories, users, labels, and more, with support for authenticated requests (to avoid low unauthenticated rate limits).

---

## 🚀 Features

- **Search GitHub content** by issues, repositories, code, commits, users, topics, and labels.
- **Authentication support**: use your personal access token to raise API limits and can do commits and code search. Otherwise, these two search would be removed from the UI.
- **Optimized fetching** with React Query:
  - **Prefetch on Idle** → next page of results is prefetched when the browser is idle.
  - **Prefetch on Hover** → hovering over pagination controls triggers a delayed prefetch for that page.
  - **Debounced page input** → jumping directly to a page is debounced and triggers a prefetch for that page.
- **Custom error handling** with `GithubSearchError` (rate limit, auth required, validation, etc.).

---

## 🛠 Getting Started

### 1. Clone the repository

```bash
git clone git@github.com:Zowie0122/github_search_engine.git
cd github-search
```

Go to http://localhost:5173/

---

## Notes

- **Commits Search** → always requires authentication.
- **Issues, Code, Labels** → effectively require authentication to be useful, since the unauthenticated rate limit is only 10 requests per minute.
- Navigation links for types that require authentication are automatically disabled if no token is found in `.env.local`.
- Errors like **rate limit exceeded** are caught and displayed in the UI, with helpful details such as reset time when available.
