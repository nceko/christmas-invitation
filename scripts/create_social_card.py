# Social preview 1200x630 for Crimson Christmas V4. Requires Pillow.
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math, random
from pathlib import Path
W,H=1200,630
im=Image.new('RGB',(W,H));px=im.load()
for y in range(H):
 for x in range(W):
  t=x/W
  rr=115+int(40*math.exp(-((t-.65)/.33)**2))
  gg=15+int(13*t);bb=41+int(10*(1-t))
  glow=math.exp(-(((x-950)/390)**2+((y-330)/370)**2))
  px[x,y]=(min(255,rr+int(25*glow)),gg+int(12*glow),bb+int(6*glow))
d=ImageDraw.Draw(im,'RGBA')
d.rounded_rectangle([25,25,W-25,H-25],radius=18,outline=(250,214,142,180),width=3)
d.rounded_rectangle([38,38,W-38,H-38],radius=16,outline=(250,214,142,75),width=1)
# garland evergreen right, decorative branches
for side in [0,1]:
 ox=0 if side==0 else 1180
 for i in range(12):
  y=10+i*22
  ex=ox+(-1 if side else 1)*(75+i*11)
  d.line([ox,y,ex,y+92],fill=(11,86,56,210),width=6)
  for j in range(7):
   m=j/7
   xx=ox+(ex-ox)*m
   yy=y+92*m
   f=(-1 if side else 1)
   d.line([xx,yy,xx+f*35,yy-21],fill=(23,120,77,180),width=3)
   d.line([xx,yy,xx-f*19,yy-24],fill=(19,104,63,160),width=3)
# large gold round medallion
d.ellipse((825,95,1170,440),outline=(255,223,154,170),width=4)
d.ellipse((844,114,1151,421),outline=(255,222,154,85),width=2)
# church silhouette within medallion
church=(13,71,49,255)
d.polygon([(885,366),(991,263),(1096,366)],fill=church)
d.rectangle((895,356,1088,411),fill=church)
d.polygon([(951,291),(991,247),(1030,291)],fill=(12,70,51,255))
d.rectangle((968,284,1012,343),fill=(12,70,51,255))
d.line((991,239,991,211),fill=(249,213,138,255),width=6)
d.line((974,221,1008,221),fill=(249,213,138,255),width=5)
d.rounded_rectangle((970,355,1012,414),radius=20,fill=(100,27,44,255),outline=(240,209,141,210),width=3)
for x in (921,1046):
 d.rectangle((x,351,x+23,382),fill=(241,188,104,205))
 d.line((x+11,351,x+11,382),fill=(16,71,50,255),width=2)
# gold 8-point star
cx,cy=992,169
for r,sw in [(50,5),(23,4)]:
 d.line((cx-r,cy,cx+r,cy),fill=(255,225,141,210),width=sw)
 d.line((cx,cy-r,cx,cy+r),fill=(255,225,141,210),width=sw)
# baubles near church
for (x,y,r,color) in [(841,125,22,(222,55,68,255)),(1128,135,16,(22,108,68,255)),(1128,419,19,(235,193,100,255))]:
 d.line((x,30,x,y-r),fill=(245,213,154,180),width=2)
 d.ellipse((x-r,y-r,x+r,y+r),fill=color,outline=(246,222,156,255),width=3)
 d.ellipse((x-r+8,y-r+6,x-r+14,y-r+12),fill=(255,255,255,140))
random.seed(2026)
for i in range(90):
 x=random.randrange(40,1160);y=random.randrange(45,585)
 if 650<x<1110 and 95<y<430: continue
 r=random.choice([1,1,1,2,3]);d.ellipse((x-r,y-r,x+r,y+r),fill=(255,227,171,random.randint(70,175)))
serif='/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'
sans='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
italic='/usr/share/fonts/truetype/dejavu/DejaVuSerif-Italic.ttf'
f1=ImageFont.truetype(serif,83); f2=ImageFont.truetype(italic,90);f3=ImageFont.truetype(sans,18);f4=ImageFont.truetype(sans,23)
d.text((104,124),'THE JOY OF CHRISTMAS',fill=(255,231,184,250),font=f3,stroke_width=0)
d.text((100,182),'Perayaan',fill=(255,252,234,255),font=f1)
d.text((100,285),'Natal 2026',fill=(255,215,137,255),font=f2)
d.line((105,407,620,407),fill=(243,201,124,155),width=2)
d.text((105,432),'TERANG YANG MEMBAWA HARAPAN',fill=(255,237,210,255),font=f4)
d.text((105,498),'PEACE     •     LOVE     •     JOY',fill=(255,213,149,240),font=f3)
out=Path(__file__).resolve().parents[1] / 'public' / 'og-cover.png'
im.save(out,optimize=True)
print(out,out.stat().st_size)
