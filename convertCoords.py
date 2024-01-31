import re

# the input strin

def convert(input_string):
    # input_string = '<path d={`m ${(100 / 400 * this.length)} ${(100 / 400 * this.length)} c ${(100 / 400 * this.length)} ${(100 / 400 * this.length)}, ${(110 / 400 * this.length)} ${(85 / 400 * this.length)}, ${(130 / 400 * this.length)} ${(72 / 400 * this.length)}`} fill="none" stroke={color} strokewidth="5"/>'
    
    # regular expression pattern to extract numerators
    # pattern = r'\$\{\((\d+) /'
    pattern = r'\$\{\((\d+\.\d+|\d+) /'

    # find all matches
    numerators = re.findall(pattern, input_string)
    
    i = 0
    print("[", end='')
    while i < len(numerators): 
        x_coord = numerators[i]
        y_coord = numerators[i + 1]
        print(f'{{"x": {x_coord}, "y": {y_coord}}},', end='')
        i += 2
    print("],")
    # print or process the numerators
lines = [
        '<Path d={`M ${(190 / 400 * this.length)} ${(190 / 400 * this.length)} C ${(190 / 400 * this.length)} ${(190 / 400 * this.length)}, ${(100 / 400 * this.length)} ${(190 / 400 * this.length)}, ${(100 / 400 * this.length)} ${(190 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/>', 
        '<Path d={`M ${(100 / 400 * this.length)} ${(190 / 400 * this.length)} C ${(83.5 / 400 * this.length)} ${(190 / 400 * this.length)}, ${(70 / 400 * this.length)} ${(203.5 / 400 * this.length)}, ${(70 / 400 * this.length)} ${(220 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/>', 
        '<Path d={`M ${(70 / 400 * this.length)} ${(220 / 400 * this.length)} C ${(70 / 400 * this.length)} ${(234.5 / 400 * this.length)}, ${(83.5 / 400 * this.length)} ${(250 / 400 * this.length)}, ${(100 / 400 * this.length)} ${(250 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/>', 
        '<Path d={`M ${(100 / 400 * this.length)} ${(250 / 400 * this.length)} C ${(100 / 400 * this.length)} ${(250 / 400 * this.length)}, ${(220 / 400 * this.length)} ${(250 / 400 * this.length)}, ${(220 / 400 * this.length)} ${(250 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/>', 
        '<Path d={`M ${(220 / 400 * this.length)} ${(250 / 400 * this.length)} C ${(225 / 400 * this.length)} ${(250 / 400 * this.length)}, ${(225 / 400 * this.length)} ${(240 / 400 * this.length)}, ${(225 / 400 * this.length)} ${(240 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/>', 
        '<Path d={`M ${(225 / 400 * this.length)} ${(240 / 400 * this.length)} C ${(226 / 400 * this.length)} ${(230 / 400 * this.length)}, ${(230 / 400 * this.length)} ${(230 / 400 * this.length)}, ${(230 / 400 * this.length)} ${(230 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/>', 
        '<Path d={`M ${(230 / 400 * this.length)} ${(230 / 400 * this.length)} C ${(230 / 400 * this.length)} ${(230 / 400 * this.length)}, ${(290 / 400 * this.length)} ${(230 / 400 * this.length)}, ${(290 / 400 * this.length)} ${(230 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/>', 
        '<Path d={`M ${(290 / 400 * this.length)} ${(230 / 400 * this.length)} C ${(295 / 400 * this.length)} ${(230 / 400 * this.length)}, ${(300 / 400 * this.length)} ${(234 / 400 * this.length)}, ${(304 / 400 * this.length)} ${(236 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/>', 
        '<Path d={`M ${(304 / 400 * this.length)} ${(236 / 400 * this.length)} C ${(304 / 400 * this.length)} ${(236 / 400 * this.length)}, ${(305 / 400 * this.length)} ${(236 / 400 * this.length)}, ${(305 / 400 * this.length)} ${(235 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/>', 
        '<Path d={`M ${(305 / 400 * this.length)} ${(235 / 400 * this.length)} C ${(305 / 400 * this.length)} ${(235 / 400 * this.length)}, ${(305 / 400 * this.length)} ${(186 / 400 * this.length)}, ${(305 / 400 * this.length)} ${(186 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/>', 
        '<Path d={`M ${(305 / 400 * this.length)} ${(186 / 400 * this.length)} C ${(305 / 400 * this.length)} ${(186 / 400 * this.length)}, ${(305 / 400 * this.length)} ${(185 / 400 * this.length)}, ${(304 / 400 * this.length)} ${(185 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/>', 
        '<Path d={`M ${(304 / 400 * this.length)} ${(185 / 400 * this.length)} C ${(304 / 400 * this.length)} ${(185 / 400 * this.length)}, ${(295 / 400 * this.length)} ${(190 / 400 * this.length)}, ${(290 / 400 * this.length)} ${(190 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/>', 
        '<Path d={`M ${(290 / 400 * this.length)} ${(190 / 400 * this.length)} C ${(290 / 400 * this.length)} ${(190 / 400 * this.length)}, ${(240 / 400 * this.length)} ${(190 / 400 * this.length)}, ${(240 / 400 * this.length)} ${(190 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/>', 
        '<Path d={`M ${(240 / 400 * this.length)} ${(190 / 400 * this.length)} C ${(240 / 400 * this.length)} ${(190 / 400 * this.length)}, ${(237 / 400 * this.length)} ${(190 / 400 * this.length)}, ${(235 / 400 * this.length)} ${(189 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/>', 
        '<Path d={`M ${(235 / 400 * this.length)} ${(189 / 400 * this.length)} C ${(235 / 400 * this.length)} ${(189 / 400 * this.length)}, ${(220 / 400 * this.length)} ${(176 / 400 * this.length)}, ${(220 / 400 * this.length)} ${(176 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/>', 
        '<Path d={`M ${(220 / 400 * this.length)} ${(176 / 400 * this.length)} C ${(220 / 400 * this.length)} ${(176 / 400 * this.length)}, ${(217 / 400 * this.length)} ${(175 / 400 * this.length)}, ${(215 / 400 * this.length)} ${(175 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/>', 
        '<Path d={`M ${(215 / 400 * this.length)} ${(175 / 400 * this.length)} C ${(215 / 400 * this.length)} ${(175 / 400 * this.length)}, ${(120 / 400 * this.length)} ${(175 / 400 * this.length)}, ${(120 / 400 * this.length)} ${(175 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/>', 
        ]

for line in lines:
    convert(line)
