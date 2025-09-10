/**
 * API 相关的 TypeScript 类型定义
 */

// HTTP 方法
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API 响应状态
export type ApiStatus = 'success' | 'error' | 'loading';

// 基础 API 响应
export interface BaseApiResponse {
  success: boolean;
  message?: string;
  timestamp: string;
}

// 成功响应
export interface SuccessResponse<T = unknown> extends BaseApiResponse {
  success: true;
  data: T;
}

// 错误响应
export interface ErrorResponse extends BaseApiResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// API 响应联合类型
export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

// 分页参数
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

// 排序参数
export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 过滤参数
export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}

// 查询参数
export interface QueryParams
  extends PaginationParams,
    SortParams,
    FilterParams {}

// API 请求配置
export interface ApiRequestConfig {
  method: HttpMethod;
  url: string;
  data?: unknown;
  params?: QueryParams;
  headers?: Record<string, string>;
  timeout?: number;
}

// 文章查询参数
export interface PostQueryParams extends QueryParams {
  tag?: string;
  category?: string;
  author?: string;
  featured?: boolean;
  search?: string;
}

// 搜索参数
export interface SearchParams {
  query: string;
  type?: 'posts' | 'tags' | 'authors';
  limit?: number;
}

// 文件上传响应
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

// 认证响应（可选功能）
export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  expiresIn: number;
}

// API 错误代码
export enum ApiErrorCode {
  // 客户端错误
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',

  // 服务器错误
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',

  // 业务错误
  POST_NOT_FOUND = 'POST_NOT_FOUND',
  AUTHOR_NOT_FOUND = 'AUTHOR_NOT_FOUND',
  CATEGORY_NOT_FOUND = 'CATEGORY_NOT_FOUND',
  TAG_NOT_FOUND = 'TAG_NOT_FOUND',
}

// 请求拦截器类型
export type RequestInterceptor = (
  config: ApiRequestConfig
) => ApiRequestConfig | Promise<ApiRequestConfig>;

// 响应拦截器类型
export type ResponseInterceptor<T = unknown> = (
  response: ApiResponse<T>
) => ApiResponse<T> | Promise<ApiResponse<T>>;

// API 客户端配置
export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
  requestInterceptors: RequestInterceptor[];
  responseInterceptors: ResponseInterceptor[];
}
