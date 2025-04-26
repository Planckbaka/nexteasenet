import './App.css'
import MainLayout from './components/Layout/MainLayout'
import ImageUploader from './components/Upload/ImageUploader'
import ImagePreview from './components/Preview/ImagePreview'
import AnalysisResult from './components/Analysis/AnalysisResult'
import { ImageProvider, useImageContext } from './context/ImageContext'

// 主应用组件包装器，提供状态管理
function AppWrapper() {
  return (
    <ImageProvider>
      <AppContent />
    </ImageProvider>
  );
}

// 主应用内容组件，使用状态管理
function AppContent() {
  const {
    isUploading,
    uploadProgress,
    selectedFile,
    isAnalyzing,
    analysisData,
    analysisError,
    handleUpload
  } = useImageContext();


  return (
    <MainLayout>
      <div className="app-container">
        <div className="app-header">
          <h1 className="app-title">AI 图片内容分析</h1>
          <p className="app-description">
            上传图片，利用先进的AI技术分析图片内容，获取详细的图像信息和见解。
          </p>
        </div>
        
        <div className="card-container">
          <h2 className="section-title">开始分析</h2>
          <div className="placeholder-container">
            <div className="upload-section">
              {!selectedFile ? (
                <ImageUploader 
                  onUpload={handleUpload}
                  isUploading={isUploading}
                  progress={uploadProgress}
                />
              ) : (
                <ImagePreview imageFile={selectedFile} />
              )}
            </div>
            
            <div className="result-section">
              <AnalysisResult 
                isAnalyzing={isAnalyzing}
                analysisData={analysisData}
                error={analysisError}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

function App() {
  return <AppWrapper />;
}

export default App
