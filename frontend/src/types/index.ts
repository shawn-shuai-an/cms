// 页面数据类型
export interface PageData {
  id: number;
  slug: string;
  template_type: string;
  status: string;
  seo_title_zh?: string;
  seo_title_en?: string;
  seo_description_zh?: string;
  seo_description_en?: string;
  seo_keywords?: string;
  menu_id?: number;
  created_at: string;
  updated_at: string;
  // 多语言内容
  title_zh?: string;
  title_en?: string;
  content_zh?: string;
  content_en?: string;
  excerpt_zh?: string;
  excerpt_en?: string;
}

// 菜单数据类型
export interface MenuData {
  id: number;
  parent_id?: number;
  name_zh?: string;
  name_en?: string;
  url: string;
  sort_order: number;
  is_visible: boolean;
  icon?: string;
  children?: MenuData[];
}

// 组件数据类型（与管理后台保持一致）
export interface ComponentData {
  id: string;
  type: 'text' | 'card' | 'grid' | 'hero';
  data: any;
}

export interface SubComponentData {
  id: string;
  type: 'image' | 'text' | 'button';
  data: any;
}

// 网站设置类型
export interface SiteSettings {
  site_name_zh?: string;
  site_name_en?: string;
  site_description_zh?: string;
  site_description_en?: string;
  logo_url?: string;
  favicon_url?: string;
  contact_email?: string;
  contact_phone?: string;
} 