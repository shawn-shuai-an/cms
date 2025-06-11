import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { MenuData } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // 获取所有可见菜单及其多语言内容
    const menuData = await query(`
      SELECT 
        m.*,
        mc_zh.name as name_zh,
        mc_en.name as name_en
      FROM menus m
      LEFT JOIN menu_contents mc_zh ON m.id = mc_zh.menu_id AND mc_zh.language = 'zh'
      LEFT JOIN menu_contents mc_en ON m.id = mc_en.menu_id AND mc_en.language = 'en'
      WHERE m.is_visible = 1
      ORDER BY m.sort_order ASC
    `);

    // 构建菜单树结构
    const menus = buildMenuTree(menuData);

    return NextResponse.json({
      success: true,
      data: menus
    });

  } catch (error) {
    console.error('Get menus error:', error);
    return NextResponse.json({
      success: false,
      message: '获取菜单失败'
    }, { status: 500 });
  }
}

// 构建菜单树结构
function buildMenuTree(menuData: any[]): MenuData[] {
  const menuMap = new Map();
  const rootMenus: MenuData[] = [];

  // 创建菜单映射
  menuData.forEach(item => {
    const menu: MenuData = {
      id: item.id,
      parent_id: item.parent_id,
      name_zh: item.name_zh,
      name_en: item.name_en,
      url: item.url,
      sort_order: item.sort_order,
      is_visible: item.is_visible,
      icon: item.icon,
      children: []
    };
    menuMap.set(menu.id, menu);
  });

  // 构建树结构
  menuData.forEach(item => {
    const menu = menuMap.get(item.id);
    if (item.parent_id) {
      const parent = menuMap.get(item.parent_id);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(menu);
      }
    } else {
      rootMenus.push(menu);
    }
  });

  return rootMenus;
} 