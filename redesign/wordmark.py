# The VibeForce wordmark: Barlow Condensed ExtraBold outlines, set tight by hand, cut through by one band (the
# reflective-tape gap of a hi-vis vest) so the letters read as stencilled signage.
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
f=TTFont(sys.argv[2] if len(sys.argv) > 2 else 'BarlowCondensed-ExtraBold.ttf'); gs=f.getGlyphSet(); cmap=f.getBestCmap(); hmtx=f['hmtx']
upm=f['head'].unitsPerEm; cap=f['OS/2'].sCapHeight
word="VIBEFORCE"
# custom kerning in font units (negative tightens): pairs tuned by eye at 40px and 400px
kern={('V','I'):-10,('I','B'):-6,('B','E'):-14,('E','F'):-14,('F','O'):-30,('O','R'):-12,('R','C'):-22,('C','E'):-12}
x=0; paths=[]
for i,ch in enumerate(word):
    g=cmap[ord(ch)]
    pen=SVGPathPen(gs)
    tp=TransformPen(pen,(1,0,0,-1,x,cap))
    gs[g].draw(tp)
    paths.append(pen.getCommands())
    adv=hmtx[g][0]
    nxt=word[i+1] if i+1<len(word) else None
    x+=adv+(kern.get((ch,nxt),0) if nxt else 0) - 8
w=x
cut_y=round(cap*0.42); cut_h=round(cap*0.075)
d=" ".join(paths)
svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {cap}" role="img" aria-labelledby="t"><title id="t">VibeForce</title><defs><mask id="cut"><rect width="{w}" height="{cap}" fill="#fff"/><rect y="{cut_y}" width="{w}" height="{cut_h}" fill="#000"/></mask></defs><path d="{d}" fill="currentColor" mask="url(#cut)"/></svg>'''
open(sys.argv[1],'w').write(svg)
print(w,cap,cut_y,cut_h)
