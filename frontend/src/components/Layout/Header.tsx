'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MenuData } from '@/types';

interface HeaderProps {
  language: 'zh' | 'en';
  onLanguageChange: (lang: 'zh' | 'en') => void;
}

export default function Header({ language, onLanguageChange }: HeaderProps) {
  const [menus, setMenus] = useState<MenuData[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await fetch('/api/menus');
      const result = await response.json();
      if (result.success) {
        setMenus(result.data);
      }
    } catch (error) {
      console.error('获取菜单失败:', error);
    }
  };

  const renderMenuItem = (menu: MenuData) => {
    const name = language === 'zh' ? menu.name_zh : menu.name_en;
    
    return (
      <div key={menu.id} className="relative group">
        <Link
          href={menu.url}
          className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
        >
          {name}
        </Link>
        
        {menu.children && menu.children.length > 0 && (
          <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <div className="py-1">
              {menu.children.map(child => (
                <Link
                  key={child.id}
                  href={child.url}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {language === 'zh' ? child.name_zh : child.name_en}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-gray-900">
              {language === 'zh' ? '我的网站' : 'My Website'}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {menus.map(renderMenuItem)}
          </nav>

          {/* Language Switcher */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => onLanguageChange('zh')}
                className={`px-2 py-1 text-sm rounded ${
                  language === 'zh' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                中文
              </button>
              <span className="text-gray-400">|</span>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 text-sm rounded ${
                  language === 'en' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                EN
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              {menus.map(menu => (
                <div key={menu.id}>
                  <Link
                    href={menu.url}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {language === 'zh' ? menu.name_zh : menu.name_en}
                  </Link>
                  {menu.children && menu.children.length > 0 && (
                    <div className="pl-4">
                      {menu.children.map(child => (
                        <Link
                          key={child.id}
                          href={child.url}
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {language === 'zh' ? child.name_zh : child.name_en}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 