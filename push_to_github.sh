#!/bin/bash

echo "========================================"
echo "DeepSeek Search Extension - GitHub推送"
echo "========================================"
echo ""

read -p "请输入您的GitHub用户名: " GITHUB_USERNAME
read -p "请输入仓库名称 (默认: deepseek-search-extension): " REPO_NAME

if [ -z "$REPO_NAME" ]; then
    REPO_NAME="deepseek-search-extension"
fi

echo ""
echo "正在添加远程仓库..."
git remote remove origin 2>/dev/null
git remote add origin "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

if [ $? -ne 0 ]; then
    echo "错误: 无法添加远程仓库"
    exit 1
fi

echo ""
echo "正在检查当前分支..."
CURRENT_BRANCH=$(git branch --show-current)
echo "当前分支: $CURRENT_BRANCH"
echo ""
echo "正在推送到GitHub..."
git push -u origin "$CURRENT_BRANCH"

if [ $? -ne 0 ]; then
    echo ""
    echo "========================================"
    echo "推送失败！"
    echo "========================================"
    echo "可能的原因："
    echo "1. GitHub仓库尚未创建"
    echo "2. 认证失败（需要登录或配置SSH）"
    echo "3. 仓库URL不正确"
    echo ""
    echo "请先访问 https://github.com/new 创建仓库"
    echo "然后重新运行此脚本"
    echo ""
    exit 1
else
    echo ""
    echo "========================================"
    echo "推送成功！"
    echo "========================================"
    echo "仓库地址: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
    echo ""
fi