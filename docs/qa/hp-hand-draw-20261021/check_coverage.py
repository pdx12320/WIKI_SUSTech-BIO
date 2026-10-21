import json,re,subprocess
from pathlib import Path
from PIL import Image,ImageDraw
import numpy as np
from scipy.ndimage import label,find_objects
base=Path.cwd()
plan=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {drawingPlan} from './static/human-practices/overview/hand-draw.mjs'; console.log(JSON.stringify(drawingPlan()))"],text=True))
mask=Image.new('L',(1685,1000)); draw=ImageDraw.Draw(mask)
for item in plan:
 if 'region' in item:
  r=item['region']; draw.rectangle((r['x'],r['y'],r['x']+r['width'],r['y']+r['height']),fill=255)
 else:
  parts=re.findall(r'[MQLZ]|-?\d+(?:\.\d+)?',item['d']); i=0; pts=[]
  while i<len(parts):
   cmd=parts[i];i+=1
   if cmd in ('M','L'):
    x,y=map(float,parts[i:i+2]);i+=2;pts.append((x,y))
   elif cmd=='Q':
    cx,cy,x,y=map(float,parts[i:i+4]);i+=4;px,py=pts[-1]
    pts.extend((((1-t)**2*px+2*t*(1-t)*cx+t*t*x,(1-t)**2*py+2*t*(1-t)*cy+t*t*y) for t in np.linspace(0,1,300)))
   elif cmd=='Z':pts.append(pts[0])
  width=max(36,item['width']+12);draw.line(pts,fill=255,width=width)
  for x,y in pts: draw.ellipse((x-width/2,y-width/2,x+width/2,y+width/2),fill=255)
original=np.array(Image.open(base/'assets/human-practices/overview/hp-hand-drawn-overview-20261021.jpg').convert('RGB'))
ink=original.min(2)<180
missing=ink & (np.array(mask)==0)
labels,n=label(missing); out=[]
for i,slices in enumerate(find_objects(labels),1):
 count=int((labels[slices]==i).sum())
 if count>=3:out.append({'pixels':count,'box':[slices[1].start,slices[0].start,slices[1].stop,slices[0].stop]})
print(json.dumps({'ink_pixels':int(ink.sum()),'uncovered_pixels':int(missing.sum()),'components':sorted(out,key=lambda x:-x['pixels'])},indent=2))
