declare namespace NodeJS {
  interface ProcessEnv {
    // =================================
    // 应用基础配置
    // =================================

    /** 应用名称 */
    NEXT_PUBLIC_APP_NAME: string;

    /** 应用版本 */
    NEXT_PUBLIC_APP_VERSION: string;

    /** 网站URL */
    NEXT_PUBLIC_SITE_URL: string;

    // =================================
    // 数据库配置
    // =================================

    /** 数据库连接字符串 */
    DATABASE_URL?: string;

    // =================================
    // 第三方服务配置
    // =================================

    /** Google Analytics ID */
    NEXT_PUBLIC_GA_ID?: string;

    /** CMS API URL */
    CMS_API_URL?: string;

    /** CMS API Key */
    CMS_API_KEY?: string;

    // =================================
    // 邮件服务配置
    // =================================

    /** SMTP 主机 */
    SMTP_HOST?: string;

    /** SMTP 端口 */
    SMTP_PORT?: string;

    /** SMTP 用户名 */
    SMTP_USER?: string;

    /** SMTP 密码 */
    SMTP_PASS?: string;

    // =================================
    // 云存储配置
    // =================================

    /** AWS Access Key ID */
    AWS_ACCESS_KEY_ID?: string;

    /** AWS Secret Access Key */
    AWS_SECRET_ACCESS_KEY?: string;

    /** AWS 区域 */
    AWS_REGION?: string;

    /** AWS S3 存储桶名称 */
    AWS_S3_BUCKET?: string;

    // =================================
    // 社交媒体配置
    // =================================

    /** GitHub URL */
    NEXT_PUBLIC_GITHUB_URL?: string;

    /** Twitter URL */
    NEXT_PUBLIC_TWITTER_URL?: string;

    // =================================
    // 开发环境配置
    // =================================

    /** 调试模式 */
    DEBUG?: string;

    /** API 基础URL */
    API_BASE_URL?: string;

    // =================================
    // 安全配置
    // =================================

    /** JWT 密钥 */
    JWT_SECRET?: string;

    /** 加密密钥 */
    ENCRYPT_SECRET?: string;

    // =================================
    // 其他配置
    // =================================

    /** 时区设置 */
    TIMEZONE?: string;

    /** 默认语言 */
    DEFAULT_LOCALE?: string;
  }
}
