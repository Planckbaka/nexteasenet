import { useState, useEffect } from 'react';
import './ImagePreview.css';

interface ImagePreviewProps {
  imageFile?: File;
  imageUrl?: string;
  altText?: string;
}

const ImagePreview = ({ imageFile, imageUrl, altText = '预览图片' }: ImagePreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    // 清理之前的预览URL
    if (previewUrl && !imageUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    // 如果有文件，创建预览URL
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      
      // 组件卸载时清理URL
      return () => {
        URL.revokeObjectURL(url);
      };
    } else if (imageUrl) {
      // 如果直接提供了URL，使用该URL
      setPreviewUrl(imageUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [imageFile, imageUrl]);

  if (!previewUrl) {
    return (
      <div className="image-preview empty">
        <p>无图片预览</p>
      </div>
    );
  }

  return (
    <div className="image-preview">
      <div className="preview-container">
        <img src={previewUrl} alt={altText} className="preview-image" />
      </div>
      <div className="image-info">
        {imageFile && (
          <>
            <p className="file-name">{imageFile.name}</p>
            <p className="file-size">{formatFileSize(imageFile.size)}</p>
          </>
        )}
      </div>
    </div>
  );
};

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default ImagePreview;