# DeepSeek Search Chrome Extension

一个功能强大的Chrome浏览器插件，参考 [askanywhere](https://github.com/sharmt1411/askanywhere) 项目设计理念，实现多种方式使用DeepSeek AI助手。

## ✨ 功能特点

### 右键菜单功能
- **🔍 搜索** - 直接搜索选中文本
- **🌐 翻译** - 翻译选中文本
- **💡 解释** - 解释选中文本的含义
- **💻 解释代码** - 专门用于解释代码
- **✨ 改进文本** - 改进和优化文本内容

### 快捷键支持
- **Alt+D** - 快速搜索当前选中的文本（无需右键）

### 插件图标菜单
- 点击插件图标打开快速操作面板
- 支持手动输入文本进行搜索
- 自动获取当前页面选中的文本

## 安装方法

1. 打开Chrome浏览器，进入 `chrome://extensions/`
2. 开启右上角的"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择 `deepseek-search-extension` 文件夹
5. 插件安装完成

## 使用方法

### 方式一：右键菜单
1. 在网页上选中任意文本
2. 点击鼠标右键
3. 选择"DeepSeek"菜单下的相应操作（搜索/翻译/解释等）
4. 浏览器会在新标签页中打开DeepSeek并显示结果

### 方式二：快捷键
1. 在网页上选中任意文本
2. 按下 **Alt+D** 快捷键
3. 自动打开DeepSeek搜索选中文本

### 方式三：插件图标
1. 点击浏览器工具栏上的插件图标
2. 在弹出的面板中：
   - 点击快速操作按钮（搜索/翻译/解释）
   - 或手动输入文本后点击搜索按钮
3. 自动打开DeepSeek进行相应操作

## 文件结构

```
deepseek-search-extension/
├── manifest.json      # 插件配置文件
├── background.js      # 背景脚本，处理右键菜单和跳转逻辑
├── content.js         # 内容脚本，在DeepSeek页面自动填充输入框
├── popup.html         # 插件图标弹窗界面
├── popup.js           # 弹窗脚本逻辑
├── generate_icons.py  # 图标生成脚本（可选）
├── icons/            # 图标文件夹
│   ├── icon16.png    # 16x16 图标
│   ├── icon48.png    # 48x48 图标
│   ├── icon128.png   # 128x128 图标
│   └── README.md     # 图标说明
└── README.md         # 使用说明
```

## 注意事项

- ✅ 图标文件已生成（icon16.png, icon48.png, icon128.png）
- 如需重新生成图标，可运行 `python generate_icons.py`（需要安装Pillow库：`pip install Pillow`）
- 插件基于Manifest V3开发，适用于Chrome 88+版本

## 技术说明

插件使用Chrome Extension API：
- `contextMenus` API - 创建右键菜单和子菜单
- `tabs` API - 在新标签页中打开URL
- `runtime` API - 监听插件安装事件和消息传递
- `commands` API - 添加快捷键支持
- `scripting` API - 获取页面选中的文本
- `action` API - 插件图标点击弹窗
- `content_scripts` API - 在DeepSeek页面注入脚本自动填充输入框

### 工作原理

由于DeepSeek网页版不支持URL参数传递文本，插件采用以下方式：
1. 打开DeepSeek页面
2. 通过content script自动检测并填充输入框
3. 如果自动填充失败，会将文本复制到剪贴板，用户可以手动粘贴（Ctrl+V）

## 参考项目

本插件参考了 [askanywhere](https://github.com/sharmt1411/askanywhere) 项目的设计理念，提供了类似的划词AI助手功能，适配Chrome浏览器环境。

## 📦 打包插件

### 快速打包

运行打包脚本：

```bash
python package.py
```

打包后的zip文件会生成在 `dist/` 目录中，文件名格式：`deepseek-search-extension-v{版本号}-{日期}.zip`

### 打包方式

1. **Python脚本打包**（推荐）- 运行 `package.py`
2. **手动打包** - 压缩所有必需文件为zip格式
3. **Chrome打包** - 在 `chrome://extensions/` 中使用"打包扩展程序"

详细说明请查看 [PACKAGE.md](PACKAGE.md)

## 更新日志

### v1.2.0
- 🔧 修复URL参数无法传递的问题
- ✨ 使用content script自动填充输入框
- ✨ 添加剪贴板备用方案（自动填充失败时）
- 🐛 改进输入框检测逻辑，支持动态加载的页面

### v1.1.0
- ✨ 新增多种操作模式（搜索/翻译/解释/代码/改进）
- ✨ 添加快捷键支持（Alt+D）
- ✨ 新增插件图标弹窗界面
- 🎨 优化用户体验和界面设计

### v1.0.0
- 🎉 初始版本发布
- ✅ 基础右键菜单功能
- ✅ 图标文件生成