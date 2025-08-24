<template>
  <div class="contact-page">
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <!-- 主标题 -->
          <div class="text-center mb-5">
            <h1 class="display-5 text-primary">📧 联系我们</h1>
            <p class="lead">真实邮件服务 - 支持PDF附件发送</p>
            
            <!-- 服务器状态指示器 -->
            <div class="alert alert-info d-inline-block">
              <i class="bi bi-info-circle me-2"></i>
              <strong>当前状态：</strong>
              <span class="badge bg-warning ms-1">演示模式</span>
              <small class="d-block mt-1">
                邮件服务器未运行，系统将生成PDF并模拟发送
              </small>
            </div>
          </div>

          <!-- 联系表单 -->
          <div class="card shadow-lg">
            <div class="card-header bg-primary text-white">
              <h3 class="card-title mb-0">📝 发送消息</h3>
            </div>
            <div class="card-body p-4">
              <form @submit.prevent="submitForm">
                <div v-if="message.text" :class="`alert alert-${message.type}`">
                  <i :class="message.type === 'success' ? 'bi bi-check-circle' : 'bi bi-exclamation-triangle'"></i>
                  {{ message.text }}
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="name" class="form-label">
                      <i class="bi bi-person"></i> 姓名 *
                    </label>
                    <input
                      id="name"
                      v-model="form.name"
                      type="text"
                      class="form-control"
                      placeholder="请输入您的姓名"
                      required
                      :disabled="loading"
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="email" class="form-label">
                      <i class="bi bi-envelope"></i> 邮箱 *
                    </label>
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      class="form-control"
                      placeholder="请输入您的邮箱"
                      required
                      :disabled="loading"
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="phone" class="form-label">
                      <i class="bi bi-telephone"></i> 电话
                    </label>
                    <input
                      id="phone"
                      v-model="form.phone"
                      type="tel"
                      class="form-control"
                      placeholder="请输入您的电话"
                      :disabled="loading"
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="subject" class="form-label">
                      <i class="bi bi-chat-dots"></i> 主题 *
                    </label>
                    <select
                      id="subject"
                      v-model="form.subject"
                      class="form-select"
                      required
                      :disabled="loading"
                    >
                      <option value="">请选择主题</option>
                      <option value="appointment">📅 预约咨询</option>
                      <option value="medical">🏥 医疗问题</option>
                      <option value="insurance">💳 保险咨询</option>
                      <option value="technical">🔧 技术支持</option>
                      <option value="feedback">💬 意见反馈</option>
                      <option value="other">❓ 其他</option>
                    </select>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="message" class="form-label">
                    <i class="bi bi-chat-text"></i> 消息内容 *
                  </label>
                  <textarea
                    id="message"
                    v-model="form.message"
                    class="form-control"
                    rows="5"
                    placeholder="请输入您的消息内容..."
                    required
                    :disabled="loading"
                  ></textarea>
                  <small class="text-muted">{{ form.message.length }}/1000 字符</small>
                </div>

                <!-- 邮件功能演示区域 -->
                <div class="card mb-4 bg-light">
                  <div class="card-body">
                    <h6 class="card-title">
                      <i class="bi bi-envelope-plus"></i> 邮件服务演示
                    </h6>
                    <p class="card-text small mb-3">
                      这是一个集成了真实邮件API的系统演示。点击下方按钮可以：
                    </p>
                    <div class="row">
                      <div class="col-md-6 mb-2">
                        <button 
                          type="button" 
                          class="btn btn-outline-success btn-sm w-100"
                          @click="generatePDF"
                          :disabled="loading"
                        >
                          <i class="bi bi-file-pdf"></i> 生成PDF示例
                        </button>
                      </div>
                      <div class="col-md-6 mb-2">
                        <button 
                          type="button" 
                          class="btn btn-outline-info btn-sm w-100"
                          @click="sendDemoEmail"
                          :disabled="loading || !form.email"
                        >
                          <i class="bi bi-envelope-at"></i> 发送演示邮件
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="d-grid gap-2">
                  <button 
                    type="submit" 
                    class="btn btn-primary btn-lg"
                    :disabled="loading"
                  >
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ loading ? '发送中...' : '📤 发送消息' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- 联系信息卡片 -->
          <div class="card shadow mt-4">
            <div class="card-body">
              <h5 class="card-title">
                <i class="bi bi-geo-alt"></i> 联系信息
              </h5>
              <div class="row">
                <div class="col-md-6">
                  <p><strong>📧 邮箱:</strong> info@healthypathway.com</p>
                  <p><strong>📞 电话:</strong> +1 (555) 123-4567</p>
                </div>
                <div class="col-md-6">
                  <p><strong>🏥 地址:</strong> 123 Healthcare Avenue</p>
                  <p><strong>🕒 营业时间:</strong> 周一至周五 8:00-18:00</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 功能说明卡片 -->
          <div class="card shadow mt-4">
            <div class="card-body">
              <h5 class="card-title">
                <i class="bi bi-stars"></i> 邮件服务功能
              </h5>
              <div class="row">
                <div class="col-md-6">
                  <ul class="list-unstyled">
                    <li><i class="bi bi-check-circle text-success me-2"></i>真实邮件API服务</li>
                    <li><i class="bi bi-check-circle text-success me-2"></i>支持PDF附件</li>
                    <li><i class="bi bi-check-circle text-success me-2"></i>HTML格式邮件</li>
                  </ul>
                </div>
                <div class="col-md-6">
                  <ul class="list-unstyled">
                    <li><i class="bi bi-check-circle text-success me-2"></i>实时发送状态</li>
                    <li><i class="bi bi-check-circle text-success me-2"></i>安全传输</li>
                    <li><i class="bi bi-check-circle text-success me-2"></i>专业邮件模板</li>
                  </ul>
                </div>
              </div>
              <div class="alert alert-info mt-3">
                <strong><i class="bi bi-info-circle"></i> 技术说明:</strong> 
                此系统集成了 Node.js + Express 后端邮件服务器，支持 SendGrid 和 SMTP 邮件发送。
                为了演示目的，当前以模拟模式运行。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { sendContactForm, sendAppointmentConfirmation, generateAppointmentPDF, downloadAppointmentPDF } from '@/services/emailService'

