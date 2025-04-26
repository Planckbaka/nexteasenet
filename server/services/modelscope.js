const axios = require('axios');
require('dotenv').config();
const fs = require('fs');
const FormData = require('form-data');

/**
 * ModelScope Qwen模型服务
 * 用于图片内容分析
 */
class ModelScopeService {
  constructor() {
    this.apiKey = process.env.MODELSCOPE_API_KEY;
    this.baseUrl = 'https://api.modelscope.cn/api/v1';
    
    if (!this.apiKey) {
      console.warn('警告: ModelScope API密钥未设置，请在.env文件中设置MODELSCOPE_API_KEY');
    }
  }

  /**
   * 分析图片内容
   * @param {string} imagePath - 图片文件路径
   * @returns {Promise<Object>} 分析结果
   */
  async analyzeImage(imagePath) {
    try {
      // 检查文件是否存在
      if (!fs.existsSync(imagePath)) {
        throw new Error(`图片文件不存在: ${imagePath}`);
      }

      // 创建FormData对象
      const formData = new FormData();
      formData.append('image', fs.createReadStream(imagePath));
      
      // 调用ModelScope API
      const response = await axios.post(
        `${this.baseUrl}/models/damo/cv_qwen-vl-chat_visual-question-answering/inference`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            ...formData.getHeaders()
          },
          timeout: 30000 // 30秒超时
        }
      );

      // 处理响应数据
      if (response.data && response.data.success) {
        // 解析ModelScope返回的结果
        return this.parseModelScopeResponse(response.data.data);
      } else {
        throw new Error('ModelScope API调用失败: ' + (response.data.message || '未知错误'));
      }
    } catch (error) {
      console.error('图片分析失败:', error);
      throw error;
    }
  }

  /**
   * 解析ModelScope API返回的结果
   * @param {Object} responseData - API返回的原始数据
   * @returns {Object} 格式化后的分析结果
   */
  parseModelScopeResponse(responseData) {
    try {
      // 注意: 这里的解析逻辑需要根据实际的ModelScope API返回格式调整
      // 以下是一个示例实现
      
      // 如果API返回的是纯文本描述，需要进行进一步处理提取结构化信息
      const description = responseData.text || '';
      
      // 提取标签和对象（这里使用简单的关键词匹配，实际项目中可能需要更复杂的NLP处理）
      const tags = this.extractTags(description);
      const objects = this.extractObjects(description);
      
      return {
        description: description,
        tags: tags,
        objects: objects,
        confidence: 0.85 // 默认置信度
      };
    } catch (error) {
      console.error('解析ModelScope响应失败:', error);
      // 返回一个基本的结果结构
      return {
        description: '无法解析分析结果',
        tags: [],
        objects: [],
        confidence: 0
      };
    }
  }

  /**
   * 从描述中提取标签
   * @param {string} description - 图片描述文本
   * @returns {Array<string>} 提取的标签列表
   */
  extractTags(description) {
    // 这里使用一个简单的关键词列表进行匹配
    // 实际项目中可能需要使用更复杂的NLP技术
    const possibleTags = [
      '人物', '自然', '建筑', '动物', '风景', '城市', '科技', '艺术',
      '室内', '室外', '白天', '夜晚', '食物', '交通', '运动', '工作'
    ];
    
    return possibleTags.filter(tag => 
      description.toLowerCase().includes(tag.toLowerCase())
    );
  }

  /**
   * 从描述中提取对象
   * @param {string} description - 图片描述文本
   * @returns {Array<string>} 提取的对象列表
   */
  extractObjects(description) {
    // 这里使用一个简单的关键词列表进行匹配
    // 实际项目中可能需要使用更复杂的NLP技术
    const possibleObjects = [
      '人', '树', '建筑物', '汽车', '天空', '水', '动物', '桌子',
      '椅子', '电脑', '手机', '书', '花', '山', '河', '海'
    ];
    
    return possibleObjects.filter(obj => 
      description.toLowerCase().includes(obj.toLowerCase())
    );
  }

  /**
   * 模拟分析结果（当API密钥未设置时使用）
   * @returns {Object} 模拟的分析结果
   */
  mockAnalysisResult() {
    const mockTags = ['人物', '自然', '建筑', '动物', '风景', '城市', '科技', '艺术'];
    const mockObjects = ['人', '树', '建筑物', '汽车', '天空', '水', '动物'];
    
    const randomTags = Array.from(
      { length: Math.floor(Math.random() * 5) + 1 }, 
      () => mockTags[Math.floor(Math.random() * mockTags.length)]
    );
    
    const randomObjects = Array.from(
      { length: Math.floor(Math.random() * 4) + 1 }, 
      () => mockObjects[Math.floor(Math.random() * mockObjects.length)]
    );
    
    const descriptions = [
      '这是一张风景照片，展示了自然美景。',
      '这是一张人物肖像，表情生动。',
      '这是一张城市景观，展示了现代建筑。',
      '这是一张动物照片，栩栩如生。',
      '这是一张艺术作品，色彩丰富。'
    ];
    
    return {
      tags: [...new Set(randomTags)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      objects: [...new Set(randomObjects)],
      confidence: Math.floor(Math.random() * 30) + 70 // 70-100之间的随机数
    };
  }
}

module.exports = new ModelScopeService();