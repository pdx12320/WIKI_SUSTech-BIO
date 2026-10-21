"""Rebuild only HP evidence figure blocks and their editable SVG / 2x PNG exports.
Run from the repository root: MPLCONFIGDIR=/tmp/hp-evidence-mpl python3 docs/human-practices/evidence-analysis/build_figures.py
No remote requests, image tracing, source-page replacement or dependency changes.
"""
from pathlib import Path
import json, html, textwrap, re
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib import font_manager
ROOT=Path(__file__).resolve().parents[3]
ASSETS=ROOT/'assets/human-practices/evidence-analysis'
DATA=json.loads((ASSETS/'survey-data.json').read_text())
MATRIX=json.loads((ASSETS/'matrix-data.json').read_text())
TOKENS=json.loads((ASSETS/'style-tokens.json').read_text())['colors']
COLORS={name:TOKENS[token] for name,token in {'ink':'ink','indigo':'indigo700','secondary':'indigo500','soft':'lavender100','coral':'coral400','lavender':'lavender300','line':'line','muted':'muted'}.items()}
# Local fonts are used for export only; the page uses its own installed/fallback font stack.
FONT=font_manager.FontProperties(fname='/System/Library/Fonts/Supplemental/Futura.ttc')
TITLE=font_manager.FontProperties(fname='/System/Library/Fonts/Supplemental/Georgia Bold.ttf')
plt.rcParams.update({'font.family':FONT.get_name(),'svg.fonttype':'none','text.color':COLORS['ink'],'axes.labelcolor':COLORS['ink'],'xtick.color':COLORS['muted'],'ytick.color':COLORS['ink']})
N=DATA['total_valid_records']
assert sum(x['count'] for x in DATA['age'])==N
assert sum(x['count'] for x in DATA['experience'])==N
esc=html.escape

def cites(refs):
 return ' <span class="hp-evidence-cites">'+' '.join(f'<a href="{MATRIX["links"][r]}" aria-label="Source {r}">[{r}]</a>' for r in refs)+'</span>'

def downloads(stem,title):
 return f'<div class="hp-evidence-downloads"><a href="assets/human-practices/evidence-analysis/{stem}.svg" aria-label="Download editable SVG: {title}">Editable SVG</a><a href="assets/human-practices/evidence-analysis/{stem}.png" aria-label="Download high-resolution image: {title}">High-resolution image</a></div>'

def matrix_html():
 out=['<figure class="hp-figure hp-evidence" id="hp-evidence-to-action" aria-labelledby="hp-evidence-to-action-caption">','<p class="hp-evidence-kicker">Figure A · retrospective analysis · 21 October 2026</p>','<h4>Evidence to action</h4>','<p>Read across each theme to see what comes from published research, our conversations and the questionnaire, then what we changed or still need to do.</p>','<table aria-label="Evidence to action matrix"><colgroup><col style="width:18%"><col style="width:20.5%"><col style="width:20.5%"><col style="width:20.5%"><col style="width:20.5%"></colgroup><thead><tr><th scope="col">Question</th>']
 out += [f'<th scope="col">{esc(c)}</th>' for c in MATRIX['columns']]
 out += ['</tr></thead><tbody>']
 for row in MATRIX['rows']:
  out += [f'<tr><th scope="row">{esc(row["theme"])}</th>']
  for label,cell in zip(MATRIX['columns'],row['cells']):
   out += [f'<td><span class="hp-evidence-cell-label" aria-hidden="true">{esc(label)}</span>{esc(cell["text"])}{cites(cell["refs"])}</td>']
  out+=['</tr>']
 out+=['</tbody></table>','<figcaption id="hp-evidence-to-action-caption">Figure 12. Evidence to action. An original qualitative synthesis of separate evidence sources, not a score or a reconstruction of decision dates. “Not assessed” identifies a questionnaire gap. Source numbers lead to the literature or team records; status words distinguish completed changes, evaluation priorities, a stopped route and plans.</figcaption>',downloads('evidence-to-action','Evidence to action'),'</figure>']
 return '\n'.join(out)

