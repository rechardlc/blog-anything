import { NextRequest, NextResponse } from 'next/server';

/**
 * 用户登录 API 路由
 * 处理用户登录请求
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // 基本验证
    if (!username || !password) {
      return NextResponse.json(
        { error: '用户名和密码都是必需的' },
        { status: 400 }
      );
    }

    // 这里应该连接到数据库进行用户验证
    // 目前只是模拟验证
    console.log('登录尝试:', { username });

    // 模拟用户验证（实际应用中应该查询数据库）
    if (username === 'admin' && password === 'Admin123!') {
      return NextResponse.json(
        {
          message: '登录成功',
          user: { username, role: 'admin' },
          token: 'mock-jwt-token',
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 });
  } catch (error) {
    console.error('登录错误:', error);
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
}
