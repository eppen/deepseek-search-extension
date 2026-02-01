# GitHub 推送指南

代码已经准备好推送到GitHub。请按照以下步骤操作：

## 步骤1：在GitHub上创建仓库

1. 访问 [GitHub](https://github.com)
2. 点击右上角的 **+** 号，选择 **New repository**
3. 填写仓库信息：
   - **Repository name**: `deepseek-search-extension`（或您喜欢的名称）
   - **Description**: `Chrome浏览器插件 - 右键使用DeepSeek搜索选中文本`
   - **Visibility**: 选择 Public（公开）或 Private（私有）
   - **不要**勾选 "Initialize this repository with a README"（我们已经有了）
4. 点击 **Create repository**

## 步骤2：添加远程仓库并推送

在命令行中执行以下命令（将 `YOUR_USERNAME` 替换为您的GitHub用户名）：

```bash
cd d:\DevelopFolder\Dev2026\deepseek-search-extension

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/deepseek-search-extension.git

# 推送代码到GitHub
git push -u origin master
```

或者如果您的仓库使用 `main` 分支：

```bash
# 重命名分支为main（如果需要）
git branch -M main

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/deepseek-search-extension.git

# 推送代码
git push -u origin main
```

## 步骤3：验证

推送成功后，访问您的GitHub仓库页面，应该能看到所有文件。

## 后续更新

当您修改代码后，使用以下命令更新GitHub：

```bash
# 添加修改的文件
git add .

# 提交更改
git commit -m "描述您的更改"

# 推送到GitHub
git push
```

## 使用SSH（可选）

如果您配置了SSH密钥，可以使用SSH URL：

```bash
git remote add origin git@github.com:YOUR_USERNAME/deepseek-search-extension.git
```

## 仓库信息建议

### README徽章（可选）

您可以在README.md中添加GitHub徽章：

```markdown
![GitHub release](https://img.shields.io/github/release/YOUR_USERNAME/deepseek-search-extension)
![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/deepseek-search-extension)
![GitHub forks](https://img.shields.io/github/forks/YOUR_USERNAME/deepseek-search-extension)
```

### 仓库主题标签

在GitHub仓库设置中添加主题标签，便于搜索：
- `chrome-extension`
- `deepseek`
- `browser-extension`
- `javascript`
- `ai-assistant`

### 发布Release

1. 在GitHub仓库页面，点击 **Releases** → **Create a new release**
2. 填写版本号：`v1.2.0`
3. 标题：`DeepSeek Search Extension v1.2.0`
4. 描述：可以从README中复制更新日志
5. 上传打包好的zip文件：`dist/deepseek-search-extension-v1.2.0-20260201.zip`
6. 点击 **Publish release**

## 许可证

建议添加LICENSE文件。常用选择：
- MIT License（最常用，宽松）
- Apache License 2.0
- GPL-3.0

可以在GitHub创建仓库时选择，或使用以下命令添加MIT License：

```bash
# 创建LICENSE文件（MIT）
echo "MIT License" > LICENSE
git add LICENSE
git commit -m "Add MIT License"
git push
```

## 问题排查

### 如果推送失败

1. **检查远程仓库URL**：
   ```bash
   git remote -v
   ```

2. **重新设置远程仓库**：
   ```bash
   git remote remove origin
   git remote add origin https://github.com/YOUR_USERNAME/deepseek-search-extension.git
   ```

3. **检查认证**：确保已登录GitHub，或配置了SSH密钥

### 如果遇到冲突

```bash
# 拉取远程更改
git pull origin master

# 解决冲突后
git add .
git commit -m "Merge conflicts resolved"
git push
```