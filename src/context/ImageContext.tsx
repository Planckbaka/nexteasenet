import { createContext, useContext, useState, ReactNode } from 'react';
import { imageService, ImageAnalysisResult } from '../services/imageService';
import { ApiError } from '../services/api';

interface ImageState {
  isUploading: boolean;
  uploadProgress: number;
  selectedFile: File | undefined;
  isAnalyzing: boolean;
  analysisData: {
    tags?: string[];
    description?: string;
    objects?: string[];
    confidence?: number;
  } | undefined;
  analysisError: string | undefined;
}

interface ImageContextType extends ImageState {
  handleUpload: (file: File) => void;
  startAnalysis: () => void;
  resetState: () => void;
}

const initialState: ImageState = {
  isUploading: false,
  uploadProgress: 0,
  selectedFile: undefined,
  isAnalyzing: false,
  analysisData: undefined,
  analysisError: undefined,
};

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImageContext must be used within an ImageProvider');
  }
  return context;
};

interface ImageProviderProps {
  children: ReactNode;
}

export const ImageProvider = ({ children }: ImageProviderProps) => {
  const [state, setState] = useState<ImageState>(initialState);

  const handleUpload = (file: File) => {
    // 重置之前的状态
    setState(prev => ({
      ...prev,
      isUploading: true,
      uploadProgress: 0,
      selectedFile: file,
      analysisData: undefined,
      analysisError: undefined,
    }));
    
    // 使用API服务上传图片
    imageService.uploadImage(file, (progress) => {
      setState(prev => ({
        ...prev,
        uploadProgress: progress
      }));
    })
    .then(() => {
      setState(prev => ({
        ...prev,
        isUploading: false,
        uploadProgress: 100
      }));
      // 上传完成后开始分析
      startAnalysis();
    })
    .catch((error: ApiError) => {
      setState(prev => ({
        ...prev,
        isUploading: false,
        analysisError: `上传失败: ${error.message}`
      }));
    });
  };
  
  const startAnalysis = () => {
    // 设置分析状态
    setState(prev => ({ ...prev, isAnalyzing: true, analysisError: undefined }));
    
    // 确保有选中的文件
    if (!state.selectedFile) {
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        analysisError: '没有选择图片文件'
      }));
      return;
    }
    
    // 调用API服务分析图片
    imageService.uploadAndAnalyze(state.selectedFile)
      .then((result: ImageAnalysisResult) => {
        setState(prev => ({
          ...prev,
          isAnalyzing: false,
          analysisData: result
        }));
      })
      .catch((error: ApiError) => {
        setState(prev => ({
          ...prev,
          isAnalyzing: false,
          analysisError: `分析失败: ${error.message}`
        }));
      });
  };
  
  // 临时模拟分析结果，在后端API完成前使用
  const mockAnalysis = () => {
    // 设置分析状态
    setState(prev => ({ ...prev, isAnalyzing: true, analysisError: undefined }));
    
    // 延迟执行，模拟API调用
    setTimeout(() => {
      try {
        // 随机生成分析结果
        const mockTags = ['人物', '自然', '建筑', '动物', '风景', '城市', '科技', '艺术'];
        const mockObjects = ['人', '树', '建筑物', '汽车', '天空', '水', '动物'];
        
        const randomTags = Array.from({ length: Math.floor(Math.random() * 5) + 1 }, 
          () => mockTags[Math.floor(Math.random() * mockTags.length)]);
        
        const randomObjects = Array.from({ length: Math.floor(Math.random() * 4) + 1 }, 
          () => mockObjects[Math.floor(Math.random() * mockObjects.length)]);
        
        const descriptions = [
          '这是一张风景照片，展示了自然美景。',
          '这是一张人物肖像，表情生动。',
          '这是一张城市景观，展示了现代建筑。',
          '这是一张动物照片，栩栩如生。',
          '这是一张艺术作品，色彩丰富。'
        ];
        
        const analysisResult = {
          tags: [...new Set(randomTags)],
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          objects: [...new Set(randomObjects)],
          confidence: Math.floor(Math.random() * 30) + 70, // 70-100之间的随机数
        };
        
        setState(prev => ({
          ...prev,
          isAnalyzing: false,
          analysisData: analysisResult,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          isAnalyzing: false,
          analysisError: '分析过程中出现错误，请重试。',
        }));
      }
    }, 2000);
  };
  };
  
  const resetState = () => {
    // 如果有预览URL，需要释放
    if (state.selectedFile) {
      URL.revokeObjectURL(URL.createObjectURL(state.selectedFile));
    }
    setState(initialState);
  };

  return (
    <ImageContext.Provider
      value={{
        ...state,
        handleUpload,
        startAnalysis,
        resetState,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};