// 表单数据
const form = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

// 加载状态
const loading = ref(false)

// 消息状态
const message = reactive({
  text: '',
  type: 'success'
})

// 显示消息
const showMessage = (text, type = 'success') => {
  message.text = text
  message.type = type
  
  // 5秒后自动隐藏消息
  setTimeout(() => {
    message.text = ''
  }, 5000)
}

// 提交表单 - 演示模式
const submitForm = async () => {
  loading.value = true
  
  try {
    // 尝试真实的邮件发送，如果失败则使用模拟
    try {
      const result = await sendContactForm(form)
      if (result.success) {
        if (result.demo) {
          showMessage('📧 ' + result.message, 'info')
        } else {
          showMessage('✅ 邮件发送成功！我们会尽快回复您。', 'success')
        }
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      // 后端不可用时的演示模式
      console.log('邮件服务器不可用，启用演示模式:', error.message)
      
      // 模拟发送延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      showMessage('📧 演示模式：表单已提交！实际部署时邮件会发送给管理员。邮件服务器需要配置后才能正常工作。', 'info')
    }
    
    // 重置表单
    Object.keys(form).forEach(key => {
      form[key] = ''
    })
  } catch (error) {
    console.error('发送消息失败:', error)
    showMessage(`❌ 发送失败: ${error.message}`, 'danger')
  } finally {
    loading.value = false
  }
}

// 生成PDF演示
const generatePDF = () => {
  try {
    const sampleData = {
      id: 'DEMO-' + Date.now(),
      patientName: form.name || '演示用户',
      patientEmail: form.email || 'demo@example.com',
      doctorName: 'Dr. 张医生',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      time: '上午 10:00',
      type: '常规咨询',
      language: '中文'
    }
    
    downloadAppointmentPDF(sampleData)
    showMessage('📄 PDF文件生成成功并已下载！', 'success')
  } catch (error) {
    console.error('PDF生成失败:', error)
    showMessage('❌ PDF生成失败: ' + error.message, 'danger')
  }
}

// 发送演示邮件
const sendDemoEmail = async () => {
  if (!form.email) {
    showMessage('⚠️ 请先输入您的邮箱地址', 'warning')
    return
  }

  loading.value = true
  
  try {
    const sampleAppointment = {
      id: 'DEMO-' + Date.now(),
      patientName: form.name || '演示用户',
      patientEmail: form.email,
      doctorName: 'Dr. 张医生',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      time: '上午 10:00',
      type: '演示咨询',
      language: '中文'
    }

    const result = await sendAppointmentConfirmation(sampleAppointment)
    if (result.success) {
      if (result.demo) {
        showMessage('📧 ' + result.message + '，PDF确认单已自动下载。', 'info')
      } else {
        showMessage('📧 演示邮件发送成功！请查收您的邮箱，邮件包含PDF附件。', 'success')
      }
    } else {
      throw new Error(result.error)
    }
  } catch (error) {
    console.error('发送演示邮件失败:', error)
    showMessage(`❌ 演示邮件发送失败: ${error.message}`, 'danger')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 0;
}

.card {
  border: none;
  border-radius: 15px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
}

.card-header {
  border-radius: 15px 15px 0 0 !important;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

.form-control:focus,
.form-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-outline-success, .btn-outline-info {
  border-radius: 8px;
  transition: all 0.3s;
}

.btn-outline-success:hover, .btn-outline-info:hover {
  transform: translateY(-1px);
}

.alert {
  border-radius: 10px;
  border: none;
  margin-bottom: 1rem;
}

.bg-light {
  background-color: #f8f9fa !important;
  border-radius: 10px;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

.display-5 {
  font-weight: 700;
}

.lead {
  color: #6c757d;
}

.bi {
  margin-right: 0.25rem;
}

.text-primary {
  color: #667eea !important;
}

@media (max-width: 768px) {
  .contact-page {
    padding: 20px 0;
  }
  
  .card-body {
    padding: 1.5rem;
  }
}
</style>
