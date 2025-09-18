import axios, { AxiosHeaders } from "axios";

const githubSearchApiBase = axios.create({
  baseURL: import.meta.env.VITE_GITHUB_API,
  headers: {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": import.meta.env.VITE_GITHUB_API_VERSION,
  },
});

githubSearchApiBase.interceptors.request.use((config) => {
  const token = import.meta.env.VITE_GITHUB_TOKEN;

  config.headers = AxiosHeaders.from(config.headers);

  const header = config.headers as AxiosHeaders;
  if (token) {
    header.set("Authorization", `Bearer ${token}`);
  } else {
    header.delete("Authorization");
  }
  return config;
});

export default githubSearchApiBase;
