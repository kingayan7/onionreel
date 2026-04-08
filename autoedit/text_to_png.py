from PIL import Image, ImageDraw, ImageFont
import sys, os

# usage: python3 text_to_png.py out.png "Line1" "Line2" --w 1080 --h 1920 --bg "#0B0B0B" --fg "#FFFFFF" --accent "#E17B3B"

def hex_to_rgb(h):
    h=h.lstrip('#')
    return tuple(int(h[i:i+2],16) for i in (0,2,4))

def main():
    if len(sys.argv) < 3:
        print('usage: text_to_png.py out.png line1 [line2] ...')
        sys.exit(2)

    out = sys.argv[1]
    # crude arg parsing
    args = sys.argv[2:]
    lines=[]
    w,h=1080,1920
    bg='#0B0B0B'
    fg='#FFFFFF'
    accent='#E17B3B'
    while args:
        a=args.pop(0)
        if a=='--w': w=int(args.pop(0))
        elif a=='--h': h=int(args.pop(0))
        elif a=='--bg': bg=args.pop(0)
        elif a=='--fg': fg=args.pop(0)
        elif a=='--accent': accent=args.pop(0)
        else:
            lines.append(a)

    img = Image.new('RGBA',(w,h),hex_to_rgb(bg)+(255,))
    d = ImageDraw.Draw(img)

    # Try common macOS fonts
    font_paths = [
        '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
        '/System/Library/Fonts/Supplemental/Arial.ttf'
    ]
    font=None
    for fp in font_paths:
        if os.path.exists(fp):
            font=ImageFont.truetype(fp, 96)
            break
    if font is None:
        font=ImageFont.load_default()

    # Draw: first line white, second line accent
    y = int(h*0.40)
    for i,line in enumerate(lines[:2]):
        col = fg if i==0 else accent
        f = font if i==0 else ImageFont.truetype(font_paths[0], 56) if os.path.exists(font_paths[0]) else font
        bbox = d.textbbox((0,0), line, font=f)
        tw,th = bbox[2]-bbox[0], bbox[3]-bbox[1]
        x = (w - tw)//2
        d.text((x,y), line, font=f, fill=hex_to_rgb(col)+(255,))
        y += th + 24

    os.makedirs(os.path.dirname(out), exist_ok=True)
    img.save(out)

if __name__=='__main__':
    main()
