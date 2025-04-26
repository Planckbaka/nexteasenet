const db = require('../config/database');

/**
 * 数据库服务
 * 用于图片和分析结果的存储与检索
 */
class DatabaseService {
  /**
   * 保存上传的图片信息
   * @param {Object} imageData - 图片信息
   * @param {number} userId - 用户ID（可选）
   * @returns {Promise<Object>} 保存的图片记录
   */
  async saveImage(imageData, userId = null) {
    try {
      const { filename, originalname, path, size, mimetype } = imageData;
      
      const query = `
        INSERT INTO images (user_id, filename, original_filename, file_path, file_size, mime_type)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, filename, file_path
      `;
      
      const values = [userId, filename, originalname, path, size, mimetype];
      const result = await db.query(query, values);
      
      return result.rows[0];
    } catch (error) {
      console.error('保存图片信息失败:', error);
      throw error;
    }
  }

  /**
   * 保存图片分析结果
   * @param {number} imageId - 图片ID
   * @param {Object} analysisData - 分析结果数据
   * @returns {Promise<Object>} 保存的分析结果记录
   */
  async saveAnalysisResult(imageId, analysisData) {
    try {
      const { tags, objects, description } = analysisData;
      
      const query = `
        INSERT INTO analysis_results (image_id, tags, objects, description)
        VALUES ($1, $2, $3, $4)
        RETURNING id, image_id, created_at
      `;
      
      const values = [
        imageId,
        JSON.stringify(tags || []),
        JSON.stringify(objects || []),
        description || ''
      ];
      
      const result = await db.query(query, values);
      
      return result.rows[0];
    } catch (error) {
      console.error('保存分析结果失败:', error);
      throw error;
    }
  }

  /**
   * 获取图片分析结果
   * @param {number} imageId - 图片ID
   * @returns {Promise<Object>} 分析结果
   */
  async getAnalysisResult(imageId) {
    try {
      const query = `
        SELECT ar.*, i.filename, i.file_path
        FROM analysis_results ar
        JOIN images i ON ar.image_id = i.id
        WHERE ar.image_id = $1
        ORDER BY ar.created_at DESC
        LIMIT 1
      `;
      
      const result = await db.query(query, [imageId]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const analysisResult = result.rows[0];
      
      // 解析JSON字段
      return {
        id: analysisResult.id,
        imageId: analysisResult.image_id,
        tags: JSON.parse(analysisResult.tags),
        objects: JSON.parse(analysisResult.objects),
        description: analysisResult.description,
        filename: analysisResult.filename,
        filePath: analysisResult.file_path,
        createdAt: analysisResult.created_at
      };
    } catch (error) {
      console.error('获取分析结果失败:', error);
      throw error;
    }
  }

  /**
   * 获取用户的分析历史记录
   * @param {number} userId - 用户ID
   * @param {number} limit - 限制返回记录数
   * @returns {Promise<Array>} 分析历史记录
   */
  async getAnalysisHistory(userId, limit = 10) {
    try {
      const query = `
        SELECT ar.id, ar.image_id, ar.tags, ar.objects, ar.description, ar.created_at,
               i.filename, i.file_path
        FROM analysis_results ar
        JOIN images i ON ar.image_id = i.id
        WHERE i.user_id = $1
        ORDER BY ar.created_at DESC
        LIMIT $2
      `;
      
      const result = await db.query(query, [userId, limit]);
      
      // 处理结果，解析JSON字段
      return result.rows.map(row => ({
        id: row.id,
        imageId: row.image_id,
        tags: JSON.parse(row.tags),
        objects: JSON.parse(row.objects),
        description: row.description,
        filename: row.filename,
        filePath: row.file_path,
        createdAt: row.created_at
      }));
    } catch (error) {
      console.error('获取分析历史记录失败:', error);
      throw error;
    }
  }
}

module.exports = new DatabaseService();