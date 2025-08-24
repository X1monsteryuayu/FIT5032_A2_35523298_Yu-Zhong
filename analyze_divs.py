#!/usr/bin/env python3

import re

def analyze_divs(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 找到template部分
    template_match = re.search(r'<template>(.*?)</template>', content, re.DOTALL)
    if not template_match:
        print("No template found")
        return
    
    template_content = template_match.group(1)
    lines = template_content.split('\n')
    
    # 跟踪开启和关闭的div标签
    div_stack = []
    line_num = 1  # 从template开始计算
    
    for line in lines:
        line_num += 1
        
        # 查找所有div标签，包括自闭合的
        # 自闭合标签: <div ... />
        self_closing = re.findall(r'<div[^>]*\/>', line)
        
        # 开启标签: <div ...> (不是自闭合)
        opening_tags = re.findall(r'<div(?![^>]*\/>)[^>]*>', line)
        
        # 关闭标签: </div>
        closing_tags = re.findall(r'</div>', line)
        
        # 处理自闭合标签
        for _ in self_closing:
            print(f"Line {line_num}: Self-closing div (stack depth: {len(div_stack)})")
        
        # 处理开启标签
        for _ in opening_tags:
            div_stack.append(line_num)
            print(f"Line {line_num}: Opening div (stack depth: {len(div_stack)})")
        
        # 处理关闭标签
        for _ in closing_tags:
            if div_stack:
                opened_line = div_stack.pop()
                print(f"Line {line_num}: Closing div (opened at line {opened_line}, stack depth: {len(div_stack)})")
            else:
                print(f"Line {line_num}: ERROR - Closing div without matching opening tag!")
    
    print(f"\nFinal analysis:")
    print(f"Unclosed divs: {len(div_stack)}")
    if div_stack:
        print(f"Lines with unclosed divs: {div_stack}")

if __name__ == "__main__":
    analyze_divs("/Users/monsteryuayu/Downloads/35523298_Yu Zhong_A2/HealthyPathway/src/pages/HealthMap.vue")
