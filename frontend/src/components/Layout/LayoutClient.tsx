'use client';

import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutClientProps {
  children: React.ReactNode;
}

export default function LayoutClient({ children }: LayoutClientProps) {
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');

  useEffect(() => {
    // 从本地存储获取语言设置
    const savedLanguage = localStorage.getItem('language') as 'zh' | 'en' | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (lang: 'zh' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header 
        language={language} 
        onLanguageChange={handleLanguageChange} 
      />
      
      <main className="flex-1">
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { language } as any);
          }
          return child;
        })}
      </main>
      
      <Footer language={language} />
    </div>
  );
} 