#!/usr/bin/env python3

import re

def analyze_all_tags(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 找到template部分
    template_match = re.search(r'<template>(.*?)</template>', content, re.DOTALL)
    if not template_match:
        print("No template found")
        return
    
    template_content = template_match.group(1)
    lines = template_content.split('\n')
    
    # 跟踪所有开启和关闭的标签
    tag_stack = []
    line_num = 1  # 从template开始计算
    
    # 自闭合标签列表
    self_closing_tags = {'br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'}
    
    for line in lines:
        line_num += 1
        
        # 查找所有标签
        # 自闭合标签: <tag ... />
        self_closing = re.findall(r'<(\w+)[^>]*\/>', line)
        
        # 开启标签: <tag ...> (不是自闭合，不是注释)
        opening_tags = re.findall(r'<(\w+)(?![^>]*\/>)[^>]*>', line)
        
        # 关闭标签: </tag>
        closing_tags = re.findall(r'</(\w+)>', line)
        
        # 处理自闭合标签
        for tag in self_closing:
            print(f"Line {line_num}: Self-closing <{tag}> (stack depth: {len(tag_stack)})")
        
        # 处理开启标签
        for tag in opening_tags:
            if tag.lower() not in self_closing_tags:
                tag_stack.append((tag, line_num))
                print(f"Line {line_num}: Opening <{tag}> (stack depth: {len(tag_stack)})")
        
        # 处理关闭标签
        for tag in closing_tags:
            if tag_stack and tag_stack[-1][0] == tag:
                opened_tag, opened_line = tag_stack.pop()
                print(f"Line {line_num}: Closing </{tag}> (opened at line {opened_line}, stack depth: {len(tag_stack)})")
            elif tag_stack:
                print(f"Line {line_num}: ERROR - Mismatched closing </{tag}>, expected </{tag_stack[-1][0]}>")
            else:
                print(f"Line {line_num}: ERROR - Closing </{tag}> without matching opening tag!")
    
    print(f"\nFinal analysis:")
    print(f"Unclosed tags: {len(tag_stack)}")
    if tag_stack:
        print("Unclosed tags:")
        for tag, line in tag_stack:
            print(f"  <{tag}> opened at line {line}")

if __name__ == "__main__":
    analyze_all_tags("/Users/monsteryuayu/Downloads/35523298_Yu Zhong_A2/HealthyPathway/src/pages/HealthMap.vue")
