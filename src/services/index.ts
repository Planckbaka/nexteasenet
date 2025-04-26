// 导出所有服务
export * from './api';
export * from './imageService';
export * from './errorHandler';

// 默认导出
import { apiClient } from './api';
import { imageService } from './imageService';
import { errorHandler } from './errorHandler';

export default {
  api: apiClient,
  image: imageService,
  error: errorHandler
};