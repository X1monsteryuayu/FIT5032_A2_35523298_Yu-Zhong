const express = require('express');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// 基本中间件
app.use(cors());
app.use(express.json());

// 配置 multer 用于文件上传
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 限制
  fileFilter: (req, file, cb) => {
    // 允许的文件类型
    const allowedTypes = /\.(jpg|jpeg|png|gif|pdf|doc|docx|txt|csv|xlsx)$/i;
    const allowed = allowedTypes.test(file.originalname);
    cb(null, allowed);
  }
});

// 简单的健康检查
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({ 
    status: 'OK',
    message: 'Email server is running',
    timestamp: new Date().toISOString()
  });
});

// 测试邮件端点
app.post('/api/send-email', (req, res) => {
  console.log('Email send request received:', req.body);
  
  // 模拟邮件发送
  setTimeout(() => {
    res.json({
      success: true,
      message: '测试邮件发送成功',
      messageId: `test-${Date.now()}`,
      mode: 'demo'
    });
  }, 500);
});

// 联系表单端点（支持附件）
app.post('/api/send-contact-with-file', upload.array('files', 5), (req, res) => {
  console.log('Contact form with attachments received:');
  console.log('Body:', req.body);
  console.log('Files:', req.files?.map(f => ({ 
    name: f.originalname, 
    size: f.size, 
    type: f.mimetype 
  })));
  
  setTimeout(() => {
    res.json({
      success: true,
      message: `联系表单已提交（测试模式）${req.files?.length ? `，包含${req.files.length}个附件` : ''}`,
      messageId: `contact-file-${Date.now()}`,
      attachments: req.files?.length || 0,
      mode: 'demo'
    });
  }, 500);
});

// 联系表单端点
app.post('/api/send-contact', (req, res) => {
  console.log('Contact form request received:', req.body);
  
  setTimeout(() => {
    res.json({
      success: true,
      message: '联系表单已提交（测试模式）',
      messageId: `contact-${Date.now()}`,
      mode: 'demo'
    });
  }, 500);
});

// 启动服务器
const server = app.listen(PORT, () => {
  console.log('🚀 邮件服务器启动成功！');
  console.log(`📧 服务器地址: http://localhost:${PORT}`);
  console.log('✨ 测试模式已启用');
});

server.on('error', (error) => {
  console.error('服务器启动错误:', error);
});

console.log('正在启动邮件服务器...');
