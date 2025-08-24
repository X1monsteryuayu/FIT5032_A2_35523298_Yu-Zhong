const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 文件上传配置
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// 检查是否在测试模式
const isTestMode = process.env.TEST_MODE === 'true' || process.env.DEMO_MODE === 'true';

console.log(`🚀 邮件服务器启动 - 模式: ${isTestMode ? '测试模式' : '生产模式'}`);

// 初始化邮件配置（仅在非测试模式下）
let transporter = null;

if (!isTestMode) {
  // 生产模式 - 配置真实的邮件服务
  transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || process.env.SMTP_USER,
      pass: process.env.EMAIL_APP_PASSWORD || process.env.SMTP_PASS
    }
  });
  
  // 验证邮件配置
  transporter.verify((error, success) => {
    if (error) {
      console.error('❌ 邮件配置错误:', error);
    } else {
      console.log('✅ 邮件服务器准备就绪');
    }
  });
}

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ 
    status: 'running',
    mode: isTestMode ? 'test' : 'production',
    timestamp: new Date().toISOString(),
    service: 'HealthyPathway Email API'
  });
});

// 测试模式邮件发送函数
async function sendTestEmail(emailData) {
  const { to, subject, html, attachments = [] } = emailData;
  
  console.log('\n📧 测试模式 - 模拟邮件发送:');
  console.log(`📮 收件人: ${to}`);
  console.log(`📝 主题: ${subject}`);
  console.log(`📄 内容长度: ${html ? html.length : 0} 字符`);
  console.log(`📎 附件数量: ${attachments.length}`);
  
  if (attachments.length > 0) {
    attachments.forEach((attachment, index) => {
      const sizeKB = attachment.content ? Math.round(attachment.content.length / 1024) : 0;
      console.log(`   📎 附件 ${index + 1}: ${attachment.filename} (${sizeKB} KB)`);
    });
  }
  
  // 模拟发送延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const messageId = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  console.log(`✅ 邮件模拟发送成功! ID: ${messageId}\n`);
  
  return {
    success: true,
    messageId: messageId,
    message: '邮件已在测试模式下成功模拟发送',
    recipient: to,
    timestamp: new Date().toISOString()
  };
}

// 发送邮件端点 - 支持附件
app.post('/api/send-email', upload.single('attachment'), async (req, res) => {
  try {
    const { to, subject, message, html, fromEmail, fromName } = req.body;
    const attachment = req.file;
    
    // 验证必需字段
    if (!to || !subject || (!message && !html)) {
      return res.status(400).json({
        success: false,
        error: '缺少必需字段: to, subject, message/html'
      });
    }
    
    // 准备邮件数据
    const emailData = {
      to,
      subject,
      html: html || `<p>${message}</p>`,
      from: `${fromName || 'HealthyPathway'} <${fromEmail || 'noreply@healthypathway.com'}>`,
      attachments: []
    };
    
    // 处理附件
    if (attachment) {
      emailData.attachments.push({
        filename: attachment.originalname,
        content: attachment.buffer,
        contentType: attachment.mimetype
      });
    }
    
    let result;
    
    if (isTestMode) {
      // 测试模式
      result = await sendTestEmail(emailData);
    } else {
      // 生产模式
      result = await sendWithSMTP(emailData);
    }
    
    res.json(result);
    
  } catch (error) {
    console.error('❌ 邮件发送错误:', error);
    res.status(500).json({
      success: false,
      error: error.message || '邮件发送失败'
    });
  }
});

// SMTP 发送函数
async function sendWithSMTP(emailData) {
  if (!transporter) {
    throw new Error('邮件传输器未配置');
  }
  
  const mailOptions = {
    from: emailData.from,
    to: emailData.to,
    subject: emailData.subject,
    html: emailData.html,
    attachments: emailData.attachments
  };
  
  const info = await transporter.sendMail(mailOptions);
  console.log('✅ 邮件发送成功:', info.messageId);
  
  return {
    success: true,
    messageId: info.messageId,
    message: '邮件发送成功 (SMTP)',
    recipient: emailData.to,
    timestamp: new Date().toISOString()
  };
}

