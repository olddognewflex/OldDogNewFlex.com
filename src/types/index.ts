// Centralized TypeScript types for the project

export interface BaseLayoutProps {
  title: string;
  description?: string;
  canonicalURL?: string;
  heroImage?: string;
  heroAlt?: string;
  heroTaglineElement?: unknown;
  article?: boolean;
  publishedDate?: Date;
  updatedDate?: Date;
  author?: string;
  tags?: string[];
}

export interface BlogPostData {
  title: string;
  subtitle?: string;
  summary: string;
  publishedDate: Date;
  updatedDate?: Date;
  heroImage?: string;
  tags?: string[];
  featured?: boolean;
  draft?: boolean;
}

export interface BlogPost {
  collection: 'learn' | 'share' | 'journey';
  filePath: string;
  data: BlogPostData;
  body?: string;
}

export interface ButtonProps {
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  class?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface CardProps {
  variant?: 'default' | 'featured' | 'elevated';
  padding?: 'sm' | 'md' | 'lg';
  class?: string;
}

export interface BadgeProps {
  variant?: 'default' | 'collection' | 'tag' | 'featured';
  size?: 'sm' | 'md' | 'lg';
  class?: string;
}

export interface ContainerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  class?: string;
}

export interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  class?: string;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
}

export interface HeaderLinkProps {
  href: string;
  class?: string;
}

export interface PageHeroProps {
  heroImage: string;
  heroAlt: string;
  heroTaglineElement?: unknown;
}

export interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export interface FormattedDateProps {
  date: Date;
}

export interface ThemePillsProps {
  // Add theme-related props as needed
}

export interface BaseHeadProps {
  title: string;
  description: string;
  image?: string;
  canonicalURL?: string;
  article?: boolean;
  publishedDate?: Date;
  updatedDate?: Date;
  author?: string;
  tags?: string[];
} 