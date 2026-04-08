from PIL import Image, ImageDraw, ImageFont
import sys, os

def hex_to_rgb(h):
    h=h.lstrip('#')
    return tuple(int(h[i:i+2],16) for i in (0,2,4))

def load_font(size, bold=True):
    paths=[
        '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
        '/System/Library/Fonts/Supplemental/Arial.ttf'
    ]
    for p in paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

def main():
    # usage: python3 endcard_to_png.py out.png --w 1080 --h 1920 --bg '#0B0B0B' --fg '#FFFFFF' --accent '#E17B3B'
    out = sys.argv[1] if len(sys.argv)>1 else None
    if not out:
        print('usage: endcard_to_png.py out.png [--w 1080 --h 1920 --bg #.. --fg #.. --accent #..]')
        sys.exit(2)

    args=sys.argv[2:]
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

    img = Image.new('RGBA',(w,h),hex_to_rgb(bg)+(255,))
    d = ImageDraw.Draw(img)

    f1=load_font(96)
    f2=load_font(56)

    line1='MaxContrax'
    line2='Start Free at MaxContrax.com'

    bbox1=d.textbbox((0,0), line1, font=f1)
    bbox2=d.textbbox((0,0), line2, font=f2)
    tw=max(bbox1[2]-bbox1[0], bbox2[2]-bbox2[0])
    th=(bbox1[3]-bbox1[1]) + (bbox2[3]-bbox2[1]) + 28

    x=(w-tw)//2
    y=int(h*0.42) - th//2

    d.text(((w-(bbox1[2]-bbox1[0]))//2,y), line1, font=f1, fill=hex_to_rgb(fg)+(255,))
    y += (bbox1[3]-bbox1[1]) + 28
    d.text(((w-(bbox2[2]-bbox2[0]))//2,y), line2, font=f2, fill=hex_to_rgb(accent)+(255,))

    os.makedirs(os.path.dirname(out), exist_ok=True)
    img.save(out)

if __name__=='__main__':
    main()
