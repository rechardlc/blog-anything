/**
 * 环境变量配置工具
 * 提供类型安全的环境变量访问和验证
 */

/**
 * 获取必需的环境变量
 * @param key - 环境变量键名
 * @param defaultValue - 默认值（可选）
 * @returns 环境变量值
 * @throws 如果必需的环境变量未设置则抛出错误
 */
export function getRequiredEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;

  if (!value) {
    throw new Error(`环境变量 ${key} 是必需的但未设置`);
  }

  return value;
}

/**
 * 获取可选的环境变量
 * @param key - 环境变量键名
 * @param defaultValue - 默认值
 * @returns 环境变量值或默认值
 */
export function getOptionalEnv(key: string, defaultValue = ''): string {
  return process.env[key] || defaultValue;
}

/**
 * 获取布尔型环境变量
 * @param key - 环境变量键名
 * @param defaultValue - 默认值
 * @returns 布尔值
 */
export function getBooleanEnv(key: string, defaultValue = false): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;

  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * 获取数字型环境变量
 * @param key - 环境变量键名
 * @param defaultValue - 默认值
 * @returns 数字值
 */
export function getNumberEnv(key: string, defaultValue = 0): number {
  const value = process.env[key];
  if (!value) return defaultValue;

  const numValue = parseInt(value, 10);
  return isNaN(numValue) ? defaultValue : numValue;
}

/**
 * 应用配置对象
 * 集中管理所有环境变量配置
 */
export const config = {
  // 应用基础配置
  app: {
    name: getRequiredEnv('NEXT_PUBLIC_APP_NAME', 'Blog-Any'),
    version: getRequiredEnv('NEXT_PUBLIC_APP_VERSION', '1.0.0'),
    siteUrl: getRequiredEnv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000'),
  },

  // 开发环境配置
  dev: {
    debug: getBooleanEnv('DEBUG', false),
    apiBaseUrl: getOptionalEnv('API_BASE_URL', 'http://localhost:3000/api'),
  },

  // 数据库配置
  database: {
    url: getOptionalEnv('DATABASE_URL'),
  },

  // 第三方服务配置
  services: {
    googleAnalyticsId: getOptionalEnv('NEXT_PUBLIC_GA_ID'),
    cms: {
      apiUrl: getOptionalEnv('CMS_API_URL'),
      apiKey: getOptionalEnv('CMS_API_KEY'),
    },
  },

  // 邮件服务配置
  email: {
    smtp: {
      host: getOptionalEnv('SMTP_HOST'),
      port: getNumberEnv('SMTP_PORT', 587),
      user: getOptionalEnv('SMTP_USER'),
      pass: getOptionalEnv('SMTP_PASS'),
    },
  },

  // 云存储配置
  aws: {
    accessKeyId: getOptionalEnv('AWS_ACCESS_KEY_ID'),
    secretAccessKey: getOptionalEnv('AWS_SECRET_ACCESS_KEY'),
    region: getOptionalEnv('AWS_REGION', 'us-east-1'),
    s3Bucket: getOptionalEnv('AWS_S3_BUCKET'),
  },

  // 社交媒体配置
  social: {
    githubUrl: getOptionalEnv('NEXT_PUBLIC_GITHUB_URL'),
    twitterUrl: getOptionalEnv('NEXT_PUBLIC_TWITTER_URL'),
  },

  // 安全配置
  security: {
    jwtSecret: getOptionalEnv('JWT_SECRET'),
    encryptSecret: getOptionalEnv('ENCRYPT_SECRET'),
  },

  // 本地化配置
  locale: {
    timezone: getOptionalEnv('TIMEZONE', 'Asia/Shanghai'),
    defaultLocale: getOptionalEnv('DEFAULT_LOCALE', 'zh-CN'),
  },
} as const;

/**
 * 验证必需的环境变量
 * 在应用启动时调用以确保所有必需的配置都已设置
 */
export function validateRequiredEnvVars(): void {
  const requiredVars = [
    'NEXT_PUBLIC_APP_NAME',
    'NEXT_PUBLIC_APP_VERSION',
    'NEXT_PUBLIC_SITE_URL',
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `以下必需的环境变量未设置: ${missingVars.join(', ')}\n` +
        '请检查你的 .env.local 文件或环境配置。'
    );
  }
}

/**
 * 检查环境变量配置
 * 用于调试和诊断配置问题
 */
export function checkEnvConfig(): void {
  if (config.dev.debug) {
    console.log('🔧 环境变量配置检查:');
    console.log('应用名称:', config.app.name);
    console.log('应用版本:', config.app.version);
    console.log('网站URL:', config.app.siteUrl);
    console.log('调试模式:', config.dev.debug);
    console.log('时区:', config.locale.timezone);
    console.log('语言:', config.locale.defaultLocale);

    // 检查可选配置
    if (config.services.googleAnalyticsId) {
      console.log('✅ Google Analytics 已配置');
    }
    if (config.database.url) {
      console.log('✅ 数据库已配置');
    }
    if (config.email.smtp.host) {
      console.log('✅ 邮件服务已配置');
    }
    if (config.aws.accessKeyId) {
      console.log('✅ AWS 服务已配置');
    }
  }
}
