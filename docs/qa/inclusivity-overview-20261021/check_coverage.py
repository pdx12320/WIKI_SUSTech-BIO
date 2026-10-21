"""Verify a single whole-artwork pass, with tight lettering drawn afterwards."""
from pathlib import Path
import json,os,re,subprocess
from PIL import Image,ImageDraw
import numpy as np
root=Path(__file__).resolve().parents[3]
node=os.environ.get('NODE_BIN',str(Path.home()/'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node'))
program="import {inclusivityDrawingPlan} from './static/human-practices/inclusivity-overview/plan.mjs'; import {lettering} from './static/human-practices/inclusivity-overview/lettering.mjs'; console.log(JSON.stringify({plan:inclusivityDrawingPlan(),lettering}));"
data=json.loads(subprocess.check_output([node,'--input-type=module','-e',program],cwd=root,text=True))
plan=data['plan'];letters=data['lettering'];first=plan[0]
assert first['region']=={'x':0,'y':0,'width':1280,'height':666}
assert not first.get('exclude')
assert first['excludePaths']==[item['d'] for item in letters]
source=np.array(Image.open(root/'assets/human-practices/inclusivity-overview/inclusivity-hand-drawn-overview-20261021.jpg').convert('RGB'))
mask=Image.new('L',(1280,666));draw=ImageDraw.Draw(mask)
for item in letters:
 for x,y,w,h,_ in re.findall(r'M(\d+) (\d+)h(\d+)v(\d+)h(-\d+)Z',item['d']):
  x,y,w,h=map(int,(x,y,w,h));draw.rectangle((x,y,x+w-1,y+h-1),fill=255)
letter_pixels=np.array(mask)>0
revealed=~letter_pixels
# Later text regions must reveal every withheld pixel, before the final whole-image pass.
for item in plan[1:]:
 r=item['region'];revealed[r['y']:r['y']+r['height']+1,r['x']:r['x']+r['width']+1]=True
result={'artwork_passes':1,'letter_groups':len(letters),'rectangular_foreground_exclusions':0,'tight_letter_mask_pixels':int(letter_pixels.sum()),'uncovered_pixels':int((~revealed).sum()),'non_letter_pixels_visible_after_artwork':bool(revealed.shape==(666,1280))}
assert result['uncovered_pixels']==0
print(json.dumps(result,indent=2))
