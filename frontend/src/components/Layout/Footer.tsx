'use client';

import React from 'react';

interface FooterProps {
  language: 'zh' | 'en';
}

export default function Footer({ language }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 公司信息 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {language === 'zh' ? '我的网站' : 'My Website'}
            </h3>
            <p className="text-gray-300 mb-4">
              {language === 'zh' 
                ? '基于CMS构建的现代化网站'
                : 'Modern website built with CMS'
              }
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="text-sm font-semibold mb-4">
              {language === 'zh' ? '快速链接' : 'Quick Links'}
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white">
                  {language === 'zh' ? '首页' : 'Home'}
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-white">
                  {language === 'zh' ? '关于我们' : 'About'}
                </a>
              </li>
            </ul>
          </div>

          {/* 联系信息 */}
          <div>
            <h4 className="text-sm font-semibold mb-4">
              {language === 'zh' ? '联系我们' : 'Contact'}
            </h4>
            <p className="text-gray-300">contact@example.com</p>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>
            © {currentYear} {language === 'zh' ? '我的网站' : 'My Website'}. 
            {language === 'zh' ? ' 保留所有权利。' : ' All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
} 