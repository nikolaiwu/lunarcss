#!/usr/bin/env python3
# =============================================================================
# LunarCSS - social card generator
# =============================================================================
# Writes og-image.svg next to this file, the source of the theme's
# public/og-image.png. Plain Python 3, no dependencies. See README.md.
# =============================================================================

import math, os
BG='#2a2c2f'; FG='#ece8e3'; MUTED='#878285'; ACCENT='#ff5623'; SUCCESS='#4ade80'
def n(v): return ('%.2f'%v).rstrip('0').rstrip('.')
def rect(x,y,w,h): return f'M{n(x)} {n(y)}h{n(w)}v{n(h)}h{n(-w)}Z'

def clip(poly,a,b,c):
    out=[]
    for i in range(len(poly)):
        P=poly[i]; Q=poly[(i+1)%len(poly)]
        pin=a*P[0]+b*P[1]<=c+1e-9; qin=a*Q[0]+b*Q[1]<=c+1e-9
        if pin: out.append(P)
        if pin!=qin:
            t=(c-a*P[0]-b*P[1])/(a*(Q[0]-P[0])+b*(Q[1]-P[1]))
            out.append((P[0]+t*(Q[0]-P[0]),P[1]+t*(Q[1]-P[1])))
    return out
def stripes(x0,y0,w,h,width=6,period=12):
    # striped mixin, 135deg: diagonal bands `width` thick, one every `period`
    P=period*math.sqrt(2); W=width*math.sqrt(2)
    box=[(x0,y0),(x0+w,y0),(x0+w,y0+h),(x0,y0+h)]
    d=''; k=math.floor((x0+y0)/P)-1
    while k*P < x0+y0+w+h:
        poly=clip(clip(box,-1,-1,-k*P),1,1,k*P+W)
        if len(poly)>=3: d+='M'+'L'.join(f'{n(x)} {n(y)}' for x,y in poly)+'Z'
        k+=1
    return d

