#!/bin/bash
echo "🔍 实时监控邮件服务器日志..."
echo "📧 当您发送邮件时，会在这里显示后端接收的详细信息"
echo "⏹️  按 Ctrl+C 停止监控"
echo "=========================================="
cd "$(dirname "$0")"
tail -f server.log
