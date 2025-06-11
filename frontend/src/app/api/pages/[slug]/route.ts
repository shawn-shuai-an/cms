import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { PageData } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    console.log('🔍 API: 查询页面数据, slug =', slug);
    
    // 查询页面数据和多语言内容
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
      allPages.forEach(page => {
        console.log(`  - id: ${page.id}, slug: "${page.slug}", status: "${page.status}"`);
      });
      
      return NextResponse.json({
        success: false,
        message: '页面不存在',
        debug: {
          requested_slug: slug,
          available_pages: allPages
        }
      }, { status: 404 });
    }

    const page = pageData[0] as PageData;
    
    console.log('✅ 找到页面:', {
      id: page.id,
      slug: page.slug,
      status: page.status,
      title_zh: page.title_zh,
      title_en: page.title_en
    });

    return NextResponse.json({
      success: true,
      data: page
    });

  } catch (error) {
    console.error('❌ API错误:', error);
    return NextResponse.json({
      success: false,
      message: '获取页面失败',
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
} 