# 插件打包说明

## 方法一：使用Python脚本打包（推荐）

运行打包脚本：

```bash
python package.py
```

脚本会自动：
- 创建 `dist/` 目录
- 生成带版本号和日期的zip文件
- 排除不需要的文件（README.md, generate_icons.py等）

打包后的文件位于 `dist/` 目录中。

## 方法二：手动打包

### 1. 准备文件

确保以下文件存在：
- `manifest.json`
- `background.js`
- `content.js`
- `popup.html`
- `popup.js`
- `icons/` 文件夹（包含所有图标文件）

### 2. 创建zip文件

**Windows:**
1. 选中所有必需文件（不包括README.md、generate_icons.py等）
2. 右键 → 发送到 → 压缩(zipped)文件夹
3. 重命名为 `deepseek-search-extension.zip`

**macOS/Linux:**
```bash
cd deepseek-search-extension
zip -r deepseek-search-extension.zip \
  manifest.json \
  background.js \
  content.js \
  popup.html \
  popup.js \
  icons/ \
  -x "*.git*" "*.md" "*.py" "__pycache__/*"
```

## 方法三：在Chrome中打包（生成.crx文件）

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启"开发者模式"
4. 点击"打包扩展程序"
5. 选择插件目录：`d:\DevelopFolder\Dev2026\deepseek-search-extension`
6. 选择私钥文件（首次打包留空，会自动生成）
7. 点击"打包扩展程序"
8. 生成 `.crx` 文件和 `.pem` 私钥文件

**注意：** `.pem` 文件是私钥，请妥善保管，用于后续更新插件。

## 安装打包后的插件

### 方式一：加载已解压的扩展程序
1. 解压zip文件
2. 打开 `chrome://extensions/`
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择解压后的文件夹

### 方式二：安装.crx文件
1. 打开 `chrome://extensions/`
2. 开启"开发者模式"
3. 将 `.crx` 文件拖拽到扩展程序页面

### 方式三：上传到Chrome Web Store
1. 访问 [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. 创建新项目
3. 上传zip文件
4. 填写商店信息
5. 提交审核

## 文件清单

打包时应包含的文件：
- ✅ manifest.json
- ✅ background.js
- ✅ content.js
- ✅ popup.html
- ✅ popup.js
- ✅ icons/icon16.png
- ✅ icons/icon48.png
- ✅ icons/icon128.png

不应包含的文件：
- ❌ README.md
- ❌ generate_icons.py
- ❌ package.py
- ❌ .git/
- ❌ dist/
- ❌ __pycache__/