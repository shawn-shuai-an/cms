import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug: 检查多语言数据...');
    
    // 查询页面和多语言内容的详细信息
    const pageDetails = await query(`
      SELECT 
        p.id,
        p.slug,
        p.status,
        p.template_type,
        p.created_at,
        -- 中文内容
        pc_zh.id as zh_content_id,
        pc_zh.title as title_zh,
        pc_zh.content as content_zh,
        pc_zh.excerpt as excerpt_zh,
        -- 英文内容
        pc_en.id as en_content_id,
        pc_en.title as title_en,
        pc_en.content as content_en,
        pc_en.excerpt as excerpt_en
      FROM pages p
      LEFT JOIN page_contents pc_zh ON p.id = pc_zh.page_id AND pc_zh.language = 'zh'
      LEFT JOIN page_contents pc_en ON p.id = pc_en.page_id AND pc_en.language = 'en'
      WHERE p.status = 'published'
      ORDER BY p.created_at DESC
      LIMIT 10
    `);

    console.log('📊 页面多语言数据分析:');
    pageDetails.forEach(page => {
      console.log(`📄 页面 "${page.slug}":`);
      console.log(`  - 中文: ${page.title_zh ? '✅' : '❌'} (ID: ${page.zh_content_id || 'N/A'})`);
      console.log(`  - 英文: ${page.title_en ? '✅' : '❌'} (ID: ${page.en_content_id || 'N/A'})`);
      if (page.content_zh) {
        try {
          const zhComponents = JSON.parse(page.content_zh);
          console.log(`  - 中文组件数量: ${zhComponents.length}`);
        } catch (e) {
          console.log(`  - 中文组件: 解析失败`);
        }
      }
      if (page.content_en) {
        try {
          const enComponents = JSON.parse(page.content_en);
          console.log(`  - 英文组件数量: ${enComponents.length}`);
        } catch (e) {
          console.log(`  - 英文组件: 解析失败`);
        }
      }
    });

    // 检查菜单多语言数据
    const menuDetails = await query(`
      SELECT 
        m.id,
        m.url,
        m.is_visible,
        mc_zh.name as name_zh,
        mc_en.name as name_en
      FROM menus m
      LEFT JOIN menu_contents mc_zh ON m.id = mc_zh.menu_id AND mc_zh.language = 'zh'
      LEFT JOIN menu_contents mc_en ON m.id = mc_en.menu_id AND mc_en.language = 'en'
      WHERE m.is_visible = 1
      ORDER BY m.sort_order ASC
    `);

    console.log('📋 菜单多语言数据分析:');
    menuDetails.forEach(menu => {
      console.log(`📎 菜单 "${menu.url}":`);
      console.log(`  - 中文: ${menu.name_zh || 'N/A'}`);
      console.log(`  - 英文: ${menu.name_en || 'N/A'}`);
    });

    // 统计信息
    const stats = {
      total_pages: pageDetails.length,
      pages_with_zh: pageDetails.filter(p => p.title_zh).length,
      pages_with_en: pageDetails.filter(p => p.title_en).length,
      pages_with_both: pageDetails.filter(p => p.title_zh && p.title_en).length,
      total_menus: menuDetails.length,
      menus_with_zh: menuDetails.filter(m => m.name_zh).length,
      menus_with_en: menuDetails.filter(m => m.name_en).length,
      menus_with_both: menuDetails.filter(m => m.name_zh && m.name_en).length
    };

    console.log('📈 多语言统计:', stats);

    return NextResponse.json({
      success: true,
      data: {
        pages: pageDetails,
        menus: menuDetails,
        statistics: stats,
        issues: {
          missing_english_pages: pageDetails.filter(p => p.title_zh && !p.title_en),
          missing_chinese_pages: pageDetails.filter(p => !p.title_zh && p.title_en),
          missing_english_menus: menuDetails.filter(m => m.name_zh && !m.name_en),
          missing_chinese_menus: menuDetails.filter(m => !m.name_zh && m.name_en)
        }
      }
    });

  } catch (error) {
    console.error('❌ 多语言调试API错误:', error);
    return NextResponse.json({
      success: false,
      message: '多语言数据检查失败',
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
} 