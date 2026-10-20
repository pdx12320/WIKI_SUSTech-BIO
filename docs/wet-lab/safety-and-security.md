---
title: Safety & Security
subtitle: Connecting wet-lab evidence, computational uncertainty and responsible research.
eyebrow: Wet Lab
status: pending
status_label: Content pending team review
status_message: Updated with current experimental outcomes. Institutional safety records and the final scientific review remain with the team.
---

# Safety & Security

## Safety Across Scales

ORCA investigates RNA editing at an APOE4-associated site. Alongside the intended change, we examine edits at other sites, activity outside the intended cellular context, and the consequences of delivery and sustained expression.

We organize this work across eight scales and four actions: **Anticipate, Constrain, Detect, Decide**. Wet-lab experiments provide molecular and cellular observations; computational work helps compare editors, prioritize sites and explore distribution.

<template id="safety-mini-template">
<div class="safety-mini" role="group" aria-label="Safety review map">
<span class="safety-mini__label">SAFETY REVIEW</span>
<svg class="safety-mini__diagram" viewBox="0 0 260 270" role="group" aria-label="Four review stages">
<path class="safety-mini__main" d="M141 4V20M141 58V74M141 112V128M141 166V182M141 220V238"/>
<path class="safety-mini__input" d="M27 24H43V201M27 46H43M27 68H43M27 90H43M27 112H43M27 134H43M27 156H43M27 178H43M43 39H64M43 93H64M43 147H64M43 201H64"/>
<path class="safety-mini__return" d="M183 239H248V93H218M183 251H236V147H218"/>
<a href="#i-anticipate" data-safety-mini-stage="anticipate" aria-label="Read Anticipate"><rect x="64" y="20" width="154" height="38" rx="5"/><text x="141" y="40" dominant-baseline="central">Anticipate</text></a>
<a href="#ii-constrain" data-safety-mini-stage="constrain" aria-label="Read Constrain"><rect x="64" y="74" width="154" height="38" rx="5"/><text x="141" y="94" dominant-baseline="central">Constrain</text></a>
<a href="#iii-detect" data-safety-mini-stage="detect" aria-label="Read Detect"><rect x="64" y="128" width="154" height="38" rx="5"/><text x="141" y="148" dominant-baseline="central">Detect</text></a>
<a href="#iv-decide" data-safety-mini-stage="decide" aria-label="Read Decide"><rect x="64" y="182" width="154" height="38" rx="5"/><text x="141" y="202" dominant-baseline="central">Decide</text></a>
<circle class="safety-mini__selector" cx="141" cy="238" r="5"/>
<path class="safety-mini__input" d="M146 238H163V227H178M163 238H178M163 238V249H178M163 249V260H178"/>
<circle class="safety-mini__port" cx="24" cy="24" r="3"/>
<circle class="safety-mini__port" cx="24" cy="46" r="3"/>
<circle class="safety-mini__port" cx="24" cy="68" r="3"/>
<circle class="safety-mini__port" cx="24" cy="90" r="3"/>
<circle class="safety-mini__port" cx="24" cy="112" r="3"/>
<circle class="safety-mini__port" cx="24" cy="134" r="3"/>
<circle class="safety-mini__port" cx="24" cy="156" r="3"/>
<circle class="safety-mini__port" cx="24" cy="178" r="3"/>
<circle class="safety-mini__port" cx="181" cy="227" r="3"/>
<circle class="safety-mini__port" cx="181" cy="238" r="3"/>
<circle class="safety-mini__port" cx="181" cy="249" r="3"/>
<circle class="safety-mini__port" cx="181" cy="260" r="3"/>
</svg>
<a class="safety-mini__full" href="#risk-overview">Full Figure 1 ↗</a>
</div>
</template>

