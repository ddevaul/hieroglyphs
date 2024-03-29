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
        '<Path d={`M ${(82 / 400 * this.length)} ${(158 / 400 * this.length)} C ${(83 / 400 * this.length)} ${(175 / 400 * this.length)}, ${(90 / 400 * this.length)} ${(175 / 400 * this.length)}, ${(90 / 400 * this.length)} ${(175 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/>', 
        '<Path d={`M ${(87 / 400 * this.length)} ${(175 / 400 * this.length)} C ${(87 / 400 * this.length)} ${(175 / 400 * this.length)}, ${(230 / 400 * this.length)} ${(180 / 400 * this.length)}, ${(230 / 400 * this.length)} ${(180 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/>', 
        '<Path d={`M ${(230 / 400 * this.length)} ${(180 / 400 * this.length)} C ${(270 / 400 * this.length)} ${(185 / 400 * this.length)}, ${(280 / 400 * this.length)} ${(210 / 400 * this.length)}, ${(280 / 400 * this.length)} ${(270 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/>', 

 ]

for line in lines:
    convert(line)
