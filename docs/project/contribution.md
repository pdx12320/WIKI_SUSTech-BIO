---
title: Contribution
subtitle: Tools, evidence and ideas for the next generation of RNA engineering.
eyebrow: Project
---

# Contribution

<div class="contribution-lead">
<p><strong>Build on what we built.</strong> ORCA connects programmable RNA editing, quantitative measurement, computational design and public engagement. Our contribution is a collection of <strong>tools, experimental insights and reusable resources</strong> that carries this work beyond one team.</p>
<p><strong>Wet-lab measurements train and test our models.</strong> <strong>Model outputs focus experimental comparisons.</strong> <strong>SONAR and PUFFER</strong> bring measurement and design into usable workflows, while our <strong>educational resources</strong> make the project accessible beyond the laboratory.</p>
</div>

## SONAR & PUFFER {#sonar-puffer}

### SONAR · Measure with context {#sonar}

<img class="contribution-brand" src="/assets/images/sonar/sap-logo.svg" alt="SONAR — SAP logo" width="485" height="165">

**SONAR connects a modular fluorescence reporter with a complete analysis workflow.** The System for Optical Normalization and Analysis of RNA Editing combines an edit-sensitive green output, a red expression reference and the SONAR Analysis Program (SAP). Reporter experiments supply the observations; SAP carries their controls and analysis context into comparisons that inform the next experimental question.

<div class="contribution-steps">
<div><strong>Design</strong><p>Inspect a target window and the reporter layout in the SAP sequence workspace.</p><a href="#oligo-design">Explore the design example ↓</a></div>
<div><strong>Measure</strong><p>Connect fluorescence files with sample identities, controls and acquisition context.</p><a href="/measurement">Explore the measurement framework →</a></div>
<div><strong>Analyse</strong><p>Carry normalization, reference calibration and export into a single software workflow.</p><a href="#data-analysis">Use SAP ↓</a></div>
</div>

#### Design the signal {#oligo-design}

**The SAP sequence workspace makes design decisions inspectable.** It connects the target coordinate, recognition region and reporter adaptation to generated oligo output. The three application screenshots follow sequence entry, review and export; the interactive views show how those choices map to the reporter architecture.

<div id="sonar-sequence-playground" class="sonar-instrument"><h4>Sequence Playground</h4><p>Explore the recognition region, spacer and response codon in the annotated SAP teaching example.</p></div>

<div class="sonar-screens" data-sap-gallery="design"><p>Actual SAP design walkthrough: enter the target, review the adaptation, then inspect the generated oligos.</p></div>

<div id="sonar-reporter-explorer" class="sonar-instrument"><h4>Reporter Explorer</h4><p>Explore the modular reporter architecture and follow the illustrated relationship between the coding switch and protein output.</p></div>

<details class="sonar-drawer">
<summary>Reporter design and construction resources</summary>
<p><a href="static/sonar-contribution/resources/RP01.pdf">Oligo design · RP01</a> · <a href="static/sonar-contribution/resources/RP02.pdf">Reporter construction · RP02</a> · <a href="static/sonar-contribution/resources/Universal_Reporter_Plasmid.gb">Computational reporter design · GenBank</a></p>
<p><a href="/project-contribution-sonar#step-1">Read the complete design and construction tutorial →</a></p>
</details>

#### Make every measurement traceable {#data-analysis}

**SAP keeps each reported score connected to its measurement context.** Matched controls, population selection, background correction, reference calibration and export form one analysis sequence. Explore the real S7 teaching dataset below, then follow the five application screenshots from experiment setup to results.

<div id="sonar-flow-playground" class="sonar-instrument"><h4>Flow Cytometry Playground</h4><p>Explore the S7 teaching event subset alongside the separately computed full-source reference statistics.</p></div>

<div class="sonar-screens" data-sap-gallery="analysis"><p>Actual SAP Analysis walkthrough: initialize, load matched controls, review the calibration context, add samples and inspect the result.</p></div>

