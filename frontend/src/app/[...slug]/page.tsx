import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Layout from '@/components/Layout/Layout';
import ClientPageWrapper from '@/components/ClientPageWrapper';
import { PageData, ComponentData } from '@/types';
import { query } from '@/lib/database';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

async function getPageData(slug: string): Promise<PageData | null> {
  try {
    console.log('🔍 直接查询数据库获取页面数据, slug =', slug);
    
    // 直接查询数据库，避免 fetch 调用
    const pageData = await query(`
      SELECT 
        p.*,
        pc_zh.title as title_zh,
        pc_zh.content as content_zh,
        pc_zh.excerpt as excerpt_zh,
        pc_en.title as title_en,
        pc_en.content as content_en,
        pc_en.excerpt as excerpt_en
      FROM pages p
      LEFT JOIN page_contents pc_zh ON p.id = pc_zh.page_id AND pc_zh.language = 'zh'
      LEFT JOIN page_contents pc_en ON p.id = pc_en.page_id AND pc_en.language = 'en'
      WHERE p.slug = ? AND p.status = 'published'
    `, [slug]);

    console.log('📊 查询结果数量:', pageData.length);

    if (pageData.length === 0) {
      console.log('❌ 未找到页面, slug =', slug);
      
      // 查询所有页面，用于调试
      const allPages = await query(`
        SELECT id, slug, status FROM pages ORDER BY created_at DESC LIMIT 10
      `);
      
             console.log('📋 数据库中的页面列表:');
       allPages.forEach((page: any) => {
         console.log(`  - id: ${page.id}, slug: "${page.slug}", status: "${page.status}"`);
       });
      
      return null;
    }

    const page = pageData[0] as PageData;
    
    console.log('✅ 找到页面:', {
      id: page.id,
      slug: page.slug,
      status: page.status,
      title_zh: page.title_zh,
      title_en: page.title_en
    });

    return page;
  } catch (error) {
    console.error('❌ 获取页面数据失败:', error);
    return null;
  }
}

// 生成动态元数据
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug ? resolvedParams.slug.join('/') : 'home';
  const pageData = await getPageData(slug);

  if (!pageData) {
    return {
      title: '页面未找到',
      description: '页面不存在',
    };
  }

  return {
    title: pageData.seo_title_zh || pageData.title_zh || '我的网站',
    description: pageData.seo_description_zh || pageData.excerpt_zh || '',
    keywords: pageData.seo_keywords || '',
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug ? resolvedParams.slug.join('/') : 'home';
  const pageData = await getPageData(slug);

  if (!pageData) {
    notFound();
  }

  // 解析页面内容中的组件数据
  let components: ComponentData[] = [];
  try {
    if (pageData.content_zh || pageData.content_en) {
      const content = pageData.content_zh || pageData.content_en;
      components = JSON.parse(content || '[]');
    }
  } catch (error) {
    console.error('解析页面组件失败:', error);
    components = [];
  }

  return (
    <Layout>
      <ClientPageWrapper 
        initialPageData={pageData} 
        initialComponents={components} 
      />
    </Layout>
  );
}

// 生成静态参数（可选，用于静态生成）
export async function generateStaticParams() {
  // 这里可以从数据库获取所有页面的slug
  // 暂时返回空数组，使用动态路由
  return [];
} 