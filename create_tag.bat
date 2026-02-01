@echo off
chcp 65001 >nul
echo ========================================
echo 创建Git标签
echo ========================================
echo.

set /p TAG_VERSION="请输入标签版本号 (例如: v1.2.1): "

if "%TAG_VERSION%"=="" (
    echo 错误: 版本号不能为空
    pause
    exit /b 1
)

set /p TAG_MESSAGE="请输入标签说明 (默认: Release %TAG_VERSION%): "

if "%TAG_MESSAGE%"=="" set TAG_MESSAGE=Release %TAG_VERSION%

echo.
echo 正在创建标签: %TAG_VERSION%
git tag -a %TAG_VERSION% -m "%TAG_MESSAGE%"

if errorlevel 1 (
    echo 错误: 创建标签失败
    pause
    exit /b 1
)

echo.
echo 标签创建成功！
echo.
set /p PUSH_TAG="是否推送到GitHub? (Y/N, 默认: Y): "

if /i "%PUSH_TAG%"=="N" (
    echo 标签已创建，但未推送
    echo 稍后可以使用以下命令推送:
    echo   git push origin %TAG_VERSION%
    pause
    exit /b 0
)

echo.
echo 正在推送到GitHub...
git push origin %TAG_VERSION%

if errorlevel 1 (
    echo.
    echo 推送失败！请检查网络连接和SSH配置
    pause
    exit /b 1
) else (
    echo.
    echo ========================================
    echo 标签推送成功！
    echo ========================================
    echo 标签: %TAG_VERSION%
    echo 说明: %TAG_MESSAGE%
    echo.
    echo 可以在GitHub上创建Release:
    echo https://github.com/eppen/deepseek-search-extension/releases/new
    echo.
)

pause