**Two explicit scores make optical comparisons interpretable.** Reporter Activity Score (RAS) quantifies the ratio of background-corrected signal sums; Relative Editing Score (RES) places that response on a matched-reference scale. The layer explorer connects these scores with quality context and paired RNA evidence for molecular calibration.

<div id="sonar-layer-explorer" class="sonar-instrument"><h4>Explore SONAR Layers</h4><p>Follow the measurement framework from population and control context to RAS and reference-calibrated RES.</p></div>

<details class="sonar-drawer">
<summary>Inside the measurement</summary>
<p class="sonar-equation">RAS = Σ(G − bg<sub>G</sub>) / Σ(R − bg<sub>R</sub>)</p>
<p>The two channels are summed over the same selected cells. Keeping the population, controls and source files together makes the reported optical score traceable to its measurement context.</p>
<p><a href="static/sonar-contribution/resources/C04.pdf">Cell preparation · C04</a> · <a href="static/sonar-contribution/resources/RP06.pdf">Flow acquisition · RP06</a> · <a href="/measurement">Explore the complete measurement framework →</a></p>
</details>

#### Put the workflow in other teams’ hands {#sonar-reuse}

**SONAR is available for both guided learning and independent analysis.** Use the browser example to explore the workflow or the desktop application to analyse your own files. Protocols, the computational plasmid, teaching data, source code and the tutorial support adaptation; the guide below helps teams identify which components fit their project.

<div id="sonar-fit-guide" class="sonar-instrument"><h4>Explore SONAR for your project</h4><p>Explore how the molecular sensor, measurement framework and available evidence shape a new application.</p></div>

<div class="sap-start-options">
<section class="sap-start-card sap-start-desktop" id="sap-download" aria-labelledby="sap-desktop-title">
<h3 id="sap-desktop-title">Download SAP</h3>
<p class="sap-start-description">Work with your own data.</p>
<div class="sap-start-downloads"><a class="sap-start-button" href="https://github.com/Hansen614/SONAR-Analysis-Program/releases/download/v1.4.0rc1/SAP-1.4.0rc1-macos-arm64.dmg">Mac <span aria-hidden="true">↓</span></a><a class="sap-start-button" href="https://github.com/Hansen614/SONAR-Analysis-Program/releases/download/v1.4.0rc1/SAP-1.4.0rc1-windows-x64-portable.zip">Windows <span aria-hidden="true">↓</span></a></div>
<small class="sap-start-meta">Mac: M series · macOS 14+ · 283 MB<br>Windows: x64 · 603 MB</small>
<details class="sap-install-help"><summary>Installation notes · v1.4.0rc1 preview</summary><p>Mac: open the DMG and drag SAP to Applications.<br>Windows: extract the ZIP and open SAP/SAP.exe. Keep the whole folder together.</p><p>Windows is unsigned; macOS is not notarized. First launch may be blocked.</p><p><a href="https://github.com/Hansen614/SONAR-Analysis-Program/blob/v1.4.0rc1/packaging/INSTALL.md" target="_blank" rel="noopener">Installation guide ↗</a> · <a href="https://github.com/Hansen614/SONAR-Analysis-Program/releases/tag/v1.4.0rc1" target="_blank" rel="noopener">Release details ↗</a></p></details>
</section>
<section class="sap-start-card sap-start-online" aria-labelledby="sap-online-title">
<h3 id="sap-online-title">Use SAP online</h3>
<p class="sap-start-description">Try the guided example.</p>
<a class="sap-start-button" href="static/sap-demo/index.html#design" target="_blank" rel="noopener">Launch online <span aria-hidden="true">↗</span></a>
<small class="sap-start-meta">Analysis uses example data.<br>Use the desktop app to upload your own files.</small>
</section>
</div>

<div class="contribution-links">
<a href="https://github.com/Hansen614/SONAR-Analysis-Program" target="_blank" rel="noopener">Source code ↗</a>
<a href="/project-contribution-sonar">Read the tutorial →</a>
<a href="/engineering#measure">Follow SONAR’s engineering →</a>
<a href="static/sonar-contribution/data/provenance.json">Explore source records ↗</a>
</div>

