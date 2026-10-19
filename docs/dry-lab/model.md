---
title: Model
heading: ORCA model overview
subtitle: Connecting measured editing profiles, protein design and off-target site prioritization in the ORCA project.
eyebrow: Dry Lab · Four Modules
---

<div class="model-opening-quote">
<p>Finding the intended signal,<br>quieting the echoes beyond.</p>
</div>

ORCA integrates **transcriptome-wide off-target analysis, protein foundation models, structural modeling, generative modeling, RNA foundation models and ODE modeling** into a multiscale framework for editor design and evaluation. Together, these approaches connect wet-lab evidence with molecular design, candidate prioritization and delivery dynamics.

<ol class="model-result-links" aria-label="Model summaries and overview links">
<li><a href="#module1-1"><span class="result-number">①</span> <strong>Transcriptomic Landscape</strong></a><p>Module 1 combines transcriptome-wide RNA-seq profiling with target-signal comparison. GVE and SNE showed <strong>narrower detected editing profiles</strong>, while other variants lost activity alongside fewer sites. Joint analysis separated promising recognition changes from a general reduction in editing.</p></li>
<li><a href="#module2-1"><span class="result-number">②</span> <strong>Recognition Code</strong></a><p>Module 2 combines protein foundation-model ranking with structure-conditioned sequence generation. Model-guided testing identified <strong>improved target–bystander balance</strong>, and assay-informed ranking enriched higher-specificity candidates. Generated scaffold-sequence variants broadened the design library available for subsequent wet-lab work.</p></li>
<li><a href="#module3-1"><span class="result-number">③</span> <strong>Catalytic Design</strong></a><p>Module 3 links protein–RNA structural models with experimental feedback. Combination screening identified <strong>a lead balancing preference and activity</strong>. Matched comparisons established how residue choices and sequence background shape reporter performance, connecting structural hypotheses with measured catalytic behavior.</p></li>
<li><a href="#module4-1"><span class="result-number">④</span> <strong>LAMAR</strong></a><p>Module 4 adapts the LAMAR RNA foundation model for region assessment and cytidine ranking. It placed supported editing sites near the top of many positive test windows, producing <strong>focused RNA-site shortlists</strong>. Sequence-context comparisons also distinguished editor-specific flanking profiles.</p></li>
<li><a href="/software#rewire-purpose"><span class="result-number">⑤</span> <strong>Delivery Dynamics</strong></a><p>Delivery Dynamics couples whole-body ODEs with spatial simulations. Dose scans identified an intermediate peak in intended product, while spatial simulations identified persistent differences in tissue coverage. The framework identified <strong>delivery and expression as key determinants</strong> of product composition and tissue coverage.</p></li>
</ol>
