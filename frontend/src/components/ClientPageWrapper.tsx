'use client';

import React, { useState, useEffect } from 'react';
import PageRenderer from './PageRenderer';
import { PageData, ComponentData } from '@/types';

interface ClientPageWrapperProps {
  initialPageData: PageData;
  initialComponents: ComponentData[];
  language?: 'zh' | 'en';
}

export default function ClientPageWrapper({ 
  initialPageData, 
  initialComponents, 
  language = 'zh' 
}: ClientPageWrapperProps) {
  const [currentLanguage, setCurrentLanguage] = useState<'zh' | 'en'>(language);
  const [pageData, setPageData] = useState<PageData>(initialPageData);
  const [components, setComponents] = useState<ComponentData[]>(initialComponents);

  // 监听语言变化
  useEffect(() => {
    setCurrentLanguage(language);
    
    // 当语言切换时，重新解析组件数据
    console.log('🌐 语言切换:', { from: currentLanguage, to: language });
    
    // 重新处理页面数据
    const updatedPageData = { ...initialPageData };
    setPageData(updatedPageData);
    
    // 根据语言选择正确的内容进行解析
    let selectedContent = '';
    if (language === 'zh') {
      selectedContent = initialPageData.content_zh || '';
    } else {
      selectedContent = initialPageData.content_en || initialPageData.content_zh || '';
    }
    
    console.log('📋 内容选择:', {
      language,
      content_zh_length: initialPageData.content_zh?.length || 0,
      content_en_length: initialPageData.content_en?.length || 0,
      selected_content_length: selectedContent.length,
      using_fallback: language === 'en' && !initialPageData.content_en
    });
    
    // 重新解析选中语言的组件
    let languageComponents: ComponentData[] = [];
    try {
      if (selectedContent) {
        languageComponents = JSON.parse(selectedContent);
        console.log('✅ 成功解析组件:', languageComponents.length);
      } else {
        console.log('❌ 没有可用的内容');
        languageComponents = initialComponents; // 回退到初始组件
      }
    } catch (error) {
      console.error('❌ 组件解析失败:', error);
      languageComponents = initialComponents; // 回退到初始组件
    }
    
    setComponents(languageComponents);
    
  }, [language, initialPageData, initialComponents, currentLanguage]);

  // 根据当前语言获取页面标题和摘要
  const getLocalizedContent = () => {
    const title = currentLanguage === 'zh' ? pageData.title_zh : pageData.title_en;
    const excerpt = currentLanguage === 'zh' ? pageData.excerpt_zh : pageData.excerpt_en;
    
    console.log('📋 本地化内容:', {
      language: currentLanguage,
      title_zh: pageData.title_zh,
      title_en: pageData.title_en,
      selected_title: title,
      excerpt_zh: pageData.excerpt_zh,
      excerpt_en: pageData.excerpt_en,
      selected_excerpt: excerpt
    });
    
    return { title, excerpt };
  };

  const { title, excerpt } = getLocalizedContent();

  return (
    <div className="min-h-screen">
      {/* 页面标题 */}
      {title && (
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {excerpt && (
              <p className="text-gray-600 mt-4">{excerpt}</p>
            )}
          </div>
        </div>
      )}

      {/* 页面内容 */}
      <div className="py-8">
        {components && components.length > 0 ? (
          <PageRenderer components={components} language={currentLanguage} />
        ) : (
          <div className="container mx-auto px-4">
            <div className="text-center py-20 text-gray-500">
              <p>
                {currentLanguage === 'zh' ? '页面内容为空' : 'Page content is empty'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 