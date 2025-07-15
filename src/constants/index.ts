// Centralized constants for the project

export const SITE_CONFIG = {
  title: "Old Dog New Flex",
  description: "Proving it's never too late to refactor your comfort zone",
  url: "https://olddognewflex.com",
  author: "Old Dog New Flex",
  twitter: "@OldDogNewFlex",
  mastodon: "https://techhub.social/@olddognewflex"
} as const;

export const THEME_COLORS = {
  primary: 'var(--color-blue)',
  secondary: 'var(--color-mauve)',
  accent: 'var(--color-flamingo)',
  background: 'var(--color-base)',
  text: 'var(--color-text)',
  surface: 'var(--color-surface0)'
} as const;

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

export const COLLECTIONS = {
  learn: 'learn',
  share: 'share',
  journey: 'journey'
} as const;

export const POSTS_PER_PAGE = 6;
export const FEATURED_POSTS_LIMIT = 3;

export const SOCIAL_LINKS = {
  mastodon: {
    url: "https://techhub.social/@olddognewflex",
    label: "Follow Old Dog, New Flex on Mastodon"
  },
  twitter: {
    url: "https://x.com/OldDogNewFlex",
    label: "Follow Old Dog, New Flex on X (Twitter)"
  }
} as const; 