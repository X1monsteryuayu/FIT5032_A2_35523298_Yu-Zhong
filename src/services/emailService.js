import jsPDF from 'jspdf'

// API 服务器配置
const EMAIL_API_BASE = process.env.VUE_APP_EMAIL_API_BASE || 'http://localhost:3001'

// 生成PDF确认单
export const generateAppointmentPDF = (appointmentData) => {
  const doc = new jsPDF()
  
  // 设置字体
  doc.setFont('helvetica')
  
  // 标题
  doc.setFontSize(20)
  doc.setTextColor(52, 152, 219) // 蓝色
  doc.text('HEALTHY PATHWAY', 20, 30)
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text('Appointment Confirmation', 20, 45)
  
  // 分隔线
  doc.setLineWidth(0.5)
  doc.line(20, 50, 190, 50)
  
  // 预约信息
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('APPOINTMENT DETAILS', 20, 65)
  
  doc.setFont('helvetica', 'normal')
  doc.text(`Patient Name: ${appointmentData.patientName}`, 20, 80)
  doc.text(`Email: ${appointmentData.patientEmail}`, 20, 95)
  doc.text(`Doctor: ${appointmentData.doctorName}`, 20, 110)
  doc.text(`Date: ${appointmentData.date}`, 20, 125)
  doc.text(`Time: ${appointmentData.time}`, 20, 140)
  doc.text(`Type: ${appointmentData.type || 'General Consultation'}`, 20, 155)
  doc.text(`Reference ID: ${appointmentData.id}`, 20, 170)
  
  if (appointmentData.language) {
    doc.text(`Preferred Language: ${appointmentData.language}`, 20, 185)
  }
  
  // 分隔线
  doc.line(20, 195, 190, 195)
  
  // 重要提醒
  doc.setFont('helvetica', 'bold')
  doc.text('IMPORTANT REMINDERS', 20, 210)
  
  doc.setFont('helvetica', 'normal')
  const reminders = [
    '• Please arrive 15 minutes before your appointment time',
    '• Bring a valid photo ID and insurance card',
    '• Bring a list of current medications',
    '• Contact us at least 24 hours in advance if you need to reschedule',
    '• Wear a mask and follow health protocols'
  ]
  
  let yPosition = 225
  reminders.forEach(reminder => {
    doc.text(reminder, 25, yPosition)
    yPosition += 12
  })
  
  // 联系信息
  doc.setFont('helvetica', 'bold')
  doc.text('CONTACT INFORMATION', 20, yPosition + 10)
  
  doc.setFont('helvetica', 'normal')
  doc.text('Phone: +1 (555) 123-4567', 20, yPosition + 25)
  doc.text('Email: info@healthypathway.com', 20, yPosition + 40)
  doc.text('Website: www.healthypathway.com', 20, yPosition + 55)
  
  return doc
}

