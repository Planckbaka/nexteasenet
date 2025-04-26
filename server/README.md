# AI 图片内容分析项目后端

这是AI图片内容分析项目的后端API服务，使用Node.js和Express构建。

## 功能特点

- 图片上传与存储
- 图片格式验证与大小限制
- 图片内容AI分析（目前使用模拟数据，后续将集成ModelScope的Qwen模型）
- 跨域资源共享(CORS)支持
- 错误处理中间件

## 项目结构

```
server/
├── index.js          # 服务器入口文件
├── package.json      # 项目依赖配置
├── .env.example      # 环境变量示例
├── uploads/          # 上传文件存储目录
└── routes/           # API路由
    ├── upload.js     # 图片上传路由
    └── analysis.js   # 图片分析路由
```

## 安装与启动

1. 安装依赖

```bash
cd server
npm install
```

2. 创建环境变量文件

```bash
cp .env.example .env
# 编辑.env文件，填入实际配置信息
```

3. 启动服务器

```bash
# 开发模式（使用nodemon自动重启）
npm run dev

# 生产模式
npm start
```

服务器默认运行在 http://localhost:3000

## API接口

### 图片上传

- **URL**: `/api/upload`
- **方法**: POST
- **Content-Type**: multipart/form-data
- **参数**: 
  - `image`: 图片文件
- **响应示例**:
```json
{
  "success": true,
  "message": "文件上传成功",
  "data": {
    "filename": "1620000000000-123456789.jpg",
    "path": "/uploads/1620000000000-123456789.jpg",
    "mimetype": "image/jpeg",
    "size": 1024000
  }
}
```

### 图片分析

- **URL**: `/api/analysis`
- **方法**: POST
- **Content-Type**: application/json
- **参数**: 
  - `imagePath`: 图片路径（从上传接口返回）
- **响应示例**:
```json
{
  "success": true,
  "message": "图片分析成功",
  "data": {
    "objects": [
      { "name": "人物", "confidence": 0.95 },
      { "name": "建筑", "confidence": 0.85 },
      { "name": "树木", "confidence": 0.78 }
    ],
    "tags": ["户外", "城市", "白天"],
    "description": "这是一张城市街道的照片，有人在建筑物前行走，周围有一些树木。"
  }
}
```

## 后续开发计划

- 集成ModelScope的Qwen模型进行真实图片分析
- 添加数据库存储分析结果
- 实现用户认证与授权
- 添加分析历史记录功能