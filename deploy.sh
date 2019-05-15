#!/bin/sh

handle = $1;
env = $2;

# 远程部署机 webhook
# 如果用远程机器部署的话，就要用到以下方法
# preHandle () {
#   git pull origin master
#   npm config set registry https://registry.npm.taobao.org/
#   npm install
#   npm run build-prod    
# }
# 清空dist目录
emptyRemoveDist () {
  if [$env == 'prod']
  then
    echo "[exec] remove remote:yourip folder"
    ssh root@yourip "rm -rf /www/jiketoutiao_admin/*"
  else
    echo "[exec] remove remote:yourip folder"
    ssh root@yourip "rm -rf /www/jiketoutiao_admin/*"
  fi
}
# 发送文件到正式服务器
transferFileToProServer () {
  echo "[exec] transfer file to product:"
}