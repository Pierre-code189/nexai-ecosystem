export interface SandboxProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  prompt: string;
  jsxCode: string;
  readmeContent?: string;
  createdAt: string;
  updatedAt: string;
  author?: string;
  industry?: string;
  tenantId?: string;
}

export interface WebsiteTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  darkMode?: boolean;
}

export interface WebsiteHero {
  badge?: string;
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  bannerImageUrl?: string;
  backgroundGradient?: string;
}

export interface WebsiteServiceItem {
  id: string;
  title: string;
  description: string;
  price?: string;
  numericPrice?: number;
  imageUrl?: string;
  category?: string;
}

export interface WebsiteTestimonial {
  id: string;
  author: string;
  role: string;
  comment: string;
  rating: number;
  avatarUrl?: string;
}

export interface WebsiteMapConfig {
  enabled: boolean;
  address: string;
  city: string;
  embedUrl?: string;
}

export interface WebsiteCartItem {
  serviceId: string;
  title: string;
  price: string;
  numericPrice: number;
  quantity: number;
}

export interface WebsiteSection {
  id: string;
  type: 'hero' | 'catalog' | 'contact' | 'features' | 'testimonials' | 'map' | 'custom';
  title?: string;
  subtitle?: string;
  content?: string;
  items?: any[];
}

export interface WebsitePage {
  id: string;
  route: string;
  title: string;
  isHomePage?: boolean;
  sections: WebsiteSection[];
}

export interface GeneratedWebsite {
  id: string;
  slug: string;
  businessName: string;
  tagline?: string;
  detectedIndustry?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  theme?: WebsiteTheme;
  hero?: WebsiteHero;
  services?: WebsiteServiceItem[];
  aboutText?: string;
  testimonials?: WebsiteTestimonial[];
  map?: WebsiteMapConfig;
  hasCart?: boolean;
  pages?: WebsitePage[];
  language?: string;
  framework?: string;
  jsxCode?: string;
  readmeContent?: string;
  readmeMarkdown?: string;
  createdAt?: string;
  updatedAt?: string;
  tenantId?: string;
}
