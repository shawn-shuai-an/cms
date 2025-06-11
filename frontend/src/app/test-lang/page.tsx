'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import PageRenderer from '@/components/PageRenderer';
import { ComponentData } from '@/types';

export default function TestLangPage({ language = 'zh' }: { language?: 'zh' | 'en' }) {
  const [currentLang, setCurrentLang] = useState<'zh' | 'en'>(language);
  
  // 测试组件数据
  const testComponents: ComponentData[] = [
    {
      id: 'hero-test',
      type: 'hero',
      data: {
        title: currentLang === 'zh' ? '多语言测试页面' : 'Multi-language Test Page',
        subtitle: currentLang === 'zh' ? '测试中英文切换功能' : 'Testing Chinese-English switching',
        buttonText: currentLang === 'zh' ? '测试按钮' : 'Test Button',
        height: '400px',
        titleSize: '36px',
        subtitleSize: '16px'
      }
    },
    {
      id: 'grid-test',
      type: 'grid',
      data: {
        columns: 2,
        items: [
          {
            components: [
              {
                id: 'text-test-1',
                type: 'text',
                data: {
                  content: currentLang === 'zh' ? '中文测试内容\n\n这是第一个测试区块' : 'English Test Content\n\nThis is the first test block',
                  fontSize: '16px',
                  textAlign: 'center'
                }
              },
              {
                id: 'button-test-1',
                type: 'button',
                data: {
                  text: currentLang === 'zh' ? '中文按钮' : 'English Button',
                  style: 'primary',
                  link: '#'
                }
              }
            ]
          },
          {
            components: [
              {
                id: 'text-test-2',
                type: 'text',
                data: {
                  content: currentLang === 'zh' ? '第二个区块\n\n包含图片和文本' : 'Second Block\n\nContains image and text',
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
    <Layout>
      <div className="min-h-screen">
        {/* 测试控制面板 */}
        <div className="bg-yellow-50 border-b border-yellow-200 p-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">
                {currentLang === 'zh' ? '🧪 多语言测试页面' : '🧪 Multi-language Test Page'}
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {currentLang === 'zh' ? '当前语言:' : 'Current Language:'}
                </span>
                <button
                  onClick={() => setCurrentLang('zh')}
                  className={`px-3 py-1 text-sm rounded ${
                    currentLang === 'zh' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  中文
                </button>
                <button
                  onClick={() => setCurrentLang('en')}
                  className={`px-3 py-1 text-sm rounded ${
                    currentLang === 'en' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  English
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {currentLang === 'zh' 
                ? '切换语言按钮测试页面内容的多语言显示效果' 
                : 'Switch language buttons to test multi-language display effects'
              }
            </p>
          </div>
        </div>

        {/* 页面内容 */}
        <div className="py-8">
          <PageRenderer components={testComponents} language={currentLang} />
        </div>

        {/* 调试信息 */}
        <div className="bg-gray-50 border-t p-4">
          <div className="container mx-auto px-4">
            <h3 className="text-lg font-semibold mb-2">
              {currentLang === 'zh' ? '🔍 调试信息' : '🔍 Debug Info'}
            </h3>
            <pre className="bg-white p-4 rounded border text-sm overflow-auto">
              {JSON.stringify({
                currentLanguage: currentLang,
                componentsCount: testComponents.length,
                heroTitle: testComponents[0].data.title,
                heroSubtitle: testComponents[0].data.subtitle,
                firstGridText: testComponents[1].data.items[0].components[0].data.content
              }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </Layout>
  );
} 