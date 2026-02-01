#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成Chrome插件图标
需要安装PIL库: pip install Pillow
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, output_path):
    """创建指定尺寸的图标"""
    # 创建图像，使用蓝色渐变背景
    img = Image.new('RGB', (size, size), color='#1E88E5')
    draw = ImageDraw.Draw(img)
    
    # 绘制渐变背景（简单的蓝色到深蓝色）
    for i in range(size):
        ratio = i / size
        r = int(30 + (30 - 10) * ratio)
        g = int(136 + (136 - 100) * ratio)
        b = int(229 + (229 - 200) * ratio)
        draw.rectangle([(0, i), (size, i+1)], fill=(r, g, b))
    
    # 绘制放大镜图标
    center_x, center_y = size // 2, size // 2
    radius = int(size * 0.25)
    
    # 放大镜圆形部分
    circle_left = center_x - radius
    circle_top = center_y - radius
    circle_right = center_x + radius
    circle_bottom = center_y + radius
    
    # 绘制放大镜的圆形（白色边框）
    border_width = max(2, size // 16)
    draw.ellipse([circle_left, circle_top, circle_right, circle_bottom], 
                 outline='white', width=border_width)
    
    # 绘制放大镜的手柄（从右下角延伸）
    handle_length = int(size * 0.3)
    handle_start_x = center_x + radius - border_width
    handle_start_y = center_y + radius - border_width
    handle_end_x = handle_start_x + handle_length
    handle_end_y = handle_start_y + handle_length
    
    draw.line([(handle_start_x, handle_start_y), (handle_end_x, handle_end_y)], 
              fill='white', width=border_width)
    
    # 保存图像
    img.save(output_path, 'PNG')
    print(f"Generated: {output_path} ({size}x{size})")

def main():
    """主函数"""
    # 确保icons目录存在
    icons_dir = os.path.join(os.path.dirname(__file__), 'icons')
    os.makedirs(icons_dir, exist_ok=True)
    
    # 生成三个尺寸的图标
    sizes = [16, 48, 128]
    for size in sizes:
        output_path = os.path.join(icons_dir, f'icon{size}.png')
        create_icon(size, output_path)
    
    print("\nAll icons generated successfully!")

if __name__ == '__main__':
    main()