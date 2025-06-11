import React from 'react';
import { Metadata } from 'next';
import Layout from '@/components/Layout/Layout';
import ClientPageWrapper from '@/components/ClientPageWrapper';
import PageRenderer from '@/components/PageRenderer';
import { PageData, ComponentData } from '@/types';
import { query } from '@/lib/database';

export const metadata: Metadata = {
  title: '我的网站 - 首页',
  description: '欢迎访问我们的网站',
  keywords: '首页, CMS, 网站',
};

async function getHomePage(): Promise<{ pageData: PageData | null; components: ComponentData[] }> {
  try {
    console.log('🔍 直接查询数据库获取首页数据...');
    
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
    `, ['home']);

    console.log('📊 查询结果数量:', pageData.length);

    if (pageData.length === 0) {
      console.log('❌ 未找到首页，尝试查找 index 页面...');
      
      // 如果没有 home 页面，尝试查找 index 页面
      const indexPageData = await query(`
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
      
      if (indexPageData.length === 0) {
        console.log('❌ 也未找到 index 页面');
        return { pageData: null, components: [] };
      }
      
      const page = indexPageData[0] as PageData;
      
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
    }

    const page = pageData[0] as PageData;
    
    console.log('✅ 找到首页:', {
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
    console.error('❌ 获取首页数据失败:', error);
    return { pageData: null, components: [] };
  }
}

export default async function HomePage() {
  const { pageData, components } = await getHomePage();

  // 如果没有找到首页数据，显示默认内容
  if (!pageData) {
    return (
      <Layout>
        <DefaultHomePage />
      </Layout>
    );
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

// 默认首页组件
function DefaultHomePage({ language = 'zh' }: { language?: 'zh' | 'en' }) {
  const defaultComponents: ComponentData[] = [
    {
      id: 'hero-1',
      type: 'hero',
      data: {
        title: language === 'zh' ? '欢迎访问我的网站' : 'Welcome to My Website',
        subtitle: language === 'zh' ? '这是一个基于CMS构建的现代化网站' : 'This is a modern website built with CMS',
        buttonText: language === 'zh' ? '了解更多' : 'Learn More',
        height: '500px',
        titleSize: '48px',
        subtitleSize: '18px'
      }
    },
    {
      id: 'grid-1',
      type: 'grid',
      data: {
        columns: 3,
        items: [
          {
            components: [
              {
                id: 'text-1',
                type: 'text',
                data: {
                  content: language === 'zh' ? '功能丰富\n\n提供完整的内容管理功能' : 'Feature Rich\n\nComplete content management capabilities',
                  fontSize: '16px',
                  textAlign: 'center'
                }
              }
            ]
          },
          {
            components: [
              {
                id: 'text-2',
                type: 'text',
                data: {
                  content: language === 'zh' ? '易于使用\n\n直观的用户界面设计' : 'Easy to Use\n\nIntuitive user interface design',
                  fontSize: '16px',
                  textAlign: 'center'
                }
              }
            ]
          },
          {
            components: [
              {
                id: 'text-3',
                type: 'text',
                data: {
                  content: language === 'zh' ? '响应式设计\n\n完美适配各种设备' : 'Responsive Design\n\nPerfect for all devices',
                  fontSize: '16px',
                  textAlign: 'center'
                }
              }
            ]
          }
        ]
      }
    }
  ];

  return (
    <div className="min-h-screen">
      <PageRenderer components={defaultComponents} language="zh" />
    </div>
  );
}

// 首页内容组件
interface HomePageContentProps {
  pageData: PageData;
  components: ComponentData[];
  language?: 'zh' | 'en';
}

function HomePageContent({ pageData, components, language = 'zh' }: HomePageContentProps) {
  // 根据语言选择页面标题
  const title = language === 'zh' ? pageData.title_zh : pageData.title_en;
  
  console.log('🌐 首页语言切换:', { language, title_zh: pageData.title_zh, title_en: pageData.title_en, selected_title: title });

  return (
    <div className="min-h-screen">
      {/* 页面标题 */}
      {title && (
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          </div>
        </div>
      )}

      {/* 页面内容 */}
      <div className="py-8">
        {components && components.length > 0 ? (
          <PageRenderer components={components} language={language} />
        ) : (
          <DefaultHomePage language={language} />
        )}
      </div>
    </div>
  );
}
