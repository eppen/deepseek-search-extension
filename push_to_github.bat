@echo off
chcp 65001 >nul
echo ========================================
echo DeepSeek Search Extension - GitHub推送
echo ========================================
echo.

set /p GITHUB_USERNAME="请输入您的GitHub用户名: "
set /p REPO_NAME="请输入仓库名称 (默认: deepseek-search-extension): "

if "%REPO_NAME%"=="" set REPO_NAME=deepseek-search-extension

echo.
echo 正在添加远程仓库...
git remote remove origin 2>nul
git remote add origin https://github.com/%GITHUB_USERNAME%/%REPO_NAME%.git

if errorlevel 1 (
    echo 错误: 无法添加远程仓库
    pause
    exit /b 1
)

echo.
echo 正在检查当前分支...
git branch --show-current > temp_branch.txt
set /p CURRENT_BRANCH=<temp_branch.txt
del temp_branch.txt

echo 当前分支: %CURRENT_BRANCH%
echo.
echo 正在推送到GitHub...
git push -u origin %CURRENT_BRANCH%

if errorlevel 1 (
    echo.
    echo ========================================
    echo 推送失败！
    echo ========================================
    echo 可能的原因：
    echo 1. GitHub仓库尚未创建
    echo 2. 认证失败（需要登录或配置SSH）
    echo 3. 仓库URL不正确
    echo.
    echo 请先访问 https://github.com/new 创建仓库
    echo 然后重新运行此脚本
    echo.
    pause
    exit /b 1
) else (
    echo.
    echo ========================================
    echo 推送成功！
    echo ========================================
    echo 仓库地址: https://github.com/%GITHUB_USERNAME%/%REPO_NAME%
    echo.
)

pause