### PUFFER · Connect sequence to selection {#puffer}

<img class="contribution-brand" src="/assets/images/puffer/puffer-logo.png" alt="PUFFER logo" width="922" height="227">

**PUFFER turns our computational work into a connected design workspace.** Readers can inspect RNA recognition windows, assemble PUF candidates and organize sequence designs alongside assay records. Its local companion brings assay-informed protein ranking and LAMAR RNA-site prioritization into the same project workflow.

The two analyses answer complementary questions: which protein candidates deserve attention, and which RNA sites deserve closer examination. Their distinct outputs connect molecular design with experimental planning, while saved inputs and exported results preserve the context needed to revisit a decision. The code document below shares the interface, project-data model, analysis integration and software tests.

<div class="contribution-links"><a href="/software#workbench">Explore PUFFER →</a><a href="/software">Software and downloads →</a></div>

<div class="contribution-document">
<details class="contribution-code" data-contribution-document="PUFFER">
<summary><span class="contribution-document-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18"/></svg></span><span class="contribution-document-heading"><span class="contribution-document-label">Read the code</span><span class="contribution-document-title">PUFFER</span></span><span class="contribution-document-toggle" aria-hidden="true"></span></summary>
<div class="contribution-pdf-viewport"></div>
</details>
<a class="contribution-pdf-link contribution-download" href="static/contribution/resources/puffer-code.pdf" download aria-label="Download PUFFER PDF"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-4-4 4 4 4-4M5 16v4h14v-4"/></svg><span>Download</span></a>
</div>

## Wet Experiment {#wet-experiment}

### Precision built through iteration {#precision-through-iteration}

**ORCA established an experimental route from recognition and catalytic design to integrated RNA editors.** PUF recognition comparisons and APOBEC catalytic screens supplied complementary building blocks. Their integration produced editors that retained strong target editing while reducing a monitored bystander signal.

In the reported integrated-editor comparison, IO-02 and IO-03 retained **61.31% and 69.78% C388 editing**, respectively. C871 editing fell from **79.17% in the parental editor to 13.84% and 14.28%**. These results give future teams concrete examples of how recognition and catalytic changes combine at the editor level.

<figure class="contribution-figure">
<a href="/assets/images/results-achievements/edit.png" target="_blank" rel="noopener"><img src="/assets/images/results-achievements/edit.png" alt="Recognition and catalytic design contributions combined in integrated ORCA editors" width="3600" height="2000" loading="lazy"></a>
<figcaption><strong>From component design to integrated performance.</strong> PUF and APOBEC comparisons converge in IO-02 and IO-03. The reported target and bystander measurements connect component-level reasoning to the behavior of complete editors.</figcaption>
</figure>

The same experimental programme established an ASO-responsive regulatory interface: tagged ORCA's C388 editing decreased from **57.13% to 28.54% at the 48-hour readout**. Together, these studies contribute measured examples of specificity engineering and controllable editing.

<div class="contribution-links"><a href="/engineering#integrated-orca-conclusion-from-component-optimization-to-editor-level-selection">Integrated editor evidence →</a><a href="/results">Explore the results →</a></div>

### An experimental foundation others can reuse {#experimental-foundation}

Our contribution extends from individual results to the infrastructure behind them. The **Experiment library** brings methods together under stable identifiers, with browser readers and original PDFs. The **Notebook** connects those methods to dated research records and the sequence of design decisions.

For future teams, this creates a practical starting point: a method library to consult, an experimental chronology to follow, and measured comparisons to inform new questions. These records also support the dry-lab work below. Assay outcomes provide the labels for protein ranking, RNA-seq defines the observed editing landscape, and matched-parent comparisons test structural proposals.

<div class="contribution-links"><a href="/experiments">Browse experimental methods →</a><a href="/notebook">Explore the notebook →</a><a href="/engineering">Follow the engineering cycles →</a></div>

