import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug: 查询所有页面数据...');
    
    // 查询所有页面数据
    const allPages = await query(`
      SELECT 
        p.id,
        p.slug,
        p.status,
        p.template_type,
        p.created_at,
        pc_zh.title as title_zh,
        pc_zh.content as content_zh,
        pc_en.title as title_en,
        pc_en.content as content_en
      FROM pages p
      LEFT JOIN page_contents pc_zh ON p.id = pc_zh.page_id AND pc_zh.language = 'zh'
      LEFT JOIN page_contents pc_en ON p.id = pc_en.page_id AND pc_en.language = 'en'
      ORDER BY p.created_at DESC
    `);

    console.log('📊 找到页面数量:', allPages.length);
    allPages.forEach(page => {
      console.log(`📄 页面: id=${page.id}, slug="${page.slug}", status="${page.status}", title="${page.title_zh || page.title_en}"`);
    });

    // 查询所有菜单数据
    const allMenus = await query(`
      SELECT 
        m.id,
        m.url,
        m.is_visible,
        mc_zh.name as name_zh,
        mc_en.name as name_en
      FROM menus m
      LEFT JOIN menu_contents mc_zh ON m.id = mc_zh.menu_id AND mc_zh.language = 'zh'
      LEFT JOIN menu_contents mc_en ON m.id = mc_en.menu_id AND mc_en.language = 'en'
      ORDER BY m.sort_order ASC
    `);

    console.log('📋 找到菜单数量:', allMenus.length);
    allMenus.forEach(menu => {
      console.log(`📎 菜单: id=${menu.id}, url="${menu.url}", visible=${menu.is_visible}, name="${menu.name_zh || menu.name_en}"`);
    });

    return NextResponse.json({
      success: true,
      data: {
        pages: allPages,
        menus: allMenus,
        debug_info: {
          total_pages: allPages.length,
          total_menus: allMenus.length,
          published_pages: allPages.filter(p => p.status === 'published').length,
          visible_menus: allMenus.filter(m => m.is_visible).length
        }
      }
    });

  } catch (error) {
    console.error('❌ Debug API 错误:', error);
    return NextResponse.json({
      success: false,
      message: '调试查询失败',
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
} 