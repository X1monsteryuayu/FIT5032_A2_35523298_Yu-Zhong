// 真实的邮件发送服务 - 使用 SendGrid API
import jsPDF from 'jspdf'

// SendGrid API 配置
const SENDGRID_API_KEY = process.env.VUE_APP_SENDGRID_API_KEY || 'your-sendgrid-api-key'
const SENDGRID_FROM_EMAIL = process.env.VUE_APP_FROM_EMAIL || 'noreply@healthypathway.com'

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

// 使用 SendGrid API 发送邮件
export const sendEmailWithSendGrid = async (emailData, attachmentData = null) => {
  try {
    let attachments = []
    
    // 如果有附件数据，生成PDF并转换为base64
    if (attachmentData) {
      const pdf = generateAppointmentPDF(attachmentData)
      const pdfBlob = pdf.output('blob')
      const base64Data = await blobToBase64(pdfBlob)
      
      attachments.push({
        content: base64Data,
        filename: `appointment_${attachmentData.id}.pdf`,
        type: 'application/pdf',
        disposition: 'attachment'
      })
    }

    const payload = {
      personalizations: [
        {
          to: [
            {
              email: emailData.to,
              name: emailData.toName || 'Patient'
            }
          ],
          subject: emailData.subject
        }
      ],
      from: {
        email: SENDGRID_FROM_EMAIL,
        name: 'Healthy Pathway Team'
      },
      content: [
        {
          type: 'text/html',
          value: emailData.htmlContent || emailData.message
        }
      ],
      attachments: attachments
    }

    // 发送到后端 API
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    const result = await response.json()

    if (response.ok) {
      console.log('Email sent successfully via SendGrid')
      return { success: true, result }
    } else {
      throw new Error(result.error || 'Failed to send email')
    }
  } catch (error) {
    console.error('SendGrid email sending failed:', error)
    return { success: false, error: error.message }
  }
}

// 发送预约确认邮件
export const sendAppointmentConfirmation = async (appointmentData) => {
  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background-color: #3498db; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .appointment-details { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { background-color: #2c3e50; color: white; padding: 20px; text-align: center; }
          .highlight { color: #3498db; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Healthy Pathway</h1>
          <h2>Appointment Confirmation</h2>
        </div>
        
        <div class="content">
          <p>Dear <strong>${appointmentData.patientName}</strong>,</p>
          
          <p>Your appointment has been successfully confirmed! Please find the details below:</p>
          
          <div class="appointment-details">
            <h3>Appointment Details:</h3>
            <p><strong>Doctor:</strong> ${appointmentData.doctorName}</p>
            <p><strong>Date:</strong> ${appointmentData.date}</p>
            <p><strong>Time:</strong> ${appointmentData.time}</p>
            <p><strong>Type:</strong> ${appointmentData.type || 'General Consultation'}</p>
            <p><strong>Reference ID:</strong> <span class="highlight">${appointmentData.id}</span></p>
            ${appointmentData.language ? `<p><strong>Language:</strong> ${appointmentData.language}</p>` : ''}
          </div>
          
          <h3>Important Reminders:</h3>
          <ul>
            <li>Please arrive 15 minutes before your appointment time</li>
            <li>Bring a valid photo ID and insurance card</li>
            <li>Bring a list of your current medications</li>
            <li>Contact us at least 24 hours in advance if you need to reschedule</li>
            <li>Please wear a mask and follow all health protocols</li>
          </ul>
          
          <p><strong>Attached:</strong> You'll find a detailed PDF confirmation document attached to this email.</p>
          
          <p>If you have any questions or need to reschedule, please don't hesitate to contact us.</p>
          
          <p>Thank you for choosing Healthy Pathway!</p>
        </div>
        
        <div class="footer">
          <p><strong>Contact Information</strong></p>
          <p>Phone: +1 (555) 123-4567 | Email: info@healthypathway.com</p>
          <p>Website: www.healthypathway.com</p>
        </div>
      </body>
    </html>
  `

  const emailData = {
    to: appointmentData.patientEmail,
    toName: appointmentData.patientName,
    subject: 'Appointment Confirmation - Healthy Pathway',
    htmlContent: htmlContent
  }

  return await sendEmailWithSendGrid(emailData, appointmentData)
}

// 发送联系表单邮件
export const sendContactFormEmail = async (formData) => {
  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background-color: #e74c3c; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .form-data { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>New Contact Form Submission</h1>
        </div>
        
        <div class="content">
          <h3>Contact Form Details:</h3>
          
          <div class="form-data">
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${formData.subject}</p>
            <p><strong>Message:</strong></p>
            <p>${formData.message.replace(/\n/g, '<br>')}</p>
            ${formData.attachConfirmation ? '<p><strong>Note:</strong> User requested PDF confirmation attachment</p>' : ''}
          </div>
          
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Reply to:</strong> ${formData.email}</p>
        </div>
      </body>
    </html>
  `

  const emailData = {
    to: 'admin@healthypathway.com',
    toName: 'Admin Team',
    subject: `Contact Form: ${formData.subject}`,
    htmlContent: htmlContent
  }

  // 如果用户请求附件且是预约相关，生成示例PDF
  let attachmentData = null
  if (formData.attachConfirmation && formData.subject === '预约咨询') {
    attachmentData = {
      id: 'CONTACT_' + Date.now(),
      patientName: formData.name,
      patientEmail: formData.email,
      doctorName: 'To Be Assigned',
      date: 'To Be Scheduled',
      time: 'To Be Scheduled',
      type: 'Contact Form Inquiry'
    }
  }

  return await sendEmailWithSendGrid(emailData, attachmentData)
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

// 下载PDF文件
export const downloadAppointmentPDF = (appointmentData) => {
  const pdf = generateAppointmentPDF(appointmentData)
  pdf.save(`appointment_confirmation_${appointmentData.id}.pdf`)
}