// 辅助函数：将Blob转换为base64
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1]) // 移除data:前缀
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// 辅助函数：将文本转换为HTML
const convertTextToHtml = (text) => {
  if (!text) return ''
  return text.replace(/\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
}

// 使用真实的邮件API发送邮件（带后端服务器检测）
export const sendEmailWithAttachment = async (emailData, attachmentData = null) => {
  try {
    // 首先检查后端服务器是否可用
    const healthCheckUrl = `${EMAIL_API_BASE}/health`
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3秒超时
      
      const healthResponse = await fetch(healthCheckUrl, {
        method: 'GET',
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!healthResponse.ok) {
        throw new Error('后端服务器不可用')
      }
    } catch (healthError) {
      console.warn('后端服务器连接失败，启用演示模式:', healthError)
      // 演示模式：生成PDF但不发送邮件
      if (attachmentData) {
        downloadAppointmentPDF(attachmentData)
      }
      return { 
        success: true, 
        messageId: 'demo-' + Date.now(),
        demo: true,
        message: '演示模式：PDF已生成，实际部署时邮件会正常发送'
      }
    }

    let attachments = []
    
    // 如果有附件数据，生成PDF并转换为base64
    if (attachmentData) {
      const pdf = generateAppointmentPDF(attachmentData)
      const pdfBlob = pdf.output('blob')
      const base64Data = await blobToBase64(pdfBlob)
      
      attachments.push({
        content: base64Data,
        filename: `appointment_${attachmentData.id}.pdf`,
        type: 'application/pdf'
      })
    }

    const payload = {
      to: emailData.to,
      toName: emailData.toName || 'Patient',
      subject: emailData.subject,
      htmlContent: emailData.htmlContent || convertTextToHtml(emailData.message),
      attachments: attachments
    }

    const response = await fetch(`${EMAIL_API_BASE}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    const result = await response.json()

    if (response.ok && result.success) {
      console.log('Email sent successfully:', result.messageId)
      return { success: true, messageId: result.messageId }
    } else {
      throw new Error(result.error || 'Failed to send email')
    }
  } catch (error) {
    console.error('Email sending failed:', error)
    // 如果是网络错误，提供演示模式
    if (error.name === 'TypeError' || error.message.includes('fetch')) {
      if (attachmentData) {
        downloadAppointmentPDF(attachmentData)
      }
      return { 
        success: true, 
        messageId: 'demo-' + Date.now(),
        demo: true,
        message: '演示模式：实际部署时需要配置邮件服务器'
      }
    }
    return { success: false, error: error.message }
  }
}

// 发送预约确认邮件
export const sendAppointmentConfirmation = async (appointmentData) => {
  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
          .header { background-color: #3498db; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .appointment-details { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { background-color: #2c3e50; color: white; padding: 20px; text-align: center; }
          .highlight { color: #3498db; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; }
          td { padding: 8px; border-bottom: 1px solid #eee; }
          .important { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏥 Healthy Pathway</h1>
          <h2>Appointment Confirmation</h2>
        </div>
        
        <div class="content">
          <p>Dear <strong>${appointmentData.patientName}</strong>,</p>
          
          <p>Your appointment has been successfully confirmed! Please find the details below:</p>
          
          <div class="appointment-details">
            <h3>📅 Appointment Details:</h3>
            <table>
              <tr><td><strong>Doctor:</strong></td><td>${appointmentData.doctorName}</td></tr>
              <tr><td><strong>Date:</strong></td><td>${appointmentData.date}</td></tr>
              <tr><td><strong>Time:</strong></td><td>${appointmentData.time}</td></tr>
              <tr><td><strong>Type:</strong></td><td>${appointmentData.type || 'General Consultation'}</td></tr>
              <tr><td><strong>Reference ID:</strong></td><td class="highlight">${appointmentData.id}</td></tr>
              ${appointmentData.language ? `<tr><td><strong>Language:</strong></td><td>${appointmentData.language}</td></tr>` : ''}
            </table>
          </div>
          
          <div class="important">
            <h3>⚠️ Important Reminders:</h3>
            <ul>
              <li>Please arrive <strong>15 minutes early</strong></li>
              <li>Bring a valid photo ID and insurance card</li>
              <li>Bring a list of your current medications</li>
              <li>Contact us at least 24 hours in advance if you need to reschedule</li>
              <li>Please wear a mask and follow all health protocols</li>
            </ul>
          </div>
          
          <p>📎 <strong>Attachment:</strong> A detailed PDF confirmation document is attached to this email for your records.</p>
          
          <p>If you have any questions or need to reschedule, please don't hesitate to contact us.</p>
          
          <p>Thank you for choosing Healthy Pathway! We look forward to seeing you.</p>
          
          <p>Best regards,<br>
          <strong>The Healthy Pathway Team</strong></p>
        </div>
        
        <div class="footer">
          <p><strong>📞 Contact Information</strong></p>
          <p>Phone: +1 (555) 123-4567 | Email: info@healthypathway.com</p>
          <p>🌐 Website: www.healthypathway.com</p>
        </div>
      </body>
    </html>
  `

  const emailData = {
    to: appointmentData.patientEmail,
    toName: appointmentData.patientName,
    subject: '✅ Appointment Confirmation - Healthy Pathway',
    htmlContent: htmlContent
  }

  return await sendEmailWithAttachment(emailData, appointmentData)
}

// 发送联系表单邮件
export const sendContactForm = async (formData) => {
  try {
    // 首先检查后端服务器是否可用
    const healthCheckUrl = `${EMAIL_API_BASE}/health`
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3秒超时
      
      const healthResponse = await fetch(healthCheckUrl, {
        method: 'GET',
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!healthResponse.ok) {
        throw new Error('邮件服务器不可用')
      }
      
      console.log('✅ 邮件服务器连接成功，使用真实API发送邮件')
    } catch (healthError) {
      console.warn('⚠️ 邮件服务器连接失败，启用演示模式:', healthError.message)
      return { 
        success: true, 
        messageId: 'demo-contact-' + Date.now(),
        demo: true,
        message: '演示模式：联系表单已模拟提交成功'
      }
    }

    // 使用真实的邮件API发送邮件
    const response = await fetch(`${EMAIL_API_BASE}/api/send-contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      timeout: 10000
    })

    const result = await response.json()

    if (response.ok && result.success) {
      console.log('📧 联系表单邮件发送成功:', result.messageId)
      return { 
        success: true, 
        messageId: result.messageId,
        demo: false,
        message: result.message || '邮件发送成功'
      }
    } else {
      throw new Error(result.error || '邮件发送失败')
    }
  } catch (error) {
    console.error('❌ 联系表单邮件发送失败:', error)
    
    // 如果是网络错误，提供演示模式
    if (error.name === 'TypeError' || error.name === 'AbortError' || error.message.includes('fetch')) {
      return { 
        success: true, 
        messageId: 'demo-contact-' + Date.now(),
        demo: true,
        message: '演示模式：邮件服务器暂时不可用，已模拟成功发送'
      }
    }
    
    return { success: false, error: error.message }
  }
}

// 发送带文件附件的联系表单邮件
export const sendContactFormWithFile = async (formData) => {
  try {
    // 首先检查后端服务器是否可用
    const healthCheckUrl = `${EMAIL_API_BASE}/health`
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3秒超时
      
      const healthResponse = await fetch(healthCheckUrl, {
        method: 'GET',
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!healthResponse.ok) {
        throw new Error('邮件服务器不可用')
      }
      
      console.log('✅ 邮件服务器连接成功，使用真实API发送邮件')
    } catch (healthError) {
      console.warn('⚠️ 邮件服务器连接失败，启用演示模式:', healthError.message)
      return { 
        success: true, 
        messageId: 'demo-contact-file-' + Date.now(),
        demo: true,
        message: '演示模式：联系表单及附件已模拟提交成功'
      }
    }

    // 使用真实的邮件API发送邮件
    const response = await fetch(`${EMAIL_API_BASE}/api/send-contact`, {
      method: 'POST',
      body: formData, // FormData 自动设置正确的 Content-Type
      timeout: 15000
    })

    const result = await response.json()

    if (response.ok && result.success) {
      console.log('📧 联系表单邮件发送成功:', result.messageId)
      return { 
        success: true, 
        messageId: result.messageId,
        demo: false,
        message: result.message || '邮件发送成功'
      }
    } else {
      throw new Error(result.error || '邮件发送失败')
    }
  } catch (error) {
    console.error('❌ 联系表单邮件发送失败:', error)
    
    // 如果是网络错误，提供演示模式
    if (error.name === 'TypeError' || error.name === 'AbortError' || error.message.includes('fetch')) {
      return { 
        success: true, 
        messageId: 'demo-contact-file-' + Date.now(),
        demo: true,
        message: '演示模式：邮件服务器暂时不可用，已模拟成功发送'
      }
    }
    
    return { success: false, error: error.message }
  }
}

// 下载PDF文件
export const downloadAppointmentPDF = (appointmentData) => {
  const pdf = generateAppointmentPDF(appointmentData)
  pdf.save(`appointment_confirmation_${appointmentData.id}.pdf`)
}
