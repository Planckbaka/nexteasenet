import React from 'react';
import './AnalysisResult.css';

interface AnalysisResultProps {
  isAnalyzing: boolean;
  analysisData?: {
    tags?: string[];
    description?: string;
    objects?: string[];
    confidence?: number;
  };
  error?: string;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ 
  isAnalyzing, 
  analysisData, 
  error 
}) => {
  if (isAnalyzing) {
    return (
      <div className="analysis-result analyzing">
        <div className="loading-spinner"></div>
        <p>正在分析图片内容...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analysis-result error">
        <h3>分析出错</h3>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="analysis-result empty">
        <p>上传图片后将在此显示分析结果</p>
      </div>
    );
  }

  return (
    <div className="analysis-result">
      <h3>分析结果</h3>
      
      {analysisData.description && (
        <div className="result-section">
          <h4>图片描述</h4>
          <p>{analysisData.description}</p>
        </div>
      )}

      {analysisData.tags && analysisData.tags.length > 0 && (
        <div className="result-section">
          <h4>标签</h4>
          <div className="tags-container">
            {analysisData.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      )}

      {analysisData.objects && analysisData.objects.length > 0 && (
        <div className="result-section">
          <h4>检测到的对象</h4>
          <ul className="objects-list">
            {analysisData.objects.map((object, index) => (
              <li key={index}>{object}</li>
            ))}
          </ul>
        </div>
      )}

      {analysisData.confidence !== undefined && (
        <div className="result-section">
          <h4>置信度</h4>
          <div className="confidence-bar">
            <div 
              className="confidence-fill" 
              style={{ width: `${analysisData.confidence}%` }}
            ></div>
          </div>
          <p className="confidence-text">{analysisData.confidence}%</p>
        </div>
      )}
    </div>
  );
};

export default AnalysisResult;