o=[]; a=o.append
a(f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <!-- LunarCSS social card: theme geometry at about 1.6x, dark theme colors.
       Pixel-snapped for a crisp 1x export: whole-pixel coordinates, 2px lines
       drawn as filled rectangles, and the few stroked outlines placed so their
       stroke covers whole pixels. No <pattern> fills, so Figma imports every
       stripe, bar and dot as a vector. Fonts: Space Grotesk, Space Mono. -->
  <defs>
    <clipPath id="right-column"><rect x="624" y="0" width="488" height="630"/></clipPath>
  </defs>

  <rect id="background" width="1200" height="630" fill="{BG}"/>
''')

# Fieldset: sides and bottom, no top (the legend is the top)
L,R,T,B=56,1144,52,586
a(f'''  <g id="fieldset">
    <path id="fieldset-border" d="{rect(L,T,2,B-T)}{rect(R-2,T,2,B-T)}{rect(L,B-2,R-L,2)}" fill="{MUTED}"/>
    <g id="legend">
      <path id="legend-lead" d="{stripes(L+2,T,19,30)}" fill="{MUTED}"/>
      <text x="90" y="{T+21}" font-family="Space Mono" font-weight="700" font-size="20" letter-spacing="0.5" fill="{MUTED}">CLASSLESS CSS THEME</text>
      <path id="legend-rest" d="{stripes(341,T,R-2-341,30)}" fill="{MUTED}"/>
    </g>
  </g>
''')

# h1 with its one-bar mark
x0=88; top,h=134,62; bar,sl,cut=16,25,7
run=sl*cut/h
pts=[(x0+cut,top),(x0+bar,top),(x0+bar+sl-run,top+h-cut),(x0+bar+sl-cut,top+h),(x0+sl,top+h),(x0+run,top+cut)]
a('  <g id="h1">\n    <polygon id="h1-mark" points="'+' '.join(f'{n(x)},{n(y)}' for x,y in pts)+f'''" fill="{MUTED}"/>
    <text x="138" y="196" font-family="Space Grotesk" font-weight="700" font-size="88" letter-spacing="-2" fill="{FG}">LunarCSS</text>
  </g>
''')

# Paragraph with its left bracket (hangs 13px left of the text)
bx=75; pt,pb=236,318
a(f'''  <g id="paragraph">
    <path id="p-bracket" d="{rect(bx,pt,2,pb-pt)}{rect(bx,pt,13,2)}{rect(bx,pb-2,13,2)}" fill="{MUTED}"/>
    <text font-family="Space Grotesk" font-size="24" fill="{FG}">
      <tspan x="{x0}" y="264">Styles plain HTML. No classes, no build</tspan>
      <tspan x="{x0}" y="303">step: one stylesheet and you're in orbit.</tspan>
    </text>
  </g>
''')

# Dotted hr: 3px dots on a 6px grid
d=''
for j in range(4):
    for i in range(78):
        cx=x0+6*i+2.5; cy=338+6*j+2.5
        d+=f'M{n(cx-1.5)} {n(cy)}a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0'
a(f'  <path id="hr" d="{d}" fill="{MUTED}"/>\n')

# Ordered list
items=['Classless: every element, no classes','Light and dark from one set of tokens','Cascade layers, so your CSS always wins','Forms, cards, tables, dialogs and more']
a('  <g id="ordered-list">\n')
for i,t in enumerate(items):
    y=402+i*44
    a(f'''    <text x="146" y="{y}" text-anchor="end" font-family="Space Mono" font-size="18" fill="{MUTED}">{i+1:02d} /</text>
    <text x="152" y="{y}" font-family="Space Grotesk" font-size="22" fill="{FG}">{t}</text>
''')
a('  </g>\n')

# ---------------- Right column ----------------
rx,rw=624,488; RR=rx+rw
a('  <g id="controls">\n')
a(f'    <text id="input-label" x="{rx}" y="128" font-family="Space Grotesk" font-size="20" fill="{FG}">Landing site</text>\n')

# Text input, focused, grouped with the button: rounded left, square right.
# 2px stroke centred 1px in from the edges, so it covers whole pixels.
iy,ih,iw=142,68,338; IR=rx+iw; r=6
a(f'''    <g id="text-input">
      <path id="input-border" d="M{IR-1} {iy+1}H{rx+r}A{r-1} {r-1} 0 0 0 {rx+1} {iy+r}V{iy+ih-r}A{r-1} {r-1} 0 0 0 {rx+r} {iy+ih-1}H{IR-1}Z" fill="{BG}" stroke="{ACCENT}" stroke-width="2"/>
''')
# Brackets (focused size), inset 6px inside the border
bs=13; Lb,Tb,Rb,Bb=rx+2+6,iy+2+6,IR-2-6,iy+ih-2-6
br=(rect(Lb,Tb,bs,2)+rect(Lb,Tb,2,bs)+rect(Rb-bs,Tb,bs,2)+rect(Rb-2,Tb,2,bs)+
    rect(Lb,Bb-2,bs,2)+rect(Lb,Bb-bs,2,bs)+rect(Rb-bs,Bb-2,bs,2)+rect(Rb-2,Bb-bs,2,bs))
a(f'      <path id="input-brackets" d="{br}" fill="{MUTED}"/>\n')
# Tick ruler, slid in along the bottom (8 ticks, none on the edges)
inner=iw-4
tk=''.join(rect(round(rx+2+inner*i/9)-1,iy+ih-2-10,2,10) for i in range(1,9))
a(f'''      <path id="input-ticks" d="{tk}" fill="{MUTED}"/>
      <text x="645" y="186" font-family="Space Mono" font-size="26" fill="{FG}">moonbase.html</text>
      <rect id="caret" x="852" y="162" width="2" height="30" fill="{ACCENT}"/>
    </g>
''')
# Button: last in the group, so only the top-right cut
bx0=IR+3; c=19
a(f'''    <g id="button">
      <polygon points="{bx0},{iy} {RR-c},{iy} {RR},{iy+c} {RR},{iy+ih} {bx0},{iy+ih}" fill="{ACCENT}"/>
      <text x="{(bx0+RR)//2}" y="{iy+ih//2+8}" text-anchor="middle" font-family="Space Mono" font-weight="700" font-size="22" letter-spacing="0.5" fill="{FG}">LAUNCH</text>
    </g>
''')
# Checkbox, checked: the knob up top, in the accent
cy0,cw,ch=236,40,68
a(f'''    <g id="checkbox">
      <rect x="{rx+1}" y="{cy0+1}" width="{cw-2}" height="{ch-2}" rx="{r-1}" fill="none" stroke="{FG}" stroke-width="2"/>
      <rect id="checkbox-knob" x="{rx+8}" y="{cy0+8}" width="{cw-16}" height="{cw-16}" fill="{ACCENT}"/>
      <text x="{rx+cw+13}" y="{cy0+ch//2+8}" font-family="Space Grotesk" font-size="22" fill="{FG}">Dark side of the moon</text>
    </g>
''')
# Meter, optimum: striped fill (3px bars every 6px) inside the track, ruler below
my,bh=352,44
fx,fy,fh=rx+5,my+5,bh-10; fw=round((rw-10)*0.78)
bars=''.join(rect(x,fy,min(3,fx+fw-x),fh) for x in range(fx,fx+fw,6))
mt=''.join(rect(round(rx+rw*i/9)-1,my+ch-10,2,10) for i in range(1,9))
a(f'''    <g id="meter">
      <text x="{rx}" y="{my-12}" font-family="Space Grotesk" font-size="20" fill="{FG}">Hull integrity</text>
      <text x="{RR}" y="{my-12}" text-anchor="end" font-family="Space Mono" font-size="18" fill="{MUTED}">78%</text>
      <rect id="meter-track" x="{rx+1}" y="{my+1}" width="{rw-2}" height="{bh-2}" fill="{BG}" stroke="{FG}" stroke-width="2"/>
      <path id="meter-fill" d="{bars}" fill="{SUCCESS}"/>
      <path id="meter-ruler" d="{mt}" fill="{MUTED}"/>
    </g>
''')
# Table header: heavy top rule, per-cell rulers with a tall start tick,
# the fourth column cut off at the column edge
ty,rowb,cellw=452,522,150
a(f'''    <g id="table-header" clip-path="url(#right-column)">
      <path id="table-rules" d="{rect(rx,ty,rw,4)}{rect(rx,rowb,rw,2)}" fill="{FG}"/>
''')
starts=''; ticks=''
for i,t in enumerate(['UNIT','STATUS','LOAD','ETA']):
    cx=rx+i*cellw
    starts+=rect(cx,rowb-50,2,50)
    ticks+=''.join(rect(round(cx+cellw*j/5)-1,rowb-10,2,10) for j in range(1,5))
    a(f'      <text x="{cx+19}" y="{ty+42}" font-family="Space Mono" font-size="19" letter-spacing="0.5" fill="{MUTED}">{t}</text>\n')
a(f'''      <path id="table-column-starts" d="{starts}" fill="{FG}"/>
      <path id="table-ticks" d="{ticks}" fill="{MUTED}"/>
    </g>
  </g>

  <text id="url" x="{R}" y="614" text-anchor="end" font-family="Space Mono" font-size="16" letter-spacing="0.4" fill="{MUTED}">nikolaiwu.github.io/lunarcss</text>
</svg>
''')
open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "og-image.svg"), "w").write(''.join(o))
