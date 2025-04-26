const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const dbService = require('../services/database');

// 配置文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 限制5MB
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('只支持图片文件格式: jpeg, jpg, png, gif'));
  }
});

// 上传图片路由
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '没有上传文件'
      });
    }

    // 获取用户ID（如果有认证系统）
    const userId = req.user ? req.user.id : null;
    
    // 准备图片数据
    const imageData = {
      filename: req.file.filename,
      originalname: req.file.originalname,
      path: `/uploads/${req.file.filename}`,
      size: req.file.size,
      mimetype: req.file.mimetype
    };
    
    // 保存图片信息到数据库
    let savedImage;
    try {
      savedImage = await dbService.saveImage(imageData, userId);
    } catch (dbError) {
      console.error('保存图片信息到数据库失败:', dbError);
      // 继续处理，不影响API响应
    }

    // 返回上传成功的信息和文件路径
    res.status(200).json({
      success: true,
      message: '文件上传成功',
      data: {
        id: savedImage ? savedImage.id : null,
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
        mimetype: req.file.mimetype,
        size: req.file.size
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '文件上传失败',
      error: error.message
    });
  }
});

module.exports = router;