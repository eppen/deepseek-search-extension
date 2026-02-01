#!/bin/bash

echo "========================================"
echo "创建Git标签"
echo "========================================"
echo ""

read -p "请输入标签版本号 (例如: v1.2.1): " TAG_VERSION

if [ -z "$TAG_VERSION" ]; then
    echo "错误: 版本号不能为空"
    exit 1
fi

read -p "请输入标签说明 (默认: Release $TAG_VERSION): " TAG_MESSAGE

if [ -z "$TAG_MESSAGE" ]; then
    TAG_MESSAGE="Release $TAG_VERSION"
fi

echo ""
echo "正在创建标签: $TAG_VERSION"
git tag -a "$TAG_VERSION" -m "$TAG_MESSAGE"

if [ $? -ne 0 ]; then
    echo "错误: 创建标签失败"
    exit 1
fi

echo ""
echo "标签创建成功！"
echo ""
read -p "是否推送到GitHub? (Y/N, 默认: Y): " PUSH_TAG

if [[ "$PUSH_TAG" =~ ^[Nn]$ ]]; then
    echo "标签已创建，但未推送"
    echo "稍后可以使用以下命令推送:"
    echo "  git push origin $TAG_VERSION"
    exit 0
fi

echo ""
echo "正在推送到GitHub..."
git push origin "$TAG_VERSION"

if [ $? -ne 0 ]; then
    echo ""
    echo "推送失败！请检查网络连接和SSH配置"
    exit 1
else
    echo ""
    echo "========================================"
    echo "标签推送成功！"
    echo "========================================"
    echo "标签: $TAG_VERSION"
    echo "说明: $TAG_MESSAGE"
    echo ""
    echo "可以在GitHub上创建Release:"
    echo "https://github.com/eppen/deepseek-search-extension/releases/new"
    echo ""
fi