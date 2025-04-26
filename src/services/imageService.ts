import { apiClient } from './api';

// 分析结果接口定义
export interface ImageAnalysisResult {
  tags?: string[];
  description?: string;
  objects?: string[];
  confidence?: number;
}

// 图片服务类
class ImageService {
  // 上传图片
  public async uploadImage(file: File, onProgress?: (progress: number) => void): Promise<{ imageId: string; url: string }> {
    try {
      return await apiClient.uploadFile<{ imageId: string; url: string }>('/images/upload', file, onProgress);
    } catch (error) {
      console.error('图片上传失败:', error);
      throw error;
    }
  }

  // 分析图片
  public async analyzeImage(imageId: string): Promise<ImageAnalysisResult> {
    try {
      return await apiClient.post<ImageAnalysisResult>('/images/analyze', { imageId });
    } catch (error) {
      console.error('图片分析失败:', error);
      throw error;
    }
  }

  // 直接上传并分析图片
  public async uploadAndAnalyze(file: File, onProgress?: (progress: number) => void): Promise<ImageAnalysisResult> {
    try {
      // 先上传图片
      const uploadResult = await this.uploadImage(file, onProgress);
      // 然后分析图片
      return await this.analyzeImage(uploadResult.imageId);
    } catch (error) {
      console.error('图片上传和分析失败:', error);
      throw error;
    }
  }

  // 获取历史分析结果
  public async getAnalysisHistory(): Promise<{ imageId: string; result: ImageAnalysisResult; timestamp: string }[]> {
    try {
      return await apiClient.get<{ imageId: string; result: ImageAnalysisResult; timestamp: string }[]>('/images/history');
    } catch (error) {
      console.error('获取分析历史失败:', error);
      throw error;
    }
  }
}

// 导出图片服务单例
export const imageService = new ImageService();