// 联系表单邮件端点
app.post('/api/send-contact', async (req, res) => {
  try {
    const { name, email, message, attachment } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: '缺少必需字段: name, email, message'
      });
    }
    
    const emailData = {
      to: 'support@healthypathway.com',
      subject: `联系表单消息 - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            新的联系表单消息
          </h2>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">姓名:</td>
                <td style="padding: 8px 0; color: #6b7280;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">邮箱:</td>
                <td style="padding: 8px 0; color: #6b7280;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151; vertical-align: top;">消息:</td>
                <td style="padding: 8px 0; color: #6b7280;">${message.replace(/\n/g, '<br>')}</td>
              </tr>
            </table>
          </div>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            发送时间: ${new Date().toLocaleString('zh-CN')} | HealthyPathway 联系表单
          </p>
        </div>
      `,
      from: `HealthyPathway Contact <noreply@healthypathway.com>`,
      replyTo: email,
      attachments: []
    };
    
    // 处理Base64附件
    if (attachment && attachment.data) {
      emailData.attachments.push({
        filename: attachment.filename || 'attachment.pdf',
        content: Buffer.from(attachment.data, 'base64'),
        contentType: attachment.type || 'application/pdf'
      });
    }
    
    let result;
    
    if (isTestMode) {
      result = await sendTestEmail(emailData);
    } else {
      result = await sendWithSMTP(emailData);
    }
    
    res.json(result);
    
  } catch (error) {
    console.error('❌ 联系表单邮件发送错误:', error);
    res.status(500).json({
      success: false,
      error: error.message || '邮件发送失败'
    });
  }
});

// 批量发送邮件端点
app.post('/api/send-bulk', async (req, res) => {
  try {
    const { recipients, subject, html, fromEmail, fromName } = req.body;
    
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        error: '收件人列表不能为空'
      });
    }
    
    if (!subject || !html) {
      return res.status(400).json({
        success: false,
        error: '缺少必需字段: subject, html'
      });
    }
    
    const results = [];
    
    for (const recipient of recipients) {
      try {
        const emailData = {
          to: recipient,
          subject,
          html,
          from: `${fromName || 'HealthyPathway'} <${fromEmail || 'noreply@healthypathway.com'}>`,
          attachments: []
        };
        
        let result;
        if (isTestMode) {
          result = await sendTestEmail(emailData);
        } else {
          result = await sendWithSMTP(emailData);
        }
        
        results.push({
          recipient,
          success: true,
          messageId: result.messageId
        });
        
        // 添加延迟以避免发送过快
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        results.push({
          recipient,
          success: false,
          error: error.message
        });
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    
    res.json({
      success: true,
      message: `批量邮件发送完成: ${successCount}/${recipients.length} 成功`,
      results,
      summary: {
        total: recipients.length,
        success: successCount,
        failed: recipients.length - successCount
      }
    });
    
  } catch (error) {
    console.error('❌ 批量邮件发送错误:', error);
    res.status(500).json({
      success: false,
      error: error.message || '批量邮件发送失败'
    });
  }
});

// 错误处理中间件
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: '服务器内部错误'
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: '端点不存在',
    availableEndpoints: [
      'GET /health',
      'POST /api/send-email',
      'POST /api/send-contact',
      'POST /api/send-bulk'
    ]
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`\n🎯 HealthyPathway 邮件服务器运行在 http://localhost:${PORT}`);
  console.log(`📧 当前模式: ${isTestMode ? '🧪 测试模式 (模拟发送)' : '🚀 生产模式'}`);
  console.log('\n✨ 可用端点:');
  console.log('   📊 GET  /health - 健康检查');
  console.log('   📧 POST /api/send-email - 发送邮件 (支持附件)');
  console.log('   📝 POST /api/send-contact - 联系表单邮件');
  console.log('   📮 POST /api/send-bulk - 批量发送邮件');
  console.log('\n🔧 配置信息:');
  console.log(`   🌐 服务器地址: http://localhost:${PORT}`);
  console.log(`   📁 最大附件大小: 10MB`);
  console.log(`   ⚡ 测试模式: ${isTestMode ? '启用' : '禁用'}`);
  console.log('\n🚀 服务器就绪！\n');
});
