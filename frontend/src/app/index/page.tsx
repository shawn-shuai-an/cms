import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Layout from '@/components/Layout/Layout';
import ClientPageWrapper from '@/components/ClientPageWrapper';
import { PageData, ComponentData } from '@/types';
import { query } from '@/lib/database';

async function getIndexPage(): Promise<{ pageData: PageData | null; components: ComponentData[] }> {
  try {
    console.log('🔍 直接查询数据库获取 index 页面数据...');
    
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
    `, ['index']);

    console.log('📊 查询结果数量:', pageData.length);

    if (pageData.length === 0) {
      console.log('❌ 未找到 index 页面');
      
      // 查询所有页面，用于调试
      const allPages = await query(`
        SELECT id, slug, status FROM pages ORDER BY created_at DESC LIMIT 10
      `);
      
             console.log('📋 数据库中的页面列表:');
       allPages.forEach((page: any) => {
         console.log(`  - id: ${page.id}, slug: "${page.slug}", status: "${page.status}"`);
       });
      
      return { pageData: null, components: [] };
    }

    const page = pageData[0] as PageData;
    
    console.log('✅ 找到 index 页面:', {
      id: page.id,
      slug: page.slug,
      status: page.status,
      title_zh: page.title_zh,
      title_en: page.title_en
    });
    
    // 解析页面内容中的组件数据
    let components: ComponentData[] = [];
    try {
      if (page && (page.content_zh || page.content_en)) {
        const content = page.content_zh || page.content_en;
        components = JSON.parse(content || '[]');
        console.log('📋 解析到组件数量:', components.length);
      }
    } catch (error) {
      console.error('解析页面组件失败:', error);
      components = [];
    }

    return { pageData: page, components };
  } catch (error) {
    console.error('❌ 获取index页面数据失败:', error);
    return { pageData: null, components: [] };
  }
}

// 生成元数据
export async function generateMetadata(): Promise<Metadata> {
  const { pageData } = await getIndexPage();

  if (!pageData) {
    return {
      title: 'Index 页面',
      description: 'Index 页面',
    };
  }

  return {
    title: pageData.seo_title_zh || pageData.title_zh || 'Index 页面',
    description: pageData.seo_description_zh || pageData.excerpt_zh || '',
    keywords: pageData.seo_keywords || '',
  };
}

export default async function IndexPage() {
  const { pageData, components } = await getIndexPage();

  if (!pageData) {
    console.log('❌ 页面数据不存在，显示404');
    notFound();
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