## Dry Model {#dry-model}

**Our modeling innovation connects experimental evidence with decisions across sequence, structure and system scales.** RNA-seq defines the editing landscape; wet-lab measurements train and test protein-ranking models; structural comparisons guide hypotheses that return to experimental evaluation. This exchange produced concrete results: **PUF-ESM recovered 20 of the measured Top30 constructs**, compared with 14 using position-only features, while **LAMAR’s Top20 shortlists captured a supported site in 92.1% of 140 positive test windows**. Together with catalytic-design analysis and delivery simulations, these approaches form a reusable framework for connecting molecular choices to measured and modeled outcomes.

The figures show what the approach revealed; the code readers place the underlying work beside its explanation.

<div class="contribution-document">
<details class="contribution-code" data-contribution-document="Model figures &amp; tables">
<summary><span class="contribution-document-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3v17h17M8 15v-4m5 4V6m5 9V9"/></svg></span><span class="contribution-document-heading"><span class="contribution-document-label">Explore the figures</span><span class="contribution-document-title">Model figures &amp; tables</span></span><span class="contribution-document-toggle" aria-hidden="true"></span></summary>
<div class="contribution-pdf-viewport"></div>
</details>
<a class="contribution-pdf-link contribution-download" href="static/contribution/resources/model-figures.pdf" download aria-label="Download Model figures &amp; tables PDF"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-4-4 4 4 4-4M5 16v4h14v-4"/></svg><span>Download</span></a>
</div>

### Charting the editing landscape {#editing-landscape}

Our transcriptomic workflow turns **36 RNA-seq libraries across nine groups** into a common evidence base for editor comparison. Candidate screening, replicate-level quantification, matched-site comparisons and transcript-oriented sequence contexts connect the experimental library to protein design and RNA-site modeling.

<div class="contribution-summary">
<p class="contribution-summary-label"><strong>Main findings</strong></p>
<ul>
<li><strong>Editing breadth and retained target signal reveal different aspects of specificity.</strong> GVE and SNE showed narrower detected candidate-site profiles than PUF12 while retaining target-associated signals.</li>
<li><strong>PUF12 expanded both site recruitment and activity at shared sites.</strong> It showed higher rates at 73.1% of the 2,221 sites retained by both PUF10 and PUF12.</li>
<li><strong>Local sequence patterns connect recognition and catalysis.</strong> Conserved motifs across PUF variants support a shared catalytic sequence preference, while recognition changes reshape the recruited site set.</li>
</ul>
<p class="contribution-summary-label"><strong>What we contribute to the community</strong></p>
<ul>
<li><strong>A common analysis foundation.</strong> The workflow organizes 36 libraries across nine groups into screened candidate sites, replicate-level measurements and transcript-oriented sequence contexts. Site tables and sequence contexts supply experimental evidence for recognition analysis, catalytic comparisons and RNA-site prioritization. The shared code includes counting, exports, configuration and environment definitions.</li>
<li><strong>A reusable comparison strategy.</strong> Matched-site analysis and callable-cytosine normalization let teams compare activity, site breadth and chromosome distribution within a consistent framework.</li>
</ul>
</div>

<div class="contribution-document">
<details class="contribution-code" data-contribution-document="Transcriptomic Landscape">
<summary><span class="contribution-document-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18"/></svg></span><span class="contribution-document-heading"><span class="contribution-document-label">Read the code</span><span class="contribution-document-title">Transcriptomic Landscape</span></span><span class="contribution-document-toggle" aria-hidden="true"></span></summary>
<div class="contribution-pdf-viewport"></div>
</details>
<a class="contribution-pdf-link contribution-download" href="static/contribution/resources/transcriptomic-landscape-code.pdf" download aria-label="Download Transcriptomic Landscape PDF"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-4-4 4 4 4-4M5 16v4h14v-4"/></svg><span>Download</span></a>
</div>

<div class="contribution-links"><a href="/model#module1-1">Explore this model’s overview →</a></div>

