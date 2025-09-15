import { NextRequest, NextResponse } from 'next/server';

/**
 * 用户注册 API 路由
 * 处理用户注册请求
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // 基本验证
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: '用户名、邮箱和密码都是必需的' },
        { status: 400 }
      );
    }

    // 密码验证
    const passwordErrors = [];
    if (password.length < 6) {
      passwordErrors.push('密码至少需要6位字符');
    }
    if (!/[a-z]/.test(password)) {
      passwordErrors.push('密码必须包含小写字母');
    }
    if (!/[A-Z]/.test(password)) {
      passwordErrors.push('密码必须包含大写字母');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      passwordErrors.push('密码必须包含特殊符号');
    }

    if (passwordErrors.length > 0) {
      return NextResponse.json(
        { error: '密码不符合要求', details: passwordErrors },
        { status: 400 }
      );
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: '邮箱格式不正确' }, { status: 400 });
    }

    // 这里应该连接到数据库进行用户创建
    // 目前只是模拟成功响应
    console.log('注册用户:', { username, email });

    return NextResponse.json(
      {
        message: '注册成功',
        user: { username, email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('注册错误:', error);
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
}
