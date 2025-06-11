'use client';

import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout';

export const metadata: Metadata = {
  title: '页面未找到 - 404',
  description: '抱歉，您访问的页面不存在',
};

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-gray-300">404</h1>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              页面未找到
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              抱歉，您访问的页面不存在或已被删除。请检查网址是否正确，或返回首页浏览其他内容。
            </p>
          </div>
          
          <div className="space-x-4">
            <Link 
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              返回首页
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              返回上页
            </button>
          </div>
          
          <div className="mt-12 text-gray-400">
            <svg 
              className="w-24 h-24 mx-auto mb-4 opacity-50" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.1-5.5-2.709"
              />
            </svg>
            <p className="text-sm">如有疑问，请联系网站管理员</p>
          </div>
        </div>
      </div>
    </Layout>
  );
} 