### Learning the language of recognition {#recognition-intelligence}

**PUF-ESM connects protein language-model representations with experimental specificity measurements.** It combines ESM-2 sequence information and mutation identity with assay-informed regression. The resulting ranking brings target activity and monitored bystander editing into one selection criterion. Structure-conditioned generation adds a complementary route for expanding the candidate library.

<div class="contribution-summary">
<p class="contribution-summary-label"><strong>Main findings</strong></p>
<ul>
<li><strong>Sequence-aware prediction enriched the experimental shortlist.</strong> In grouped evaluation of 66 constructs, PUF-ESM recovered 20 of the measured Top30, above the random expectation of 13.64 and the 14 recovered using position-only features. The comparison identifies amino-acid information as a useful contribution to candidate selection.</li>
<li><strong>Ranking and generation serve complementary design goals.</strong> Assay-informed prediction prioritizes candidates, while structure-conditioned generation expands the recognition and scaffold-sequence library.</li>
</ul>
<p class="contribution-summary-label"><strong>What we contribute to the community</strong></p>
<ul>
<li><strong>An assay-informed protein-ranking approach.</strong> Future teams can connect protein language-model features with their experimental readouts and assess the target–bystander balance in one workflow.</li>
<li><strong>Evaluation tied to experimental effort.</strong> Grouped predictions, Top-K recovery and feature ablations show how many measured high-performing constructs enter a fixed-size screening panel.</li>
<li><strong>Implementation material beside the evidence.</strong> Prediction code, example input and expected output, and ablation scripts make the ranking workflow available for inspection and adaptation.</li>
</ul>
</div>

<div class="contribution-document">
<details class="contribution-code" data-contribution-document="Recognition Code">
<summary><span class="contribution-document-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18"/></svg></span><span class="contribution-document-heading"><span class="contribution-document-label">Read the code</span><span class="contribution-document-title">Recognition Code</span></span><span class="contribution-document-toggle" aria-hidden="true"></span></summary>
<div class="contribution-pdf-viewport"></div>
</details>
<a class="contribution-pdf-link contribution-download" href="static/contribution/resources/recognition-code.pdf" download aria-label="Download Recognition Code PDF"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-4-4 4 4 4-4M5 16v4h14v-4"/></svg><span>Download</span></a>
</div>

<div class="contribution-links"><a href="/model#module2-1">Explore this model’s overview →</a></div>

### Resolving the activity–selectivity frontier {#catalytic-frontier}

**Our catalytic-design framework connects protein–RNA structural comparisons with experimental selection.** Contact decomposition and parent-corrected contact profiles organize structural hypotheses. Wet-lab readouts then evaluate substrate preference and retained target activity together, feeding measured outcomes back into combination design.

<div class="contribution-summary">
<p class="contribution-summary-label"><strong>Main findings</strong></p>
<ul>
<li><strong>Joint selection identified a balanced lead.</strong> The combination screen produced a candidate with a 2.156 preference ratio and 0.773 activity retention, meeting both criteria in the same assay batch.</li>
<li><strong>Experimental feedback resolved the activity–preference trade-off.</strong> Single-variant measurements informed combination design, and the measured Pareto frontier exposed the strongest balances between the two objectives.</li>
<li><strong>Measured outcomes add information beyond structural similarity.</strong> Matched-parent assays distinguished the activities of structurally similar variants and determined which candidates advanced.</li>
</ul>
<p class="contribution-summary-label"><strong>What we contribute to the community</strong></p>
<ul>
<li><strong>A framework that connects structure with experiment.</strong> Contact decomposition and parent-corrected profiles organize molecular hypotheses; experimental readouts determine their measured value. The shared implementation covers structural contacts, matched experimental comparisons and scientific audits, preserving the connection between calculations and wet-lab evidence.</li>
<li><strong>A transparent way to compare candidates.</strong> Same-batch parental references, separate activity and preference readouts, and Pareto-frontier plots make candidate selection inspectable.</li>
</ul>
</div>

