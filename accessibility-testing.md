# 无障碍测试脚本

## 自动化测试工具

### 1. 安装axe-core进行无障碍测试
```bash
npm install --save-dev @axe-core/vue
```

### 2. WAVE工具测试
访问 https://wave.webaim.org/ 输入应用URL进行测试

### 3. 键盘导航测试清单
- [ ] 使用Tab键可以导航到所有交互元素
- [ ] 使用Shift+Tab可以反向导航
- [ ] 焦点指示器清晰可见
- [ ] 没有焦点陷阱
- [ ] 可以使用Enter和Space激活按钮
- [ ] 可以使用Esc关闭模态框

### 4. 屏幕阅读器测试
使用NVDA (Windows) 或 VoiceOver (Mac) 测试：
- [ ] 页面结构清晰（标题层次）
- [ ] 表单标签正确关联
- [ ] 图片有替代文本
- [ ] 链接有描述性文本
- [ ] 错误消息可以被读取

### 5. 颜色对比度测试
使用工具检查：
- [ ] 文本对比度至少4.5:1 (正常文本)
- [ ] 大文本对比度至少3:1
- [ ] 非文本元素对比度至少3:1

### 6. 响应式测试
- [ ] 在不同设备尺寸下可用
- [ ] 缩放到200%仍可用
- [ ] 支持横屏和竖屏

### 7. 移动设备无障碍
- [ ] 触摸目标至少44px
- [ ] 支持手势导航
- [ ] 屏幕阅读器兼容

## 测试checklist
运行以下测试确保无障碍合规：

```javascript
// 在浏览器控制台运行
// 检查页面无障碍问题
axe.run().then(results => {
  if (results.violations.length === 0) {
    console.log('✅ 没有发现无障碍问题');
  } else {
    console.log('❌ 发现无障碍问题:', results.violations);
  }
});
```
