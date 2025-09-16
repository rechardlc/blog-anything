// 统一导出所有模型类型

// 用户相关
export * from './user';

// 博客相关
export * from './blog';

// 评论相关
export * from './comment';

// 系统相关
export * from './system';

// 通用类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SearchParams {
  q?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface FileUpload {
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
}

// 常用的数据库操作类型
export interface CreateOperation<T> {
  data: T;
}

export interface UpdateOperation<T> {
  where: { id: string };
  data: T;
}

export interface DeleteOperation {
  where: { id: string };
}

export interface FindManyOperation<T> {
  where?: T;
  orderBy?: any;
  skip?: number;
  take?: number;
  include?: any;
  select?: any;
}

export interface FindUniqueOperation<T> {
  where: T;
  include?: any;
  select?: any;
}

// HTTP 状态码
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

// 错误类型
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// 表单验证错误
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormErrors {
  [key: string]: string | string[];
}
