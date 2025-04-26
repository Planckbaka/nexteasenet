import { ApiError } from './api';

// 错误类型枚举
export enum ErrorType {
  NETWORK = 'network',
  SERVER = 'server',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NOT_FOUND = 'not_found',
  TIMEOUT = 'timeout',
  UNKNOWN = 'unknown'
}

// 错误处理类
class ErrorHandler {
  // 根据API错误获取错误类型
  public getErrorType(error: ApiError): ErrorType {
    const { status } = error;
    
    if (!status || status === 0) {
      return ErrorType.NETWORK;
    }
    
    switch (true) {
      case status === 400:
        return ErrorType.VALIDATION;
      case status === 401:
        return ErrorType.AUTHENTICATION;
      case status === 403:
        return ErrorType.AUTHORIZATION;
      case status === 404:
        return ErrorType.NOT_FOUND;
      case status === 408:
        return ErrorType.TIMEOUT;
      case status >= 500:
        return ErrorType.SERVER;
      default:
        return ErrorType.UNKNOWN;
    }
  }
  
  // 获取用户友好的错误消息
  public getUserFriendlyMessage(error: ApiError | Error): string {
    // 如果是API错误
    if ('status' in error) {
      const errorType = this.getErrorType(error as ApiError);
      
      switch (errorType) {
        case ErrorType.NETWORK:
          return '网络连接错误，请检查您的网络连接并重试。';
        case ErrorType.SERVER:
          return '服务器错误，请稍后重试。';
        case ErrorType.VALIDATION:
          return '请求数据无效，请检查输入并重试。';
        case ErrorType.AUTHENTICATION:
          return '身份验证失败，请重新登录。';
        case ErrorType.AUTHORIZATION:
          return '您没有权限执行此操作。';
        case ErrorType.NOT_FOUND:
          return '请求的资源不存在。';
        case ErrorType.TIMEOUT:
          return '请求超时，请稍后重试。';
        case ErrorType.UNKNOWN:
          return '发生未知错误，请重试。';
      }
    }
    
    // 如果是普通错误
    return error.message || '发生未知错误，请重试。';
  }
  
  // 处理错误并返回用户友好的消息
  public handleError(error: unknown): string {
    console.error('Error occurred:', error);
    
    if (error instanceof Error) {
      return this.getUserFriendlyMessage(error);
    }
    
    if (typeof error === 'object' && error !== null && 'status' in error) {
      return this.getUserFriendlyMessage(error as ApiError);
    }
    
    return '发生未知错误，请重试。';
  }
}

// 导出错误处理器单例
export const errorHandler = new ErrorHandler();