#!/bin/bash
echo "正在启动邮件服务器..."
cd "$(dirname "$0")"
nohup node simple-server.js > server.log 2>&1 &
echo $! > server.pid
echo "服务器已在后台启动，PID: $(cat server.pid)"
echo "查看日志: tail -f server.log"
echo "停止服务器: kill \$(cat server.pid)"