def survey_html():
 out=['<figure class="hp-figure hp-evidence" id="hp-survey-figure" aria-labelledby="hp-survey-figure-caption">','<p class="hp-evidence-kicker">Figure B · team questionnaire · 103 valid records</p>','<h4>Who answered, and what they selected</h4>','<div class="hp-evidence-samples">','<section class="hp-evidence-sample" aria-label="Age composition"><h4>Q1 · Age</h4>','<div class="hp-evidence-age" aria-hidden="true">']
 # Dominant age band first in this stacked bar; legend and labels retain all counts.
 for item in [DATA['age'][1],DATA['age'][0],DATA['age'][2]]:out+=[f'<span style="width:{item["count"]/N*100:.6f}%"></span>']
 out+=['</div><ul class="hp-evidence-key">']
 for item,color in zip([DATA['age'][1],DATA['age'][0],DATA['age'][2]],[COLORS['indigo'],COLORS['coral'],COLORS['lavender']]):out+=[f'<li><i aria-hidden="true" style="--hp-color:{color}"></i>{esc(item["label"])}: <strong>{item["count"]}/103</strong></li>']
 out+=['</ul><p class="hp-evidence-small">Single choice; all other listed age bands: 0. Counts sum to 103.</p></section>','<section class="hp-evidence-sample" aria-label="Experience with cognitive disorders"><h4>Q3 · Relevant experience</h4><dl class="hp-evidence-experience">']
 for item in DATA['experience']:out+=[f'<div><dt>{esc(item["label"])}</dt><dd><strong>{item["count"]}/103</strong></dd></div>']
 out+=['</dl><p class="hp-evidence-small">Single choice. “Direct” includes personal or family diagnosis or caregiving; “prefer not to answer” is a reported option.</p></section></div>']
 for q in DATA['questions']:
  out += [f'<section class="hp-evidence-question hp-evidence-question--{q["id"]}" aria-label="{q["id"]}: {esc(q["meaning"])}"><h4>{q["id"]} · {"What to explain first" if q["id"]=="Q8" else "What gets in the way"}</h4>',f'<p>{esc(q["meaning"])}.</p>',f'<p class="hp-evidence-small">Multiple choice · up to {q["selection_limit"]} options · report denominator: 103 · three most-selected options shown</p>']
  for i in q['display_indices']:
   item=q['options'][i]; pct=item['count']/N*100
   out += [f'<div class="hp-evidence-bar-row"><div class="hp-evidence-bar-label"><span>{esc(item["label"])}</span><strong>{item["count"]}/103 · {pct:.1f}%</strong></div><div class="hp-evidence-bar-track" aria-hidden="true"><span class="hp-evidence-bar-fill" style="--hp-share:{pct:.6f}%"></span></div></div>']
  out+=['</section>']
 out+=['<p class="hp-evidence-small">All bars use the same 0–100% scale: selections divided by all 103 valid survey records. Options may overlap. The report does not separately state item-level valid-answer or skipped-answer counts for Q8 and Q10.</p>','<details class="hp-evidence-methods"><summary>Question wording and counting rules</summary>']
 for q in DATA['questions']:out += [f'<p><strong>{q["id"]}:</strong> {esc(q["wording"])} Multiple choice; select up to {q["selection_limit"]}.</p>']
 out += ['<p>Age and experience counts each sum to 103. The report supplies the overall valid-record total and uses 103 for percentages, but provides no respondent-level export or separate completion counts for the multiple-choice items. We make no adjustment for unknown skipped answers. These are public communication responses, mainly from people aged 18–30.</p>','<p><a href="assets/human-practices/attachments/public-perception-survey-findings-en.pdf">Findings report · sample on page 1; Q8 and Q10 on page 4</a> · <a href="assets/human-practices/attachments/public-perception-questionnaire-bilingual.pdf">Full bilingual question wording</a> · <a href="assets/human-practices/evidence-analysis/survey-data.json">Chart data and all reported options</a></p></details>','<figcaption id="hp-survey-figure-caption">Figure 13. Sample composition and selected Q8/Q10 findings, redrawn from the team’s aggregate report [H1]. Counts and denominators are retained; percentages are rounded to one decimal. The figure describes this respondent group, rather than estimating patient or caregiver needs.</figcaption>',downloads('public-questionnaire','Public questionnaire sample and findings'),'</figure>']
 return '\n'.join(out)

