// Re-export constants from the centralized constants file
import { SITE_CONFIG } from './constants/index';
export { SITE_CONFIG, THEME_COLORS, BREAKPOINTS, COLLECTIONS, POSTS_PER_PAGE, FEATURED_POSTS_LIMIT, SOCIAL_LINKS } from './constants/index';

// Legacy exports for backward compatibility
export const SITE_TITLE = SITE_CONFIG.title;
export const SITE_DESCRIPTION = SITE_CONFIG.description;
