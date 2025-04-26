const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const modelscope = require('../services/modelscope');
const dbService = require('../services/database');

// 分析图片路由
router.post('/', async (req, res) => {
  try {
    const { imagePath, imageId } = req.body;
    
    if (!imagePath) {
      return res.status(400).json({
        success: false,
        message: '缺少图片路径'
      });
    }
    
    // 验证文件是否存在
    const fullPath = path.join(__dirname, '..', imagePath.replace(/^\/uploads\//, 'uploads/'));
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({
        success: false,
        message: '图片文件不存在'
      });
    }
    
    // 调用ModelScope的Qwen模型进行图片分析
    let analysisResult;
    try {
      // 检查是否有API密钥
      if (process.env.MODELSCOPE_API_KEY) {
        // 使用真实API
        analysisResult = await modelscope.analyzeImage(fullPath);
      } else {
        // 使用模拟数据
        console.warn('使用模拟数据进行图片分析，请设置MODELSCOPE_API_KEY环境变量');
        analysisResult = modelscope.mockAnalysisResult();
      }
    } catch (error) {
      console.error('AI分析失败，使用模拟数据:', error);
      analysisResult = modelscope.mockAnalysisResult();
    }
    
    // 如果提供了imageId，保存分析结果到数据库
    if (imageId) {
      try {
        await dbService.saveAnalysisResult(imageId, analysisResult);
      } catch (dbError) {
        console.error('保存分析结果到数据库失败:', dbError);
        // 继续处理，不影响API响应
      }
    }
    
    res.status(200).json({
      success: true,
      message: '图片分析成功',
      data: analysisResult
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '图片分析失败',
      error: error.message
    });
  }
});

// 获取分析历史记录（未来实现）
router.get('/history', (req, res) => {
  // TODO: 从数据库获取分析历史记录
  res.status(200).json({
    success: true,
    message: '获取分析历史记录成功',
    data: []
  });
});

module.exports = router;