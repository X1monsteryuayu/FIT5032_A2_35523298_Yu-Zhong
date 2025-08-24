const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// 简单的健康检查
app.get('/health', (req, res) => {
  console.log('Health check requested')
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Email server is running'
  })
})

// 简单的邮件发送端点（模拟）
app.post('/api/send-email', (req, res) => {
  console.log('Email request received:', req.body)
  res.json({ 
    success: true, 
    message: 'Email would be sent (demo mode)',
    messageId: 'demo-' + Date.now()
  })
})

app.post('/api/send-contact', (req, res) => {
  console.log('Contact form request received:', req.body)
  res.json({ 
    success: true, 
    message: 'Contact form would be sent (demo mode)',
    messageId: 'contact-demo-' + Date.now()
  })
})

app.listen(PORT, () => {
  console.log(`✅ Test email server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`📧 Email endpoint: http://localhost:${PORT}/api/send-email`)
  console.log(`📝 Contact endpoint: http://localhost:${PORT}/api/send-contact`)
})
