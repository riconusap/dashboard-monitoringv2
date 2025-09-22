export interface KnowledgebaseCategory {
  id: number;
  name: string;
  children: KnowledgebaseCategory[];
}

export interface KnowledgebaseArticle {
  id: number;
  category_id: number;
  title: string;
  author: string;
  updated_at: string;
  updated_by: string;
  created_at: string;
  created_by: string;
  content: string;
  read_time: number;
  views: number;
  tags: string[];
}

export interface KnowledgebaseApplication {
  app_id: number;
  name: string;
  category_list: KnowledgebaseCategory[];
  article_list: KnowledgebaseArticle[];
}

export interface KnowledgebaseState {
  applications: KnowledgebaseApplication[];
  selectedApp: KnowledgebaseApplication | null;
  selectedCategory: KnowledgebaseCategory | null;
  selectedArticle: KnowledgebaseArticle | null;
  searchQuery: string;
  searchResults: any[];
  favorites: {
    apps: number[];
    articles: number[];
  };
}

export interface BreadcrumbItem {
  name: string;
  path?: string;
  active?: boolean;
}