<div class="contribution-document">
<details class="contribution-code" data-contribution-document="Catalytic Design">
<summary><span class="contribution-document-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18"/></svg></span><span class="contribution-document-heading"><span class="contribution-document-label">Read the code</span><span class="contribution-document-title">Catalytic Design</span></span><span class="contribution-document-toggle" aria-hidden="true"></span></summary>
<div class="contribution-pdf-viewport"></div>
</details>
<a class="contribution-pdf-link contribution-download" href="static/contribution/resources/catalytic-design-code.pdf" download aria-label="Download Catalytic Design PDF"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-4-4 4 4 4-4M5 16v4h14v-4"/></svg><span>Download</span></a>
</div>

<div class="contribution-links"><a href="/model#module3-1">Explore this model’s overview →</a></div>

### Focusing the RNA search space {#rna-prioritization}

**Our LAMAR workflow connects transcriptome-scale evidence with local RNA-site ranking.** We adapted an RNA foundation-model workflow around human transcripts, regional assessment and cytidine-centered prioritization. RNA-seq-derived labels carry experimental evidence into the sequence representation and its evaluation.

<div class="contribution-summary">
<p class="contribution-summary-label"><strong>Main findings</strong></p>
<ul>
<li><strong>Shortlists captured supported RNA sites.</strong> Across 140 positive test windows, Top10 and Top20 lists contained at least one supported site in 77.9% and 92.1% of windows, respectively.</li>
<li><strong>Pretrained representations supported regional screening.</strong> The original frozen LAMAR encoder achieved the strongest validation performance among the compared regional-model configurations.</li>
</ul>
<p class="contribution-summary-label"><strong>What we contribute to the community</strong></p>
<ul>
<li><strong>A two-stage RNA analysis strategy.</strong> Regional assessment and local cytidine ranking connect broad transcript screening with focused experimental shortlists.</li>
<li><strong>A path from RNA-seq evidence to sequence modeling.</strong> Experimental site labels, transcript-oriented contexts and human-transcript adaptation connect measured editing patterns with RNA representations.</li>
<li><strong>Evaluation that makes screening effort explicit.</strong> Hit@K and Recall@K connect the number of cytidines examined with window-level success and supported-site recovery. Training and evaluation scripts, configuration, tokenizer resources and repository validation accompany the reported results.</li>
</ul>
</div>

<div class="contribution-document">
<details class="contribution-code" data-contribution-document="LAMAR">
<summary><span class="contribution-document-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18"/></svg></span><span class="contribution-document-heading"><span class="contribution-document-label">Read the code</span><span class="contribution-document-title">LAMAR</span></span><span class="contribution-document-toggle" aria-hidden="true"></span></summary>
<div class="contribution-pdf-viewport"></div>
</details>
<a class="contribution-pdf-link contribution-download" href="static/contribution/resources/lamar-code.pdf" download aria-label="Download LAMAR PDF"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-4-4 4 4 4-4M5 16v4h14v-4"/></svg><span>Download</span></a>
</div>

<div class="contribution-links"><a href="/model#module4-1">Explore this model’s overview →</a></div>

### Connecting delivery to RNA outcomes {#delivery-dynamics}

**Delivery Dynamics extends the project from molecular comparisons to system behavior.** The framework links distribution, barrier transport, cellular expression and multisite RNA reactions. Compartmental modeling and spatial simulations connect editor exposure with the composition and distribution of RNA products.

<div class="contribution-summary">
<p class="contribution-summary-label"><strong>Main findings</strong></p>
<ul>
<li><strong>Product composition revealed an intermediate peak.</strong> The simulations showed the intended RNA product reaching a maximum at an intermediate modeled input, with the product mixture changing across scenarios. The connected model traced how exposure and expression influence simulated RNA product composition.</li>
<li><strong>Spatial coverage added a distinct system-level result.</strong> Tissue simulations showed persistent differences in coverage, complementing the compartment-level time courses.</li>
</ul>
<p class="contribution-summary-label"><strong>What we contribute to the community</strong></p>
<ul>
<li><strong>A connected multiscale framework.</strong> Distribution, barrier transport, expression and RNA reactions are represented within one computational structure.</li>
<li><strong>Outputs that connect scales.</strong> Time courses, product mixtures and spatial coverage provide complementary ways to inspect the consequences of the model assumptions. Model components, configuration, analysis scripts and tests are shared together, giving future teams an inspectable foundation for comparative modeling.</li>
</ul>
</div>

