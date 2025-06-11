'use client';

import React from 'react';
import { ComponentData, SubComponentData } from '@/types';

interface PageRendererProps {
  components: ComponentData[];
  language: 'zh' | 'en';
}

// 子组件渲染器
const SubComponentRenderer: React.FC<{
  component: SubComponentData;
  language?: 'zh' | 'en';
}> = ({ component, language = 'zh' }) => {
  switch (component.type) {
    case 'image':
      return (
        <div className="text-center">
          {component.data.src ? (
            <img 
              src={component.data.src} 
              alt={component.data.alt || '图片'} 
              style={{ 
                width: component.data.width || '100%',
                height: component.data.height || 'auto',
                maxWidth: '100%',
                borderRadius: '4px'
              }}
              className="mx-auto"
            />
                     ) : (
             <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
               <span className="text-gray-500">
                 {language === 'zh' ? '图片加载中...' : 'Loading image...'}
               </span>
             </div>
           )}
         </div>
       );
     case 'text':
       return (
         <div 
           style={{ 
             fontSize: component.data.fontSize || '14px',
             color: component.data.color || '#333',
             textAlign: component.data.textAlign || 'left',
             fontWeight: component.data.fontWeight || 'normal',
             lineHeight: '1.6',
             marginTop: '8px'
           }}
           className="whitespace-pre-wrap"
         >
           {component.data.content || ''}
         </div>
       );
     case 'button':
       const buttonClasses = `inline-block px-6 py-3 rounded transition-colors ${
         component.data.style === 'primary' 
           ? 'bg-blue-600 text-white hover:bg-blue-700' 
           : component.data.style === 'secondary'
           ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
           : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
       }`;
       
       const defaultButtonText = language === 'zh' ? '按钮文字' : 'Button Text';
       
       return (
         <div className="text-center" style={{ marginTop: '12px' }}>
           {component.data.link ? (
             <a href={component.data.link} className={buttonClasses}>
               {component.data.text || defaultButtonText}
             </a>
           ) : (
             <button className={buttonClasses}>
               {component.data.text || defaultButtonText}
             </button>
           )}
         </div>
       );
    default:
      return null;
  }
};

// 文本组件渲染器
const TextComponent: React.FC<{ data: any; language?: 'zh' | 'en' }> = ({ data, language = 'zh' }) => {
  return (
    <div className="prose max-w-none">
      <h2 
        style={{ 
          fontSize: data.fontSize || '24px', 
          color: data.color || '#333',
          marginBottom: '16px'
        }}
      >
        {data.title || ''}
      </h2>
      <p 
        style={{ 
          fontSize: data.contentSize || '16px', 
          lineHeight: '1.6' 
        }}
        className="whitespace-pre-wrap"
      >
        {data.content || ''}
      </p>
    </div>
  );
};

// 卡片组件渲染器
const CardComponent: React.FC<{ data: any; language?: 'zh' | 'en' }> = ({ data, language = 'zh' }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {data.image && (
        <div className="aspect-w-16 aspect-h-9">
          <img 
            src={data.image} 
            alt={data.title || ''}
            style={{ height: data.imageHeight || '200px' }}
            className="w-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{data.title || ''}</h3>
        <p className="text-gray-600">{data.description || ''}</p>
      </div>
    </div>
  );
};

// 网格组件渲染器
const GridComponent: React.FC<{ data: any; language?: 'zh' | 'en' }> = ({ data, language = 'zh' }) => {
  const columns = data.columns || 3;
  const items = data.items || [];
  
  const gridClass = `grid gap-6 ${
    columns === 2 ? 'grid-cols-1 md:grid-cols-2' :
    columns === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
    columns === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
    'grid-cols-1 md:grid-cols-3'
  }`;

  return (
    <div className={gridClass}>
      {Array.from({ length: columns }).map((_, index) => {
        const item = items[index] || { components: [] };
        return (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm border">
            {item.components && item.components.length > 0 ? (
              <div className="space-y-4">
                {item.components.map((subComponent: SubComponentData) => (
                  <SubComponentRenderer
                    key={subComponent.id}
                    component={subComponent}
                    language={language}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <span>{language === 'zh' ? '暂无内容' : 'No content'}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Hero组件渲染器
const HeroComponent: React.FC<{ data: any; language?: 'zh' | 'en' }> = ({ data, language = 'zh' }) => {
  return (
    <div 
      className="relative flex items-center justify-center text-white text-center"
      style={{
        backgroundImage: data.backgroundImage 
          ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${data.backgroundImage})`
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: data.height || '400px',
      }}
    >
      <div className="max-w-4xl mx-auto px-4">
        <h1 
          style={{ 
            fontSize: data.titleSize || '48px',
            marginBottom: '16px'
          }}
          className="font-bold"
        >
          {data.title || ''}
        </h1>
        <p 
          style={{ 
            fontSize: data.subtitleSize || '18px',
            marginBottom: '24px'
          }}
          className="opacity-90"
        >
          {data.subtitle || ''}
        </p>
        {data.buttonText && (
          <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            {data.buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

// 主页面渲染器
export default function PageRenderer({ components, language }: PageRendererProps) {
  console.log('🎨 PageRenderer 渲染:', { language, components_count: components?.length || 0 });
  
  if (!components || components.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p>{language === 'zh' ? '页面内容为空' : 'Page content is empty'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {components.map((component, index) => {
        switch (component.type) {
          case 'text':
            return (
              <div key={component.id || index} className="container mx-auto px-4">
                <TextComponent data={component.data} language={language} />
              </div>
            );
          case 'card':
            return (
              <div key={component.id || index} className="container mx-auto px-4">
                <CardComponent data={component.data} language={language} />
              </div>
            );
          case 'grid':
            return (
              <div key={component.id || index} className="container mx-auto px-4">
                <GridComponent data={component.data} language={language} />
              </div>
            );
          case 'hero':
            return (
              <div key={component.id || index} className="w-full">
                <HeroComponent data={component.data} language={language} />
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
} 