#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Chrome插件打包脚本
生成用于Chrome Web Store或本地安装的zip文件
"""

import os
import zipfile
import shutil
from datetime import datetime

def create_package():
    """创建插件zip包"""
    # 插件目录
    extension_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 输出目录
    output_dir = os.path.join(extension_dir, 'dist')
    os.makedirs(output_dir, exist_ok=True)
    
    # 需要包含的文件和文件夹
    include_files = [
        'manifest.json',
        'background.js',
        'content.js',
        'popup.html',
        'popup.js',
        'icons/'
    ]
    
    # 需要排除的文件
    exclude_files = [
        'README.md',
        'generate_icons.py',
        'package.py',
        '.git',
        '.gitignore',
        'dist',
        '__pycache__',
        '*.pyc',
        '.DS_Store'
    ]
    
    # 读取版本号
    version = '1.2.0'
    try:
        with open(os.path.join(extension_dir, 'manifest.json'), 'r', encoding='utf-8') as f:
            import json
            manifest = json.load(f)
            version = manifest.get('version', '1.2.0')
    except:
        pass
    
    # 生成zip文件名
    zip_filename = f'deepseek-search-extension-v{version}-{datetime.now().strftime("%Y%m%d")}.zip'
    zip_path = os.path.join(output_dir, zip_filename)
    
    # 创建zip文件
    print(f'Creating package: {zip_filename}')
    print(f'Output directory: {output_dir}')
    print('-' * 50)
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        # 添加文件
        for item in include_files:
            item_path = os.path.join(extension_dir, item)
            
            if os.path.isfile(item_path):
                # 添加单个文件
                arcname = os.path.basename(item_path)
                zipf.write(item_path, arcname)
                print(f'Added file: {arcname}')
            elif os.path.isdir(item_path):
                # 添加文件夹
                for root, dirs, files in os.walk(item_path):
                    # 排除不需要的文件
                    dirs[:] = [d for d in dirs if d not in exclude_files]
                    
                    for file in files:
                        if file not in exclude_files and not file.endswith('.pyc'):
                            file_path = os.path.join(root, file)
                            arcname = os.path.relpath(file_path, extension_dir)
                            zipf.write(file_path, arcname)
                            print(f'Added file: {arcname}')
    
    # 计算文件大小
    file_size = os.path.getsize(zip_path)
    size_mb = file_size / (1024 * 1024)
    
    print('-' * 50)
    print('Package created successfully!')
    print(f'File: {zip_path}')
    print(f'Size: {size_mb:.2f} MB')
    print(f'\nInstallation instructions:')
    print(f'1. Open Chrome browser, visit chrome://extensions/')
    print(f'2. Enable "Developer mode"')
    print(f'3. Click "Load unpacked"')
    print(f'4. Select the extracted folder')
    print(f'\nOr upload to Chrome Web Store:')
    print(f'1. Visit https://chrome.google.com/webstore/devconsole')
    print(f'2. Upload this zip file')

if __name__ == '__main__':
    try:
        create_package()
    except Exception as e:
        print(f'Error: {e}')
        import traceback
        traceback.print_exc()