<figure class="safety-figure" id="risk-overview" aria-labelledby="risk-overview-title">
<span id="control-gates"></span>
<h4 class="sm-sr-only" id="risk-overview-title">ORCA safety and security framework</h4>
<div class="sm-scroll">
<svg class="sm-circuit sb-board" viewBox="0 0 1240 1440" role="group" aria-labelledby="sm-title sm-desc" xmlns="http://www.w3.org/2000/svg">
<title id="sm-title">ORCA safety review board</title>
<desc id="sm-desc">Eight risk inputs feed a shared review rail. Four processing modules ask what could go wrong, which safeguards are in place, what the evidence shows and whether the next step can proceed. Authorization and records, and Access, Privacy and Misuse review enter Decide. A decision selector offers Proceed to the next defined step, Redesign with a return to Constrain, More evidence with a return to Detect, or Stop. Six project areas are listed at the bottom. Focus a module to highlight its connected lines; activate it to read the corresponding section. Choose a decision to highlight its route. Escape clears the selection.</desc>
<defs><marker id="sb-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1 8 5 1 9" fill="none" stroke="#2e267c" stroke-width="1.5"/></marker><marker id="sb-arrow-anticipate" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1 8 5 1 9" fill="none" style="stroke:#355da8;stroke-width:1.5"/></marker><marker id="sb-arrow-constrain" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1 8 5 1 9" fill="none" style="stroke:#7450a2;stroke-width:1.5"/></marker><marker id="sb-arrow-detect" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1 8 5 1 9" fill="none" style="stroke:#23796c;stroke-width:1.5"/></marker><marker id="sb-arrow-decide" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1 8 5 1 9" fill="none" style="stroke:#ad4d62;stroke-width:1.5"/></marker></defs>
<text class="sb-eyebrow sb-start" x="65" y="62">RISK INPUTS</text>
<text class="sb-start-label" x="635" y="67">START</text>
<path class="sb-main sb-wire" data-for="anticipate" d="M635 84V116"/>
<path class="sb-input sb-wire" data-for="anticipate constrain detect decide" d="M360 140V875"/>
<text class="sb-number" x="55" y="140" dominant-baseline="central">01</text>
<text class="sb-scale sb-start" data-scale="01" x="87" y="140" dominant-baseline="central">Sequence</text>
<circle class="sb-terminal" cx="300" cy="140" r="6"/>
<path class="sb-input sb-wire" data-for="anticipate constrain detect decide" d="M306 140H360"/>
<circle class="sb-junction" cx="360" cy="140" r="3"/>
<text class="sb-number" x="55" y="220" dominant-baseline="central">02</text>
<text class="sb-scale sb-start" data-scale="02" x="87" y="220" dominant-baseline="central">System</text>
<circle class="sb-terminal" cx="300" cy="220" r="6"/>
<path class="sb-input sb-wire" data-for="anticipate constrain detect decide" d="M306 220H360"/>
<circle class="sb-junction" cx="360" cy="220" r="3"/>
<text class="sb-number" x="55" y="300" dominant-baseline="central">03</text>
<text class="sb-scale sb-start" data-scale="03" x="87" y="300" dominant-baseline="central">Editor</text>
<circle class="sb-terminal" cx="300" cy="300" r="6"/>
<path class="sb-input sb-wire" data-for="anticipate constrain detect decide" d="M306 300H360"/>
<circle class="sb-junction" cx="360" cy="300" r="3"/>
<text class="sb-number" x="55" y="380" dominant-baseline="central">04</text>
<text class="sb-scale sb-start" data-scale="04" x="87" y="380" dominant-baseline="central">Cellular</text>
<circle class="sb-terminal" cx="300" cy="380" r="6"/>
<path class="sb-input sb-wire" data-for="anticipate constrain detect decide" d="M306 380H360"/>
<circle class="sb-junction" cx="360" cy="380" r="3"/>
<text class="sb-number" x="55" y="460" dominant-baseline="central">05</text>
<text class="sb-scale sb-start" data-scale="05" x="87" y="460" dominant-baseline="central">Measurement</text>
<circle class="sb-terminal" cx="300" cy="460" r="6"/>
<path class="sb-input sb-wire" data-for="anticipate constrain detect decide" d="M306 460H360"/>
<circle class="sb-junction" cx="360" cy="460" r="3"/>
<text class="sb-number" x="55" y="540" dominant-baseline="central">06</text>
<text class="sb-scale sb-start" data-scale="06" x="87" y="540" dominant-baseline="central">Functional</text>
<circle class="sb-terminal" cx="300" cy="540" r="6"/>
<path class="sb-input sb-wire" data-for="anticipate constrain detect decide" d="M306 540H360"/>
<circle class="sb-junction" cx="360" cy="540" r="3"/>
<text class="sb-number" x="55" y="620" dominant-baseline="central">07</text>
<text class="sb-scale sb-start" data-scale="07" x="87" y="620" dominant-baseline="central">Treatment</text>
<circle class="sb-terminal" cx="300" cy="620" r="6"/>
<path class="sb-input sb-wire" data-for="anticipate constrain detect decide" d="M306 620H360"/>
<circle class="sb-junction" cx="360" cy="620" r="3"/>
<text class="sb-number" x="55" y="700" dominant-baseline="central">08</text>
<text class="sb-scale sb-start" data-scale="08" x="87" y="700" dominant-baseline="central">Human &amp; societal</text>
<circle class="sb-terminal" cx="300" cy="700" r="6"/>
<path class="sb-input sb-wire" data-for="anticipate constrain detect decide" d="M306 700H360"/>
<circle class="sb-junction" cx="360" cy="700" r="3"/>
<path class="sb-input sb-wire" data-for="anticipate" d="M360 195H431"/>
<circle class="sb-junction" cx="360" cy="195" r="3"/>
<a class="sb-module" data-module="anticipate" href="#i-anticipate" role="link" aria-label="Read Anticipate: What could go wrong?">
<rect class="sb-module-frame" x="435" y="120" width="400" height="150" rx="8"/>
<text class="sb-module-title sb-start" x="466" y="164">Anticipate</text>
<text class="sb-question sb-start" x="466" y="203">What could go wrong?</text>
<text class="sb-keywords sb-start" x="466" y="241">Off-targets · Exposure</text>
</a>
<path class="sb-main sb-wire" data-for="anticipate constrain" d="M635 270V336"/>
<path class="sb-input sb-wire" data-for="constrain" d="M360 415H431"/>
<circle class="sb-junction" cx="360" cy="415" r="3"/>
<a class="sb-module" data-module="constrain" href="#ii-constrain" role="link" aria-label="Read Constrain: What safeguards are in place?">
<rect class="sb-module-frame" x="435" y="340" width="400" height="150" rx="8"/>
<text class="sb-module-title sb-start" x="466" y="384">Constrain</text>
<text class="sb-question sb-start" x="466" y="423">What safeguards are in place?</text>
<text class="sb-keywords sb-start" x="466" y="461">Containment · Consent</text>
</a>
<path class="sb-main sb-wire" data-for="constrain detect" d="M635 490V556"/>
<path class="sb-input sb-wire" data-for="detect" d="M360 635H431"/>
<circle class="sb-junction" cx="360" cy="635" r="3"/>
<a class="sb-module" data-module="detect" href="#iii-detect" role="link" aria-label="Read Detect: What does the evidence show?">
<rect class="sb-module-frame" x="435" y="560" width="400" height="150" rx="8"/>
<text class="sb-module-title sb-start" x="466" y="604">Detect</text>
<text class="sb-question sb-start" x="466" y="643">What does the evidence show?</text>
<text class="sb-keywords sb-start" x="466" y="681">Assays · Uncertainty</text>
</a>
<path class="sb-main sb-wire" data-for="detect decide" d="M635 710V796"/>
<path class="sb-input sb-wire" data-for="decide" d="M360 875H431"/>
<circle class="sb-junction" cx="360" cy="875" r="3"/>
<a class="sb-module" data-module="decide" href="#iv-decide" role="link" aria-label="Read Decide: Can we proceed to the next step?">
<rect class="sb-module-frame" x="435" y="800" width="400" height="150" rx="8"/>
<text class="sb-module-title sb-start" x="466" y="844">Decide</text>
<text class="sb-question sb-start" x="466" y="883">Can we proceed to the next step?</text>
<text class="sb-keywords sb-start" x="466" y="921">Evidence · Authorization</text>
</a>
<text class="sb-input-label sb-start" x="900" y="740">Authorization &amp; records</text>
<circle class="sb-terminal" cx="1035" cy="770" r="6"/>
<path class="sb-input sb-wire" data-for="decide" d="M1028 770H880V850H839"/>
<text class="sb-input-label sb-start" x="900" y="875">Security review</text>
<text class="sb-security-detail sb-start" x="900" y="905">Access · Privacy · Misuse review</text>
<circle class="sb-terminal" cx="1035" cy="930" r="6"/>
<path class="sb-input sb-wire" data-for="decide" d="M1028 930H865V925H839"/>
<path class="sb-main sb-wire" data-for="decide" d="M635 950V1090H821"/>
<text class="sb-selector-label" x="800" y="1000">Decision selector</text>
<circle class="sb-selector" cx="840" cy="1090" r="17"/>
<path class="sb-selector-arm" data-arm="proceed" d="M840 1090 900 1000"/>
<path class="sb-selector-arm" data-arm="redesign" d="M840 1090 900 1070"/>
<path class="sb-selector-arm" data-arm="more" d="M840 1090 900 1140"/>
<path class="sb-selector-arm" data-arm="stop" d="M840 1090 900 1210"/>
<path class="sb-return sb-wire" data-return="redesign" data-for="constrain" d="M900 1070H875V1050H1205V415H839"/>
<text class="sb-return-label sb-start" data-return-label="redesign" x="905" y="391">Redesign → Constrain</text>
<path class="sb-return sb-wire" data-return="more" data-for="detect" d="M900 1140H860V1100H1165V635H839"/>
<text class="sb-return-label sb-start" data-return-label="more" x="905" y="611">More evidence → Detect</text>
<g class="sb-outcome" data-outcome="proceed" role="button" tabindex="0" aria-pressed="false" aria-label="PROCEED: to the next defined step">
<rect class="sb-hit" x="888" y="973" width="330" height="66" rx="5"/>
<circle class="sb-contact" cx="900" cy="1000" r="6"/>
<path class="sb-out-line" d="M907 1000H944"/>
<text class="sb-outcome-label sb-start" x="963" y="1008">PROCEED</text>
<text class="sb-proceed-note sb-start" x="963" y="1034">to the next defined step</text>
</g>
<g class="sb-outcome" data-outcome="redesign" role="button" tabindex="0" aria-pressed="false" aria-label="REDESIGN">
<rect class="sb-hit" x="888" y="1043" width="330" height="54" rx="5"/>
<circle class="sb-contact" cx="900" cy="1070" r="6"/>
<path class="sb-out-line" d="M907 1070H944"/>
<text class="sb-outcome-label sb-start" x="963" y="1078">REDESIGN</text>
</g>
<g class="sb-outcome" data-outcome="more" role="button" tabindex="0" aria-pressed="false" aria-label="MORE EVIDENCE">
<rect class="sb-hit" x="888" y="1113" width="330" height="54" rx="5"/>
<circle class="sb-contact" cx="900" cy="1140" r="6"/>
<path class="sb-out-line" d="M907 1140H944"/>
<text class="sb-outcome-label sb-start" x="963" y="1148">MORE EVIDENCE</text>
</g>
<g class="sb-outcome" data-outcome="stop" role="button" tabindex="0" aria-pressed="false" aria-label="STOP">
<rect class="sb-hit" x="888" y="1183" width="330" height="54" rx="5"/>
<circle class="sb-contact" cx="900" cy="1210" r="6"/>
<path class="sb-out-line" d="M907 1210H944"/>
<text class="sb-outcome-label sb-start" x="963" y="1218">STOP</text>
</g>
<path class="sb-footer-rule" d="M65 1280H1175"/>
<text class="sb-eyebrow sb-start" x="65" y="1323">APPLIES ACROSS ORCA</text>
<text class="sb-scope" x="150" y="1365">Wet lab</text>
<text class="sb-scope-detail" x="150" y="1397">Risk / containment</text>
<text class="sb-scope" x="330" y="1365">HP</text>
<text class="sb-scope-detail" x="330" y="1397">Choice / privacy</text>
<text class="sb-scope" x="510" y="1365">Education</text>
<text class="sb-scope-detail" x="510" y="1397">Media consent review</text>
<text class="sb-scope" x="690" y="1365">Inclusivity</text>
<text class="sb-scope-detail" x="690" y="1397">Camera permissions review</text>
<text class="sb-scope" x="870" y="1365">Model</text>
<text class="sb-scope-detail" x="870" y="1397">QC / uncertainty</text>
<text class="sb-scope" x="1050" y="1365">Software</text>
<text class="sb-scope-detail" x="1050" y="1397">Access / misuse review</text>
</svg>
</div>
<span class="sm-sr-only" data-board-live aria-live="polite"></span>
<figcaption><strong>Figure 1.</strong> ORCA's proposed safety review framework: eight risk inputs, four review modules and a decision selector. REDESIGN returns to Constrain; MORE EVIDENCE returns to Detect. Authorization, records and security review inform the next defined step. Practices and evidence are detailed in <a href="#response-register">Table 1</a>.</figcaption>
</figure>
<script src="/static/safety-security/review-board.js" defer></script>

