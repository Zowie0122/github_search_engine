interface GitHubUser {
  id: number;
  avatar_url: string;
  url: string;
  html_url: string;
}

export interface SearchResultItem {
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  id: number;
  title: string;
  user: GitHubUser;
  updated_at: string;
}