def save(fig,stem,description):
 fig.savefig(ASSETS/(stem+'.svg'),format='svg',facecolor='white')
 fig.savefig(ASSETS/(stem+'.png'),dpi=200,facecolor='white')
 path=ASSETS/(stem+'.svg');text=path.read_text();text=re.sub(r'(<svg\b[^>]*>)',lambda m:m[1]+'\n<title>'+esc(description)+'</title>\n<desc>Original ORCA analysis, 21 October 2026. Source references and counting rules are retained in the figure and live HP page.</desc>',text,count=1,flags=re.S);path.write_text(text)
 plt.close(fig)

def export_matrix():
 fig=plt.figure(figsize=(16,10),dpi=100); ax=fig.add_axes([.025,.20,.95,.64]);ax.axis('off')
 labels=['Theme']+MATRIX['columns']; rows=[]
 for row in MATRIX['rows']:rows.append([row['theme']]+[cell['text']+' '+''.join('['+r+']' for r in cell['refs']) for cell in row['cells']])
 wrapped=[[textwrap.fill(c,20 if i==0 else 32) for i,c in enumerate(row)] for row in rows]
 table=ax.table(cellText=wrapped,colLabels=[textwrap.fill(x,25) for x in labels],colWidths=[.14,.215,.215,.215,.215],cellLoc='left',colLoc='left',loc='center',bbox=[0,0,1,1]);table.auto_set_font_size(False);table.set_fontsize(10.5)
 for (r,c),cell in table.get_celld().items():
  cell.set_edgecolor(COLORS['line']);cell.set_linewidth(.65);cell.set_facecolor('#fff');cell.get_text().set_fontproperties(FONT);cell.get_text().set_fontsize(10.5);cell.get_text().set_linespacing(1.5)
  if r==0:cell.set_facecolor(COLORS['soft']);cell.get_text().set_color(COLORS['indigo']);cell.get_text().set_weight('bold')
  if c==0:cell.get_text().set_color(COLORS['indigo'])
 fig.text(.035,.94,'Evidence to action',fontproperties=TITLE,fontsize=25,color=COLORS['indigo'])
 fig.text(.035,.89,'Figure A / Figure 12 · Retrospective qualitative synthesis · 21 October 2026',fontproperties=FONT,fontsize=12,color=COLORS['muted'])
 fig.text(.035,.09,'Source key: [5–9] published studies/report; [H1] team survey; [H2] research interviews; [H3] care staff/workbook; [H4] Shokz/Anjia.\n[E1] functional evaluation and [E2] delivery discussion in Engineering. Full links: Human Practices / Sources and records.\nStatuses describe the recorded response, not evidence strength. No scores, pooled percentages or causal timeline are inferred.',fontproperties=FONT,fontsize=11,linespacing=1.6,color=COLORS['muted'])
 save(fig,'evidence-to-action','Evidence to action matrix with four themes and four evidence/response columns')