## I. Anticipate

### Scale 01 — Sequence Scale

A targeted RNA editor may affect other transcripts or nearby cytidines. The [Model](/model) workflow combines RNA-seq candidate-site analysis with LAMAR prioritization. These approaches help locate signals and select sites for follow-up; the samples, background filters, callable coverage and detection limits determine what is visible.

The [Integrated ORCA](/engineering#integrated-orca) analysis examined C388 target activity, C295 and the potentially stop-generating C871 bystander, 290 non-target cytidines in the sequenced APOE coding region, and co-editing within individual reads. Independent site validation and broader cellular comparisons remain important next steps.

### Scale 02 — System Scale

The [Whole-body Delivery Model](/software#rewire) connects delivery, tissue distribution, expression and RNA editing. Parameter scans and uncertainty analyses explore how exposure, coverage and intended-product retention depend on the assumed rates and transport processes.

These are simulation scenarios. Their units and comparison criteria belong to the model; calibration against biological distribution, expression time courses and persistence is still needed before translating them into administration decisions.

## II. Constrain

### Scale 03 — Editor Scale

PUF recognition and APOBEC catalysis were engineered separately and then tested together. Of 16 designed combinations, 14 were sequence-verified and evaluated. Some pairings lost activity despite containing promising individual modules, showing why the complete editor needs its own test.

IO-02 and IO-03 were selected using target activity, bystander profiles and read-level composition. Both reduced selected bystanders while retaining useful C388 activity; residual unwanted editing remained. These results describe the tested substrate and assay. Broader RNA effects, cell-dependent behavior, long-term responses and protein consequences inferred from codons remain to be evaluated. See [Integrated ORCA Engineering](/engineering#integrated-orca).

### Scale 04 — Cellular Scale

The Control branch explored where and for how long ORCA remains active. Its four modules reached different stages:

- **GFA — partial validation.** gfaABC1D produced lower ORCA-associated expression and APOE reporter Sanger signals than CMV in HEK293T, with the opposite pattern in U251. Three independently transfected wells were tested per condition. This supports cell-context-dependent regulation; broader astrocyte specificity remains open. Editor-NTC amplification and unavailable −RT / efficiency checks limit precise qPCR fold estimates. [GFA evidence](/engineering#gfa-cycle-02).
- **Synthetic ASO Tag — partial suppression.** In HEK293T, C805 reduced tagged-ORCA C388 editing from **57.13% to 28.54% at 48 h** and **66.23% to 37.71% at 96 h** in the APOE4 reporter assay. Untagged ORCA showed no comparable response. Each condition had three culture wells from one experiment; paired PCR measurements were averaged within each well. Residual editing remained substantial. Full shutdown, direct RNA/protein confirmation and recovery after withdrawal await testing. [ASO evidence](/engineering#aso-cycle-06).
- **Cre–loxP — design only.** A later Cre intervention is proposed to excise ORCA coding DNA from recombined expression templates. Excision, cell coverage and the turnover of existing editor RNA/protein remain untested in ORCA. [Design and next tests](/engineering#cre-loxp-design-scope-and-future-validation).
- **MRE — tested and excluded.** Attenuated expression was observed, but miRNA-specific regulation was unresolved. Endogenous-miRNA QC and editor-NTC background limited interpretation, including the mimic experiment. MRE was excluded from the final ORCA design. [MRE evidence](/engineering#mre).

These experiments address molecular regulation. Laboratory containment and institutional oversight address exposure and handling through separate controls.

## III. Detect

### Scale 05 — Measurement Scale

[SONAR](/project-contribution-sonar) separates reporter activity, reference-calibrated scores and molecular editing. In the real-editor comparison, BFP-positive coexpression and target-site sequence signals increased with editor input, while normalized green output did not increase monotonically.

RAS describes optical reporter activity. AC/INAC-derived RES describes a reference-input equivalent; an absolutely calibrated predicted editing rate remains exploratory. Matched optical and molecular measurements are needed to connect these layers, particularly when reporter/editor conditions change. [SONAR Engineering](/engineering#measure) gives the assay context, and the [Notebook](/notebook) records the experimental chronology.

### Scale 06 — Functional Scale

The current [Results](/results#06-functional-validation-toward-disease-relevant-cellular-effects) include exploratory studies in CCF-STTG1, an astrocytoma-derived line. Planned iPSC-derived astrocytes were unavailable within the project schedule, so the cellular model and its limitations matter to interpretation.

Electroporation was evaluated using mCherry expression, morphology and flow scatter. The fixed FSC/SSC gate fraction is a scatter-based observation; a dedicated viability assay is still needed. Empty-vector treatment also changed the BODIPY appearance relative to untreated cells, making the matched empty-vector comparison essential.

BODIPY analysis found fewer prominent punctate candidates in IO-02 and IO-03 than in the empty-vector field, while mean whole-field fluorescence remained similar. The comparison used **one analyzable confocal field per group**; the segmented objects still need independent identification as lipid droplets. Additional endogenous APOE4 RNA editing was not reliably confirmed. The link between editing, apoE protein function and the observed phenotype therefore remains open, alongside replicated imaging with matched acquisition settings.

The Aβ42 assay measured supernatant signal after exposure. All **72 sample and cell-free reference wells exceeded the highest standard signal**. Preparation review identified a tenfold dilution error: 200-fold was used instead of the planned 2000-fold. The samples were outside the calibrated range, leaving residual Aβ42 concentrations and treatment-dependent clearance differences unresolved. A verified dilution pilot and repeated cellular / cell-free controls are the next steps.

## IV. Decide

### Scale 07 — Treatment Scale

[AAV9 Engineering](/engineering#deliver) progressed from reporter packaging to GFA–ORCA and CMV–ORCA preparations. Initial recipient-cell mCherry tests showed no detectable fluorescence. Later preparations gave genome-qPCR signals, with dilution-dependent estimates, **84.45% amplification efficiency**, late NTC amplification and an undocumented possible pre-extraction dilution affecting precision. Particle integrity and infectivity remain separate questions.

No clear expected ORCA band appeared in treated CCF-STTG1 cDNA. The plasmid PCR reference covered amplification from DNA, leaving RNA-isolation and reverse-transcription performance to be checked. Recipient expression and editing after AAV treatment remain unconfirmed. Electroporation provided an independent route for the preliminary functional studies.

Sustained delivery also raises questions about expression duration and the time required for suppression or shutdown. RNA editing changes a transcript, while the template producing the editor and downstream effects may persist. Long-term distribution, immune effects, repeated exposure and tolerability remain future work; administration to people or animals would require additional studies and the relevant institutional review.

### Scale 08 — Human & Societal Scale

Monitoring, treatment burden, accessibility, cost and uncertainty about long-term effects matter to people receiving care and those supporting them. [Human Practices](/human-practices) provides stakeholder context for these questions.

Treatment-specific benefit and burden remain to be evaluated. Future participant research needs an appropriate consent, privacy and accessibility plan, with changes in project design traced to the discussions that informed them. Patient validation and clinical efficacy remain beyond the experiments reported here.

## V. Security Across the Same Scales

Laboratory security includes access permissions, material accountability and reporting of loss or unauthorized use. Current project-specific access and inventory arrangements await confirmation from institutional records.

For computational work, source data, analysis versions, run settings and limitations connect results to their provenance. The repository distinguishes experimental observations, simulations, heuristic rankings and implemented software. Release review also covers actual capabilities, data flows, foreseeable misuse, credentials, personal information and confidential third-party material. Named team review of the final scientific text and analysis remains part of this workflow.

### People, learning and digital work

**Human Practices.** Conversations and the public survey shaped how we explain treatment burden, alternatives and uncertainty. The current [HP account](/human-practices#1-2-informed-consent-and-proxy-decision-making-designing-multiple-prototype-versions) proposes layered information and prompts for participants to explain key points in their own words. Large-print, audio and assisted-reading formats remain in development. Consent, use of interview quotations or photographs, withdrawal arrangements and participant-data access need project-specific records linked to each activity.

**Education.** The [older-adult workbook](/education#2-3-a-workbook-for-older-learners-involving-users-in-revision) uses pictures, short steps and activity-specific safety reminders. The consent game remains a proposal. Teaching activities also need age-appropriate facilitation, material and activity checks, arrangements for photography and a clear distinction between health education and individual care advice. Supervisor responsibilities and participant / guardian permissions remain to be documented for the relevant sessions.

**Inclusivity.** [TacTune](/inclusivity#tactune) offers visual, tactile and auditory routes to exploring biology. The implemented prototypes support model exploration and calibrated fingertip tracking; sensory distinguishability, audio comfort, setup assistance and reliable use with intended learners remain evaluation priorities. Camera use adds questions about permission, image processing, retention and who can access recordings. A camera-data review and learner-specific evaluation are next steps alongside accessible explanations that do not depend on colour alone.

**Model.** The [Model workflow](/model) records sequencing QC, background filters, provenance and replicate criteria. Candidate prioritization and parameter scans support follow-up choices. Dataset access, versioned inputs and reproducible settings belong with this evidence; biological calibration and uncertainty remain part of interpreting the outputs. Model comparisons guide research questions, while administration decisions require additional biological evidence.

**Software.** The [delivery-model software](/software#rewire), HP mini-app and TacTune prototype have different users and data flows. The delivery interface explores simulations; the HP mini-app includes home observations and care-related features; TacTune includes camera-assisted interaction. A per-tool review needs to trace inputs, storage, transmission, permissions, third-party dependencies and release contents. Privacy, credentials, foreseeable misuse and user-facing limitations should be checked against each implementation before wider use. A completed security audit is a further task to record.

## VI. General Lab Safety

### Facilities and supervision

The latest records include recombinant plasmids, HEK293T and U251 comparisons, SH-SY5Y miRNA assays, CCF-STTG1 culture and electroporation, AAV9 production and recipient-cell testing, ASOs, fluorescence stains and Aβ42 assays. The [Experiment](/experiments) library describes methods; the [Notebook](/notebook) identifies activities and dates.

Current facility coverage, containment, material authentication, training and supervision need to be checked against the applicable institutional records. A change in materials or scope calls for review with the responsible supervisors and safety staff. This review still needs the current facility designation, authorization and training records, together with a fresh check of the project safety-form status and open feedback.

### Biological materials, chemicals and waste

The review covers accidental exposure, contamination, chemical injury, sharps, waste handling and unintended release. Biological materials need documented containment and accountability; chemicals need the relevant Safety Data Sheets and controls; waste streams need assigned responsibilities and approved disposal arrangements. Unexpected events need reporting and supervisor review. The team's current implementation records remain to be linked to these activities.

<section class="safety-register" id="response-register" aria-labelledby="response-register-title">
<span class="sf-kicker">02 / Response register</span>
<h4 id="response-register-title">From a risk to the next experiment</h4>
<p id="response-register-help">Evidence, limits and next steps are visible together. Supporting records follow the table. On narrow screens, scroll horizontally or focus the table and use the arrow keys.</p>
<div class="sf-table-scroll table-shell" role="region" aria-label="Risk and response table" aria-describedby="response-register-help" tabindex="0">
<table>
<caption>Table 1. Measures across eight scales, project workstreams and the laboratory / security requirements shared by them. Next steps are proposed research and review needs.</caption>
<colgroup>
<col style="width:16%">
<col style="width:20%">
<col style="width:24%">
<col style="width:20%">
<col style="width:20%">
</colgroup>
<thead>
<tr>
<th scope="col">Risk / object</th>
<th scope="col">Measure</th>
<th scope="col">Actual evidence / source</th>
<th scope="col">Limit</th>
<th scope="col">Next step</th>
</tr>
</thead>
<tbody>
<tr>
<th scope="row">01 · Unwanted RNA changes</th>
<td>Compare bystanders, read-level edits and RNA-seq candidates.</td>
<td>Targeted sequencing and candidate profiling. <a href="/engineering#integrated-orca">Integrated ORCA</a>; <a href="/engineering#model-rna-seq">RNA-seq</a>.</td>
<td>Coverage and background depend on the sampled regions and conditions.</td>
<td>Validate selected sites independently; document callable coverage.</td>
</tr>
<tr>
<th scope="row">02 · Uneven exposure</th>
<td>Explore distribution and parameter uncertainty.</td>
<td>
<a href="/software#rewire">Whole-body model</a> simulations.</td>
<td>Biological distribution and exposure remain to be calibrated.</td>
<td>Measure transport, expression and persistence.</td>
</tr>
<tr>
<th scope="row">03 · Activity–specificity trade-off</th>
<td>Evaluate integrated editors and their co-editing patterns.</td>
<td>14 combinations evaluated; IO-02 / IO-03 selected across endpoints. <a href="/engineering#integrated-orca">EDIT</a>.</td>
<td>Residual bystanders; protein consequences remain untested.</td>
<td>Compare broader sites, matched activity and protein function.</td>
</tr>
<tr>
<th scope="row">04 · Context / persistence</th>
<td>GFA regulation and tagged-ASO attenuation; MRE excluded, Cre at design stage.</td>
<td>Two-cell-background GFA comparison; tag-dependent ASO suppression. <a href="/engineering#gfa">GFA</a> / <a href="/engineering#aso">ASO</a>.</td>
<td>Broad cellular restriction, complete shutdown and withdrawal recovery remain open.</td>
<td>Resolve assay QC; test relevant cells and RNA/protein time courses.</td>
</tr>
<tr>
<th scope="row">05 · Signal interpretation</th>
<td>Pair optical readouts with molecular assays.</td>
<td>Fluorescence and sequence signals diverged. <a href="/engineering#measure">SONAR</a>.</td>
<td>Absolute fluorescence-to-editing calibration remains incomplete.</td>
<td>Collect matched optical and molecular data.</td>
</tr>
<tr>
<th scope="row">06 · Cellular effects</th>
<td>Use EV / cell-free controls; check acquisition and assay range.</td>
<td>One BODIPY field/group; Aβ42 samples above range. <a href="/results#06-functional-validation-toward-disease-relevant-cellular-effects">Results</a>.</td>
<td>Endogenous correction and causal rescue remain unconfirmed.</td>
<td>Replicate matched imaging; verify editing; repeat ELISA within range.</td>
</tr>
<tr>
<th scope="row">07 · Delivery / exposure</th>
<td>Track production, genomes, recipient expression and editing separately.</td>
<td>Genome qPCR with QC limits; no clear recipient ORCA transcript band. <a href="/engineering#deliver">AAV9</a>.</td>
<td>Functional AAV–ORCA delivery and in-vivo tolerability remain unconfirmed.</td>
<td>Resolve preparation / RNA-assay controls; verify expression and editing.</td>
</tr>
<tr>
<th scope="row">08 · Burden / accessibility</th>
<td>Use stakeholder context to frame future studies.</td>
<td>
<a href="/human-practices">Human Practices</a>; treatment-burden evaluation remains future work.</td>
<td>Patient validation and clinical benefit remain unexplored.</td>
<td>Plan consent, privacy, accessibility and relevant outcomes.</td>
</tr>
<tr>
<th scope="row">Across scales · Lab exposure</th>
<td>Institutional containment, supervision, material and waste controls.</td>
<td>
<a href="/notebook">Notebook</a> identifies activities; implementation records await confirmation.</td>
<td>Current facility, training, authorization and disposal records are not included here.</td>
<td>Confirm applicable records with supervisors and safety staff.</td>
</tr>
<tr>
<th scope="row">Across scales · Security</th>
<td>Material accountability, access control, provenance and release review.</td>
<td>Repository evidence guidance; project-specific access / release records await confirmation.</td>
<td>Technical enforcement and material-accountability records need checking.</td>
<td>Verify permissions, inventory, data flows and review records.</td>
</tr>
<tr><th scope="row">HP · Choice / privacy</th><td>Layered information, voluntary participation and activity-specific permissions.</td><td>Survey / interview communication priorities; consent prototype planned. <a href="/human-practices">HP</a>.</td><td>Effectiveness and linked consent / privacy records remain open.</td><td>Link permissions, withdrawal and data-access records; test comprehension.</td></tr>
<tr><th scope="row">Education · Activity / communication</th><td>Readable instructions, practical safety reminders and appropriate facilitation.</td><td>Revised workbook and activity guidance. <a href="/education">Education</a>.</td><td>Consent game planned; session-specific supervision and media permissions need records.</td><td>Review materials, facilitator roles and participant / guardian arrangements.</td></tr>
<tr><th scope="row">Inclusivity · Access / camera use</th><td>Multiple sensory cues, supported setup and camera-data review.</td><td>TacTune prototypes and learner encounters. <a href="/inclusivity#tactune">Inclusivity</a>.</td><td>Learner reliability, audio comfort and camera-data handling need evaluation.</td><td>Evaluate with intended learners; record image permissions, processing and retention.</td></tr>
<tr><th scope="row">Model · Evidence / reproducibility</th><td>QC, background filtering, versioned data and uncertainty analysis.</td><td>Sequencing workflow and parameter scans. <a href="/model">Model</a>.</td><td>Calibration, dataset-access controls and complete reproducibility records need follow-up.</td><td>Retain versions and run settings; calibrate predictions and document access.</td></tr>
<tr><th scope="row">Software · Data / release</th><td>Trace data flows, permissions, dependencies and intended use per tool.</td><td>Simulation interface, HP mini-app and TacTune implementations. <a href="/software">Software</a>; <a href="/human-practices#2-5-anjia-guardian-a-home-safety-mini-app-designed-for-older-adults">Anjia</a>.</td><td>The tools differ in data sensitivity; a completed security audit is still to be recorded.</td><td>Review privacy, credentials, misuse cases and releases; test access and handling controls.</td></tr>
</tbody>
</table>
</div>
<details class="sf-evidence">
<summary>Source notes · GFA and MRE</summary>
<p>The <a href="/static/notebook/pdfs/Gfa/2026-08-30_Gfa_Promoter_Expression_qPCR_Zhang_Hansen.pdf">30 August GFA record</a> reports the cell-background contrast and editor-NTC limitation. The <a href="/static/notebook/pdfs/MRE/2026-08-29_Mimic_qPCR_Zhang_Hansen.pdf">29 August MRE record</a> reports contamination-background overlap and no resolved MRE-specific mimic effect. Final design decisions and Sanger interpretation are in <a href="/engineering#gfa-cycle-02">GFA Engineering</a> and <a href="/engineering#mre">MRE Engineering</a>.</p>
</details>
<details class="sf-evidence">
<summary>Source notes · ASO and measurement</summary>
<p>The <a href="/static/notebook/pdfs/ASO/2026-10-01_ASO_ORCA_48h_Zhang_Hansen.pdf">1 October ASO record</a> documents 48-hour collection. Editing percentages, culture-well counts and technical averaging are reported in <a href="/engineering#aso-cycle-06">ASO Cycle 6</a>. The <a href="/static/notebook/pdfs/Reporter/2026-09-23_Editor_Gradient_Readout_Zhang_Hansen.pdf">23 September reporter record</a> documents readout acquisition; the comparison with molecular signals is in <a href="/engineering#measure">SONAR Engineering</a>.</p>
</details>
<details class="sf-evidence">
<summary>Source notes · AAV and functional assays</summary>
<p>The <a href="/static/notebook/pdfs/AAV/2026-10-12_ORCA_AAV_Genome_qPCR_Hansen_Zhang.pdf">12 October AAV record</a> reports dilution-dependent estimates and late NTC amplification. The <a href="/static/notebook/pdfs/FV/2026-10-10_CCF_BODIPY_Confocal_Hansen_Zhang_Xueyin_Lu_and_Min_Zhang.pdf">10 October confocal record</a> and <a href="/static/notebook/pdfs/FV/2026-10-13_CCF_Abeta_ELISA_Hansen_Zhang.pdf">13 October ELISA record</a> document acquisition. Sampling limits, dilution-error analysis and endogenous-editing status are reported in <a href="/results#06-functional-validation-toward-disease-relevant-cellular-effects">Results</a>; recipient-cell testing is in <a href="/engineering#deliver">AAV9 Engineering</a>. Raw image, sequencing, plate and preparation files remain the next level of evidence for team review.</p>
</details>
</section>

## VII. ORCA Safety Decision Gate

Before the next experiment, activity or software release, the team can bring together molecular performance, participant experience, accessibility, data handling, measurement quality and the applicable scope of work. A useful record includes the open question, supporting files, responsible reviewer, next action and reason for the decision.

We propose four record categories: **GO, REDESIGN, MORE EVIDENCE REQUIRED or STOP**. The review gate in [Figure 1](#risk-overview) brings together these records; each workstream contributes its own evidence and follow-up actions. Acceptance criteria and authorization remain with the team and supervisors.



## Current Project Evidence

This local review follows Engineering, Results and the Notebook finalized on 17 October 2026. Daily PDFs record the chronology; quantitative and integrated interpretations come from the current project manuscripts, with their assay limitations retained. Supporting links are available in the response register.

- [Engineering](/engineering): tested editor panels, control-module status, AAV9 and SONAR.
- [Results](/results): integrated outcomes and exploratory CCF-STTG1 studies.
- [Notebook](/notebook): finalized experimental records.
- [Model](/model) and [Software](/software): candidate prioritization and simulation assumptions.
- [SONAR](/project-contribution-sonar): measurement layers and interpretation.

Current institutional safety records and the final team review are still needed to complete the project-specific laboratory and security account.
