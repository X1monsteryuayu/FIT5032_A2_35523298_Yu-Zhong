#!/usr/bin/env python3

def analyze_divs_simple(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    stack = []
    template_started = False
    template_ended = False
    
    for i, line in enumerate(lines, 1):
        stripped = line.strip()
        
        if '<template>' in stripped:
            template_started = True
            continue
        
        if '</template>' in stripped:
            template_ended = True
            break
            
        if not template_started or template_ended:
            continue
            
        # 计算开启和闭合的div标签
        open_divs = stripped.count('<div')
        close_divs = stripped.count('</div>')
        
        if open_divs > 0 or close_divs > 0:
            balance = open_divs - close_divs
            if balance > 0:
                for _ in range(balance):
                    stack.append(i)
                print(f"Line {i}: +{balance} divs (stack: {len(stack)})")
            elif balance < 0:
                for _ in range(-balance):
                    if stack:
                        opened_line = stack.pop()
                        print(f"Line {i}: -{-balance} divs, closed div from line {opened_line} (stack: {len(stack)})")
                    else:
                        print(f"Line {i}: ERROR - Closing div without opening!")
    
    print(f"\nTemplate ended at line {i}")
    print(f"Unclosed divs: {len(stack)}")
    if stack:
        print(f"Lines with unclosed divs: {stack}")

if __name__ == "__main__":
    analyze_divs_simple("/Users/monsteryuayu/Downloads/35523298_Yu Zhong_A2/HealthyPathway/src/pages/HealthMap.vue")