<div class="contribution-document">
<details class="contribution-code" data-contribution-document="Delivery Dynamics">
<summary><span class="contribution-document-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18"/></svg></span><span class="contribution-document-heading"><span class="contribution-document-label">Read the code</span><span class="contribution-document-title">Delivery Dynamics</span></span><span class="contribution-document-toggle" aria-hidden="true"></span></summary>
<div class="contribution-pdf-viewport"></div>
</details>
<a class="contribution-pdf-link contribution-download" href="static/contribution/resources/delivery-dynamics-code.pdf" download aria-label="Download Delivery Dynamics PDF"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-4-4 4 4 4-4M5 16v4h14v-4"/></svg><span>Download</span></a>
</div>

<div class="contribution-links"><a href="/software#rewire-purpose">Explore this model’s overview →</a></div>

## HP {#hp}

### Turn listening into design {#listening-into-design}

**Our Human Practices work connects research decisions with the people affected by them.** Conversations across clinical care, research and older-adult services brought treatment burden, evidence, choice and daily care into ORCA's design process. The stakeholder map and interview records make those connections visible.

This contributes a way of working that other teams can adopt: identify whose experience matters, record what they said, and show how it changes the project. For ORCA, that process connected molecular engineering with questions about practical use and shaped how we explain the science.

<div class="contribution-links"><a href="/human-practices">Explore the stakeholder-to-design journey →</a></div>

### Knowledge that travels {#knowledge-that-travels}

**We developed educational resources that other teams can adapt and share.** The revised *Practical Healthy Living Workbook for Older Adults* combines short lessons, illustrations and space for personal notes. Feedback from older learners informed the move toward clearer pages and everyday use; Chinese and English editions extend its reach.

Our team also designed brain and animal-cell teaching models, printed in collaboration with the SUSTech 3D Printing Club. Their shapes and textures supported hands-on conversations about biology. The shared STL files let educators bring the same tangible approach into new classrooms and community activities.

<figure class="contribution-figure">
<a href="/assets/human-practices/images/biology-models-printing-collage.webp" target="_blank" rel="noopener"><img src="/assets/human-practices/images/biology-models-printing-collage.webp" alt="Brain and cell teaching models produced with the SUSTech 3D Printing Club" loading="lazy"></a>
<figcaption><strong>Reusable resources for learning together.</strong> Team-designed brain and cell models turn invisible structures into objects that learners can hold, examine and discuss.</figcaption>
</figure>

<div class="contribution-links">
<a href="/assets/human-practices/attachments/older-adults-health-workbook-v2-zh.docx">Chinese handbook · editable</a>
<a href="/assets/human-practices/attachments/older-adults-health-workbook-v2-en.docx">English handbook · editable</a>
<a href="/assets/human-practices/models/biology-brain-model.stl.zip">Brain model · STL</a>
<a href="/assets/human-practices/models/biology-animal-cell-model.stl.zip">Cell model · STL</a>
</div>

### Carry the work forward {#carry-the-work-forward}

Team exchanges, shared educational activities and community events made ORCA part of a wider conversation. Our education records preserve the formats, materials and lessons from that work, giving future teams concrete starting points for their own engagement.

Together, these contributions connect a laboratory question to tools others can use: measurement software, experimental records, computational workflows and educational materials. We share the reasoning alongside the resources so that the next team can build its own questions on a clear foundation.

<div class="contribution-links"><a href="/education">Explore education and team exchanges →</a><a href="/inclusivity">Explore inclusive design →</a></div>