def export_survey():
 fig=plt.figure(figsize=(12,14),dpi=100)
 fig.text(.06,.963,'Who answered, and what they selected',fontproperties=TITLE,fontsize=24,color=COLORS['indigo'])
 fig.text(.06,.927,'Figure B / Figure 13 · ORCA public questionnaire · 103 valid records',fontproperties=FONT,fontsize=12,color=COLORS['muted'])
 ax=fig.add_axes([.08,.82,.37,.055]);left=0
 for item,col in zip([DATA['age'][1],DATA['age'][0],DATA['age'][2]],[COLORS['indigo'],COLORS['coral'],COLORS['lavender']]):ax.barh(0,item['count'],left=left,color=col);left+=item['count']
 ax.axis('off');fig.text(.08,.889,'Q1 · Age',fontproperties=TITLE,fontsize=17,color=COLORS['indigo'])
 fig.text(.08,.793,'18–30: 96/103 (93.2%)\nUnder 18: 6/103 · 46–60: 1/103\nAll other listed age bands: 0',fontproperties=FONT,fontsize=12,linespacing=1.7,va='top')
 fig.text(.54,.889,'Q3 · Relevant experience',fontproperties=TITLE,fontsize=17,color=COLORS['indigo'])
 for i,item in enumerate(DATA['experience']):fig.text(.54,.86-i*.035,textwrap.fill(item['label'],39)+f'  {item["count"]}/103',fontproperties=FONT,fontsize=11.5)
 for q,y in zip(DATA['questions'],[.47,.16]):
  fig.text(.08,y+.24,q['id']+' · '+('What to explain first' if q['id']=='Q8' else 'What gets in the way'),fontproperties=TITLE,fontsize=19,color=COLORS['indigo'])
  fig.text(.08,y+.21,f'Multiple choice · select up to {q["selection_limit"]} · denominator 103 · top three options',fontproperties=FONT,fontsize=11,color=COLORS['muted'])
  ax=fig.add_axes([.46,y,.47,.17]);items=[q['options'][i] for i in q['display_indices']];values=[i['count']/N*100 for i in items]
  ax.barh(range(3),values,color=COLORS['indigo'] if q['id']=='Q8' else COLORS['secondary'],height=.52);ax.set_xlim(0,100);ax.set_ylim(2.6,-.6);ax.set_yticks(range(3),[textwrap.fill(i['label'].replace('“','"').replace('”','"'),38) for i in items],fontproperties=FONT,fontsize=11.5)
  for i,(v,item) in enumerate(zip(values,items)):ax.text(v+1.5,i,f'{item["count"]}/103 · {v:.1f}%',va='center',fontproperties=FONT,fontsize=11,color=COLORS['indigo'])
  ax.set_xticks([0,25,50,75,100]);ax.tick_params(axis='y',length=0,pad=16);ax.set_xlabel('Selections / all valid survey records (%)',fontproperties=FONT,fontsize=10);ax.xaxis.grid(True,color=COLORS['line'],lw=.6);ax.set_axisbelow(True)
  for spine in ['top','right','left']:ax.spines[spine].set_visible(False)
  ax.spines['bottom'].set_color(COLORS['line'])
 fig.text(.08,.095,'Source [H1]: aggregate findings, page 1 (Q1/Q3) and page 4 (Q8/Q10); full wording in the bilingual questionnaire.\nOptions overlap. Item-level completion/skipped-answer counts for Q8 and Q10 were not supplied.\nQ3 “direct experience” includes diagnosis or caregiving; two respondents selected “prefer not to answer”.\nMainly younger public respondents; not a patient/caregiver needs estimate. No pooling or significance tests.',fontproperties=FONT,fontsize=10.5,linespacing=1.8,color=COLORS['muted'],va='top')
 save(fig,'public-questionnaire','Team public questionnaire sample, information priorities and understanding barriers, all denominators 103')

def replace_marked(text,name,content):
 pattern=r'<!-- hp-evidence-'+name+r':start -->.*?<!-- hp-evidence-'+name+r':end -->'
 assert len(re.findall(pattern,text,re.S))==1,'Missing or repeated figure marker '+name
 return re.sub(pattern,lambda m:'<!-- hp-evidence-'+name+':start -->\n'+content+'\n<!-- hp-evidence-'+name+':end -->',text,flags=re.S)

if __name__=='__main__':
 export_matrix();export_survey()
 p=ROOT/'docs/human-practices/human-practices.md';text=p.read_text();text=replace_marked(text,'matrix',matrix_html());text=replace_marked(text,'survey',survey_html());p.write_text(text)
 print('Built two native responsive figures and four SVG/PNG exports; only marked HP figure blocks updated.')
