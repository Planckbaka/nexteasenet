const express = require('express');
const router = express.Router();
const dbService = require('../services/database');

// 获取分析历史记录
router.get('/', async (req, res) => {
  try {
    // 获取用户ID（如果有认证系统）
    const userId = req.user ? req.user.id : null;
    
    // 如果没有用户ID，返回空数组（或者可以返回错误）
    if (!userId) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }
    
    // 获取历史记录数量限制
    const limit = parseInt(req.query.limit) || 10;
    
    // 从数据库获取分析历史
    const historyRecords = await dbService.getAnalysisHistory(userId, limit);
    
    res.status(200).json({
      success: true,
      data: historyRecords
    });
  } catch (error) {
    console.error('获取分析历史失败:', error);
    res.status(500).json({
      success: false,
      message: '获取分析历史失败',
      error: error.message
    });
  }
});

// 获取特定分析结果
router.get('/:id', async (req, res) => {
  try {
    const analysisId = req.params.id;
    
    // 从数据库获取分析结果
    const query = `
      SELECT ar.*, i.filename, i.file_path
      FROM analysis_results ar
      JOIN images i ON ar.image_id = i.id
      WHERE ar.id = $1
    `;
    
    const result = await db.query(query, [analysisId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '分析结果不存在'
      });
    }
    
    const analysisResult = result.rows[0];
    
    // 解析JSON字段
    const formattedResult = {
      id: analysisResult.id,
      imageId: analysisResult.image_id,
      tags: JSON.parse(analysisResult.tags),
      objects: JSON.parse(analysisResult.objects),
      description: analysisResult.description,
      filename: analysisResult.filename,
      filePath: analysisResult.file_path,
      createdAt: analysisResult.created_at
    };
    
    res.status(200).json({
      success: true,
      data: formattedResult
    });
  } catch (error) {
    console.error('获取分析结果失败:', error);
    res.status(500).json({
      success: false,
      message: '获取分析结果失败',
      error: error.message
    });
  }
});

module.exports = router;