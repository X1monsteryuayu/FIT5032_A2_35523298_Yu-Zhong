# Healthy Pathway - 邮件服务使用指南

## 📧 真实邮件API集成完成

我已经为您的 Healthy Pathway 应用程序集成了真实的邮件服务功能，替换了之前的 EmailJS 客户端解决方案。

### 🏗️ 架构概览

```
前端 Vue.js 应用
    ↓ 发送邮件请求
Node.js Express 服务器 (email-server/)
    ↓ 使用邮件API
SendGrid / SMTP 邮件服务商
    ↓ 发送邮件
收件人邮箱 (带PDF附件)
```

### 📁 项目文件结构

```
HealthyPathway/
├── src/
│   ├── services/
│   │   └── emailService.js          # 前端邮件服务
│   └── pages/
│       └── Contact.vue              # 联系表单页面
├── email-server/                    # Node.js 邮件服务器
│   ├── server.js                   # Express 服务器
│   ├── package.json                # 依赖配置
│   └── .env.example               # 环境变量模板
└── .env.example                    # 前端环境变量模板
```

### ⚙️ 部署和配置步骤

#### 1. 配置前端环境变量

复制 `.env.example` 为 `.env.local`:
```bash
cp .env.example .env.local
```

编辑 `.env.local`:
```env
VUE_APP_EMAIL_API_BASE=http://localhost:3001
```

#### 2. 设置邮件服务器

进入邮件服务器目录：
```bash
cd email-server
npm install
```

复制环境变量模板：
```bash
cp .env.example .env
```

编辑 `.env` 文件，选择以下配置之一：

**选项A: 使用 SendGrid (推荐)**
```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your_sendgrid_api_key_here
FROM_EMAIL=noreply@healthypathway.com
FROM_NAME=Healthy Pathway
```

**选项B: 使用 Gmail SMTP**
```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-gmail@gmail.com
FROM_NAME=Healthy Pathway
```

**选项C: 使用其他 SMTP 服务**
```env
EMAIL_SERVICE=smtp
SMTP_HOST=your-smtp-host.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@domain.com
SMTP_PASS=your-password
FROM_EMAIL=your-email@domain.com
FROM_NAME=Healthy Pathway
```

#### 3. 启动服务

启动邮件服务器：
```bash
cd email-server
npm start
```

启动 Vue.js 应用：
```bash
cd .. # 回到主目录
npm run serve
```

### 🔧 功能特性

#### ✅ 已实现的功能

1. **联系表单邮件发送**
   - 支持姓名、邮箱、电话、主题、消息内容
   - 实时表单验证
   - 发送状态反馈

2. **PDF附件功能**
   - 自动生成预约确认PDF
   - 专业的邮件模板设计
   - 附件支持多种格式

3. **预约确认邮件**
   - 包含完整预约信息
   - HTML格式邮件模板
   - PDF确认单附件

4. **安全性和可靠性**
   - 服务器端邮件发送
   - 错误处理和日志记录
   - 环境变量配置

### 🎯 使用方法

#### 在Contact页面测试
1. 访问 `/contact` 页面
2. 填写联系表单
3. 点击"发送演示邮件"按钮测试PDF附件功能
4. 检查收件邮箱

#### 在代码中使用

```javascript
import { sendAppointmentConfirmation, sendContactForm } from '@/services/emailService'

// 发送预约确认
const appointmentData = {
  id: 'APPT-123',
  patientName: 'John Doe',
  patientEmail: 'john@example.com',
  doctorName: 'Dr. Smith',
  date: '2024-01-15',
  time: '10:00 AM',
  type: 'General Consultation'
}

const result = await sendAppointmentConfirmation(appointmentData)
if (result.success) {
  console.log('邮件发送成功!')
}

// 发送联系表单
const contactData = {
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'appointment',
  message: 'I would like to book an appointment.'
}

const result = await sendContactForm(contactData)
```

### 🚨 故障排除

#### 常见问题

1. **邮件服务器连接失败**
   - 检查 `.env` 文件配置是否正确
   - 确认邮件服务器端口 3001 未被占用
   - 验证API密钥或SMTP凭据

2. **邮件发送失败**
   - 检查发件人邮箱配置
   - 确认收件人邮箱地址有效
   - 查看服务器控制台错误信息

3. **PDF生成问题**
   - 确认 jsPDF 库已正确安装
   - 检查浏览器控制台是否有错误

#### 调试步骤

1. 检查浏览器开发者工具的网络请求
2. 查看邮件服务器控制台日志
3. 验证环境变量配置

### 🔄 后续改进建议

1. **邮件队列系统**: 使用 Bull Queue 处理大量邮件
2. **邮件模板管理**: 实现动态邮件模板系统
3. **发送统计**: 添加邮件发送成功率统计
4. **多语言支持**: 支持多语言邮件模板
5. **邮件预览**: 发送前预览邮件内容

### 📞 支持

如果遇到问题，请检查：
1. Node.js 版本 (建议 16+)
2. 网络连接状态
3. 邮件服务商的API配额限制
4. 防火墙设置

邮件服务现在已经完全集成并可以投入使用！🎉
