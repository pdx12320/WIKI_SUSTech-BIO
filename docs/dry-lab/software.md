---
title: Software
heading: Delivery Dynamics
subtitle: Whole-body delivery modeling and PUFFER.
figures:
- title: Delivery-to-editing model
  file: 14_full_model_workflow
  panels: 1
  section: overview
  width: 1400
  height: 580
  alt: Seven process icons connect administration, tissue distribution, BBB transport, cellular expression, APOE editing, unintended editing and comparison.
  caption: 'Transport and expression connect the administered input to APOE editing and three unwanted-editing pathways. AAV means adeno-associated virus. BBB means blood–brain barrier; ODEs are ordinary differential equations describing changes over time. Read left to right: delivery sets editor exposure, expression supplies active protein, and competing reactions determine the RNA product mixture. The same chain lets us trace a change in dose to both intended editing and unwanted products.'
  number: 1
- title: 'Dose response: editing and specificity'
  file: 01_dose_response-01
  panels: 4
  section: dose
  width: 972
  height: 716
  alt: 'Dose response: editing and specificity. APOE RNA fraction, 168 h; On-target editing rate; Off-target burden;
    Specificity index'
  caption: 'A: APOE product fractions at 168 h. B–D: on-target editing, off-target burden and specificity. Coarse and fine scan values are retained; thresholds are model criteria. The horizontal dose axis is logarithmic. Panel B counts both APOE3-like and APOE2-like products, whereas panel A separates them. APOE3-like RNA peaks at an intermediate dose and then falls as APOE2-like RNA accumulates: product composition identifies the intermediate-dose advantage.'
  number: 4
- title: 'Dose response: exposure and feasibility'
  file: 01_dose_response-02
  panels: 4
  section: dose
  width: 972
  height: 716
  alt: 'Dose response: exposure and feasibility. Liver AUC (model units); Blood Cmax (model units); Peak brain expression;
    On-target editing rate'
  caption: 'A–C: liver exposure, peak blood concentration and peak brain expression. AUC is area under the concentration–time curve; Cmax is peak concentration. D: the original feasibility classification, using source model units and criteria. Read exposure alongside editing, rather than selecting the highest-editing dose alone. The dose scan exposes a trade-off across the joint criteria, prioritizing improved delivery and selectivity to balance intended yield with exposure and unwanted editing.'
  number: 5
- title: APOE product trajectories
  file: 02_trajectories_and_uncertainty-01
  panels: 2
  section: trajectories
  width: 972
  height: 428
  alt: APOE product trajectories. Dose 0.5; Dose 2
  caption: 'A, dose 0.5; B, dose 2.0. Both trajectories span 168 h. Fractions use the total APOE RNA pool. Follow each RNA state over time: APOE4 is the starting pool, APOE3-like has the residue-112 edit, APOE2-like has both 112/158 edits, and 158-only carries the other edit alone. Comparing the panels shows how higher exposure shifts product composition through sequential editing.'
  number: 6
- title: Parameter uncertainty
  file: 02_trajectories_and_uncertainty-02
  panels: 4
  section: uncertainty
  width: 972
  height: 716
  alt: Uncertainty across frozen parameter samples. APOE3-like fraction; Specificity index; LDLR-binding risk proxy;
    Off-target burden
  caption: 'Two hundred parameter samples for 10R-proapobec at dose 0.9 and 168 h. Shading spans the 5th–95th percentiles; lines mark medians and model criteria. Each histogram counts parameter samples by their predicted output; the spread shows sensitivity to uncertain parameters. The APOE3-like fraction varies widely even at fixed dose, making its yield less stable across sampled assumptions than a single baseline trajectory suggests. LDLR is the low-density lipoprotein receptor; its binding-risk proxy here is the modeled APOE2-like fraction.'
  number: 7
- title: Sensitivity, design, and spatial comparisons
  file: 03_sensitivity_design_spatial-01
  panels: 4
  section: comparisons
  width: 972
  height: 716
  alt: Sensitivity, design, and spatial comparisons. Local sensitivity; Design comparison at 72 h; Distance from
    vessel; Cell-type comparison
  caption: 'A: local sensitivity after a 20% parameter increase (scale 1.2). B: the 72-hour design comparison. C–D: spatial summary means by vessel distance and cell type. In A, negative sensitivity means reduced specificity. In B, upper-left positions combine more APOE3-like with less APOE2-like RNA; marker area represents unwanted-edit burden, and L/M/H mark dose categories. Designs 1–4 denote 10R-proapobec, 10R-design-4, 10R-dual-site and 8R-design-2; R counts PUF repeats. In C, near-vessel cells remain more strongly edited across doses, identifying tissue coverage as a distinct delivery objective.'
  number: 8
- title: Benchmark checks B1–B4
  file: 04_benchmark_scorecard-01
  panels: 4
  section: comparisons
  width: 972
  height: 716
  alt: Benchmark checks B1–B4. B1 · PASS; B2 · PASS; B3 · PASS; B4 · PARTIAL
  caption: 'Teal and orange indicate the supplied target bands. Each panel uses its own numeric scale. B1/B2 test inactive-deaminase and PUF-only controls; B3 checks preferred-design editing; B4 compares editing at offsets +7 and +2. Read each model value against its own band. The partial B4 result separates the captured control behavior from the incompletely reproduced positional effect.'
  number: 9
- title: Benchmark checks B5–B8
  file: 04_benchmark_scorecard-02
  panels: 4
  section: comparisons
  width: 972
  height: 716
  alt: Benchmark checks B5–B8. B5 · FAIL; B6 · PASS; B7 · PASS; B8 · PASS
  caption: 'The motif-ratio comparison fails its supplied criterion. B6 retains the full value, 460.937. B8 uses the original time-course criterion. B5 compares UC- and CC-context editing; B6 compares mismatched-PUF burden for 8- versus 10-repeat designs; B7 compares background at two doses; B8 checks editing at residue 112 over time. The scorecard exposes a specific mismatch in motif preference alongside the behaviors reproduced by the model.'
  number: 10
- title: Absorption states and uptake
  file: 05_module1-01
  panels: 4
  section: 05_module1
  width: 972
  height: 716
  alt: Absorption states and uptake. A_dep; A_lymph; A_blood; to_lymph
  caption: 'A–C: AAV amounts in the administration depot (A_dep), lymph (A_lymph) and blood (A_blood). D: depot-to-lymph transfer rate. Fluxes describe amounts transferred per unit time. Read A–C as stored material and D as flow: the depot supplies circulation through the lymphatic route, with timing and magnitude distinguished from the amount present.'
  number: 11
- title: Absorption fluxes
  file: 05_module1-02
  panels: 3
  section: 05_module1
  width: 972
  height: 716
  alt: Absorption fluxes. to_blood; local_loss; lymph_to_blood
  caption: 'A: direct transfer from depot to blood. B: local loss at the depot. C: lymph-to-blood transfer. Compare the uptake routes with local loss to see where material leaving the depot goes; leaving the depot does not imply that all of it reaches blood.'
  number: 12
- title: Distribution profiles
  file: 06_module2-01
  panels: 4
  section: 06_module2
  width: 972
  height: 716
  alt: Distribution profiles. A_blood; A_liver; A_peripheral; A_brain_blood
  caption: 'A–D: AAV amounts in blood, liver, peripheral tissue and brain circulation. A denotes the amount in each model compartment. Compare peak timing and persistence across compartments to follow redistribution. Brain-circulation material is upstream of barrier crossing and is distinct from delivery into brain cells.'
  number: 13
- title: Distribution and clearance
  file: 06_module2-02
  panels: 4
  section: 06_module2
  width: 972
  height: 716
  alt: Distribution and clearance. A_cleared; blood_to_liver; blood_to_peripheral; blood_to_brain
  caption: 'A: cumulative cleared material. B–D: transfer rates from blood into liver, peripheral tissue and brain circulation. The cumulative cleared pool records material lost over time, while B–D show instantaneous transfer rates. Together these separate tissue uptake from material permanently removed from circulation.'
  number: 14
- title: Return and clearance fluxes
  file: 06_module2-03
  panels: 4
  section: 06_module2
  width: 972
  height: 716
  alt: Return and clearance fluxes. liver_to_blood; peripheral_to_blood; brain_to_blood; clear_blood
  caption: 'A–C: return rates from liver, peripheral tissue and brain circulation to blood. D: clearance from blood. Return fluxes recycle material into circulation, whereas clearance removes it. These competing routes help explain the rise and fall of tissue amounts in Figure 13.'
  number: 15
- title: Clearance fluxes
  file: 06_module2-04
  panels: 3
  section: 06_module2
  width: 972
  height: 716
  alt: Clearance fluxes. clear_liver; clear_peripheral; clear_brainblood
  caption: 'A–C: clearance rates from liver, peripheral tissue and brain circulation. These loss routes contribute to the cumulative cleared pool in Figure 14; their values are rates, rather than amounts currently stored in each tissue.'
  number: 16
- title: Blood–brain barrier states
  file: 07_module3-01
  panels: 4
  section: 07_module3
  width: 972
  height: 716
  alt: Blood–brain barrier states. A_brain_blood; A_brain_EC; A_brain_endo; A_brain_ISF
  caption: 'A–D: AAV amounts in brain blood, the endothelial compartment (EC), endosomes (endo) and interstitial fluid (ISF), tracing blood–brain barrier transport. Progression through these compartments distinguishes arrival at brain vessels from release beyond the barrier. The ISF pool is the extracellular source available for subsequent brain-cell uptake.'
  number: 17
- title: Blood–brain barrier transport
  file: 07_module3-02
  panels: 4
  section: 07_module3
  width: 972
  height: 716
  alt: Blood–brain barrier transport. brainblood_to_EC; EC_to_endo; EC_to_brainblood; endo_to_ISF
  caption: 'A: uptake from brain blood into the endothelial compartment. B: endosomal entry. C: return to blood. D: endosomal release into interstitial fluid. Compare forward transport with the return route: endothelial uptake can either progress toward tissue release or recycle to blood. Successful uptake is therefore only one step in the delivery chain.'
  number: 18
- title: Blood–brain barrier return and loss
  file: 07_module3-03
  panels: 3
  section: 07_module3
  width: 972
  height: 716
  alt: Blood–brain barrier return and loss. endo_to_brainblood; endo_loss; clear_ISF
  caption: 'A: endosomal return to brain blood. B: endosomal loss. C: clearance from interstitial fluid (ISF). These branches account for material that does not remain available in tissue. Read them alongside forward release in Figure 18 to understand the competing fates at the barrier.'
  number: 19
- title: Cellular delivery states
  file: 08_module4-01
  panels: 4
  section: 08_module4
  width: 972
  height: 716
  alt: Cellular delivery states. A_brain_ISF; A_brain_cell; A_brain_nuc; mRNA_brain
  caption: 'A–C: AAV amounts in interstitial fluid, brain cells and nuclei. D: editor messenger RNA (mRNA_brain). The sequence connects extracellular availability to nuclear delivery and transcription. mRNA is an expression output, so its rise need not coincide with the peak vector amount.'
  number: 20
- title: Expression and delivery fluxes
  file: 08_module4-02
  panels: 4
  section: 08_module4
  width: 972
  height: 716
  alt: Expression and delivery fluxes. P_brain; ISF_to_cell; cell_to_nuc; cell_loss
  caption: 'A: active editor protein in brain cells (P_brain). B: uptake from interstitial fluid. C: nuclear entry. D: intracellular vector loss. The protein trace is the editor supply used by the RNA-reaction model. Its timing reflects both upstream delivery and the expression/degradation processes detailed in Figures 22–23.'
  number: 21
- title: Expression and degradation fluxes
  file: 08_module4-03
  panels: 4
  section: 08_module4
  width: 972
  height: 716
  alt: Expression and degradation fluxes. deg_v; tx; deg_m; tl
  caption: 'A: nuclear vector degradation (deg_v). B: transcription (tx). C: messenger-RNA degradation (deg_m). D: translation into editor protein (tl). Compare transcription with mRNA loss, and translation with protein loss in Figure 23. Their balance explains persistence of editor expression after the delivery input changes.'
  number: 22
- title: Protein degradation
  file: 08_module4-04
  panels: 1
  section: 08_module4
  width: 540
  height: 378
  alt: Protein degradation. deg_p
  caption: 'Editor-protein degradation rate (deg_p), removing active protein from the brain-cell compartment. Read this loss together with translation in Figure 22: protein abundance reflects production minus removal, rather than the translation rate alone.'
  number: 23
- title: APOE editing states
  file: 09_module5_states-01
  panels: 4
  section: 09_module5_states
  width: 972
  height: 716
  alt: APOE editing states. P_brain; S_APOE4; S_APOE3_like; S_APOE2_like
  caption: 'A: active editor protein. B–D: APOE4, APOE3-like and APOE2-like RNA pools. The latter two correspond to editing at the residue-112 codon and at both residue-112/158 codons. Read the intended APOE3-like pool separately from APOE2-like accumulation. A decline in starting APOE4 RNA can feed either product, so total conversion alone does not specify the outcome.'
  number: 24
- title: Bystander and background states
  file: 09_module5_states-02
  panels: 4
  section: 09_module5_states
  width: 972
  height: 716
  alt: Bystander and background states. S_APOE158_only; B_local_bystander; S_puf_off; E_puf_off
  caption: 'A: RNA edited only at the residue-158 codon. B: local bystander burden. C–D: unedited and edited RNA pools associated with mismatched PUF recognition. The panels separate editing of the other APOE site from local bystander events and mismatched-recognition editing. This identifies distinct contributors that would be hidden in one aggregate burden.'
  number: 25
- title: Substrate and complex states
  file: 09_module5_states-03
  panels: 4
  section: 09_module5_states
  width: 972
  height: 716
  alt: Substrate and complex states. S_deaminase_bg; E_deaminase_bg; S_on; S_off
  caption: 'A–B: unedited and edited RNA pools from deaminase-background activity. C–D: unedited on-target (S_on) and off-target (S_off) substrate pools. These pools supply separate reaction branches. Comparing remaining substrate with edited product helps distinguish substrate availability from accumulation of unwanted edits.'
  number: 26
- title: Complex and product states
  file: 09_module5_states-04
  panels: 4
  section: 09_module5_states
  width: 972
  height: 716
  alt: Complex and product states. ES_on; ES_off; E_on; E_off
  caption: 'A–B: editor–RNA complexes for on-target and off-target substrates (ES_on/ES_off). C–D: accumulated edited products (E_on/E_off); E here labels products, not free enzyme. Bound complexes are reaction intermediates; edited products accumulate after catalysis. Their different trajectories connect binding dynamics to the editing summary without treating binding itself as successful editing.'
  number: 27
- title: Editing efficiency and specificity
  file: 10_module5_metrics-01
  panels: 4
  section: 10_module5_metrics
  width: 972
  height: 716
  alt: Editing efficiency and specificity. on_target_editing_rate; off_target_burden; specificity_index; off_target_editing_fraction
  caption: 'A: on-target editing rate. B: total unwanted-editing burden. C: model specificity index. D: off-target editing fraction. These readouts separate desired yield from unintended editing. Here on-target editing includes both APOE3-like and APOE2-like products. The specificity index divides that combined yield by accumulated unwanted-edit outputs. Read Figure 29 alongside these metrics to identify how much of the yield remains the intended APOE3-like product.'
  number: 28
- title: APOE product fractions
  file: 10_module5_metrics-02
  panels: 4
  section: 10_module5_metrics
  width: 972
  height: 716
  alt: APOE product fractions. apoe4_fraction; apoe3_like_fraction; apoe2_like_fraction; mixed_edit_fraction
  caption: 'A–C: APOE4, APOE3-like and APOE2-like fractions of the RNA pool. D: the mixed-edit fraction, retained as defined in the source model. Compare the intended APOE3-like fraction with APOE2-like accumulation to distinguish the first desired edit from additional conversion. All fractions use the model’s total free and bound APOE RNA pool.'
  number: 29
- title: Off-target burden components
  file: 10_module5_metrics-03
  panels: 3
  section: 10_module5_metrics
  width: 972
  height: 716
  alt: Off-target burden components. local_bystander_burden; puf_mismatch_burden; deaminase_background_burden
  caption: 'A–C: unwanted editing from local bystanders, mismatched PUF recognition and deaminase-background activity. The separate traces identify which unwanted-edit pathway contributes to the aggregate burden. They share the APOE-pool normalization used for the summary metric.'
  number: 30
- title: APOE production and degradation
  file: 11_module5_fluxes_a-01
  panels: 4
  section: 11_module5_fluxes_a
  width: 972
  height: 716
  alt: APOE production and degradation. prod_apoe; deg_apoe4; deg_apoe3_like; deg_apoe2_like
  caption: 'A: production of APOE RNA. B–D: degradation of APOE4, APOE3-like and APOE2-like RNA states. Production replenishes substrate while degradation removes each RNA state. These turnover processes allow product amounts to change even when an editing flux is small.'
  number: 31
- title: Site 112 editing fluxes
  file: 11_module5_fluxes_a-02
  panels: 4
  section: 11_module5_fluxes_a
  width: 972
  height: 716
  alt: Site 112 editing fluxes. deg_apoe158_only; bind112; unbind112; edit112
  caption: 'A: degradation of the 158-only RNA state. B–D: editor binding, dissociation and editing at the residue-112 codon. Labels 112/158 refer to APOE amino-acid positions, not RNA nucleotide indices. Binding creates the reaction complex, dissociation returns RNA without editing, and catalysis generates the edited state. Comparing the three fluxes separates encounter frequency from completed conversion.'
  number: 32
- title: Site 158 editing fluxes
  file: 11_module5_fluxes_a-03
  panels: 4
  section: 11_module5_fluxes_a
  width: 972
  height: 716
  alt: Site 158 editing fluxes. bind158; unbind158; edit158; bind158_after112
  caption: 'A–C: binding, dissociation and editing at the residue-158 codon. D: binding at 158 after the residue-112 codon has been edited. The final panel starts the second-edit route from the already edited APOE3-like state, linking continued editor exposure to loss of that intended product.'
  number: 33
- title: Sequential editing flux
  file: 11_module5_fluxes_a-04
  panels: 1
  section: 11_module5_fluxes_a
  width: 540
  height: 378
  alt: Sequential editing flux. unbind158_after112
  caption: 'Editor dissociation from the residue-158 site after editing at the residue-112 codon (unbind158_after112). This route competes with the second catalytic edit: dissociation releases the bound RNA without adding the residue-158 change. The corresponding editing flux appears in Figure 35A.'
  number: 34
- title: Sequential editing fluxes
  file: 12_module5_fluxes_b-01
  panels: 4
  section: 12_module5_fluxes_b
  width: 972
  height: 716
  alt: Sequential editing fluxes. edit158_after112; bind112_after158; unbind112_after158; edit112_after158
  caption: 'A: editing at 158 after editing at 112. B–D: binding, dissociation and editing at 112 after editing at 158. These fluxes distinguish the two editing orders. Both orders can reach the doubly edited APOE2-like state. The separate traces reveal whether that product arises through consumption of APOE3-like RNA or through the 158-only intermediate.'
  number: 35
- title: Bystander and mismatch fluxes
  file: 12_module5_fluxes_b-02
  panels: 4
  section: 12_module5_fluxes_b
  width: 972
  height: 716
  alt: Bystander and mismatch fluxes. local_bystander; prod_puf_off; deg_puf_off; bind_puf_off
  caption: 'A: local bystander editing. B–C: production and degradation of mismatched-PUF RNA substrates. D: editor binding to that off-target pool. These processes distinguish local editing near the intended target from reactions after mismatched PUF recognition. Compare them with their accumulated burdens in Figure 30.'
  number: 36
- title: Mismatch and background fluxes
  file: 12_module5_fluxes_b-03
  panels: 4
  section: 12_module5_fluxes_b
  width: 972
  height: 716
  alt: Mismatch and background fluxes. unbind_puf_off; edit_puf_off; prod_deaminase_bg; deg_deaminase_bg
  caption: 'A–B: dissociation and editing of mismatched-PUF substrates. C–D: production and degradation of deaminase-background RNA substrates. Dissociation competes with catalytic conversion in the mismatch branch. The background-substrate production and loss terms support a separate, deaminase-associated source of unwanted edits.'
  number: 37
- title: Background editing flux
  file: 12_module5_fluxes_b-04
  panels: 1
  section: 12_module5_fluxes_b
  width: 540
  height: 378
  alt: Background editing flux. edit_deaminase_bg
  caption: 'Editing flux through the deaminase-background pathway (edit_deaminase_bg), tracked separately from PUF-associated off-target editing. Its time integral contributes to accumulated background products; the instantaneous rate and accumulated burden therefore describe different aspects of the same pathway.'
  number: 38
- title: Earlier model trajectories
  file: 13_legacy_notebook-01
  panels: 4
  section: 13_legacy_notebook
  width: 972
  height: 716
  alt: Legacy notebook trajectories. Legacy NB01; Legacy NB02; Legacy NB03; Legacy NB05
  caption: 'Four distinct trajectories from the original single-pool notebook model. A shows enzyme production; B follows enzyme, substrate, complex and product concentrations; C shows editing fraction; D shows editing rate. Comparing C and D distinguishes an accumulated fraction from the speed at which editing occurs.'
  number: 39
- title: Earlier model accumulation and parameter scan
  file: 13_legacy_notebook-02
  panels: 2
  section: 13_legacy_notebook
  width: 972
  height: 378
  alt: Legacy accumulation and parameter grid. Legacy NB06; Legacy NB07
  caption: 'A, accumulated editing. B, the original 20 × 20 parameter grid. These outputs belong to the earlier model. In B, columns vary maximum expression (u_max), rows vary catalytic rate (k_cat), and color encodes the final editing fraction. The grid separates two parameter effects within the simplified model; it does not include the later multisite product trade-off.'
  number: 40
figure_groups:
- id: 05_module1
  title: Absorption
  count: 2
  description: Depot and lymphatic uptake connect the administered input to circulating material.
- id: 06_module2
  title: Systemic distribution
  count: 4
  description: Tissue exchange and clearance determine the material available to the brain circulation.
- id: 07_module3
  title: Blood–brain barrier transport
  count: 3
  description: Endothelial uptake, endosomal processing and return compete with release into interstitial space.
- id: 08_module4
  title: Intracellular expression
  count: 4
  description: Cell entry and nuclear delivery precede transcription, translation and degradation.
- id: 09_module5_states
  title: RNA substrates and products
  count: 4
  description: Substrate, complex and product pools expose the states behind the editing summaries.
- id: 10_module5_metrics
  title: Editing yield and specificity
  count: 3
  description: Product fractions and unwanted-editing burdens are evaluated together.
- id: 11_module5_fluxes_a
  title: Binding and catalytic fluxes
  count: 4
  description: Production, degradation and site-specific reactions control the RNA-state transitions.
- id: 12_module5_fluxes_b
  title: Sequential and unwanted editing
  count: 4
  description: Sequential editing, bystanders, mismatched binding and background activity contribute distinct fluxes.
- id: 13_legacy_notebook
  title: Earlier model
  count: 2
  description: The original notebook uses a simplified editing scheme and is kept separate from the multisite model.
rewire_references:
- Han, W. et al. Programmable RNA base editing with a single gRNA-free enzyme. Nucleic Acids Research 50, 9580–9595
  (2022). https://doi.org/10.1093/nar/gkac713.
- Liu, S. et al. Whole-Body Disposition and Physiologically Based Pharmacokinetic Modeling of Adeno-Associated Viruses
  and the Transgene Product. Journal of Pharmaceutical Sciences 113, 141–157 (2024). https://doi.org/10.1016/j.xphs.2023.10.005.
- Wang, X., McLachlan, J., Zamore, P. D. & Hall, T. M. T. Modular recognition of RNA by a human Pumilio-homology
  domain. Cell 110, 501–512 (2002). https://doi.org/10.1016/S0092-8674(02)00873-5.
- Weisgraber, K. H., Rall, S. C., Jr. & Mahley, R. W. Human E apoprotein heterogeneity. Cysteine-arginine interchanges
  in the amino acid sequence of the apo-E isoforms. Journal of Biological Chemistry 256, 9077–9083 (1981). https://doi.org/10.1016/S0021-9258(19)52510-8.
- Grünewald, J. et al. Transcriptome-wide off-target RNA editing induced by CRISPR-guided DNA base editors. Nature
  569, 433–437 (2019). https://doi.org/10.1038/s41586-019-1161-z.
- 'Virtanen, P. et al. SciPy 1.0: fundamental algorithms for scientific computing in Python. Nature Methods 17,
  261–272 (2020). https://doi.org/10.1038/s41592-019-0686-2.'
- 'Ghaffarizadeh, A. et al. PhysiCell: An open source physics-based cell simulator for 3-D multicellular systems. PLOS Computational Biology 14, e1005991 (2018). https://doi.org/10.1371/journal.pcbi.1005991.'
- 'Ghaffarizadeh, A., Friedman, S. H. & Macklin, P. BioFVM: an efficient, parallelized diffusive transport solver for 3-D biological simulations. Bioinformatics 32, 1256–1258 (2016). https://doi.org/10.1093/bioinformatics/btv730.'
workbench_references:
- Wang, X., McLachlan, J., Zamore, P. D. & Hall, T. M. T. Modular recognition of RNA by a human Pumilio-homology
  domain. Cell 110, 501–512 (2002). https://doi.org/10.1016/S0092-8674(02)00873-5.
- Zhou, W. et al. Expanding the binding specificity for RNA recognition by a PUF domain. Nature Communications 12,
  5107 (2021). https://doi.org/10.1038/s41467-021-25433-6.
- Lin, Z. et al. Evolutionary-scale prediction of atomic-level protein structure with a language model. Science
  379, 1123–1130 (2023). https://doi.org/10.1126/science.ade2574.
- 'Hoerl, A. E. & Kennard, R. W. Ridge Regression: Biased Estimation for Nonorthogonal Problems. Technometrics 12,
  55–67 (1970). https://doi.org/10.1080/00401706.1970.10488634.'
- Zhou, H. et al. A foundation language model to decipher diverse regulation of RNAs. Genome Biology 26, 301 (2025).
  https://doi.org/10.1186/s13059-025-03752-x.
---

# Software

## Following the Delivery Journey

<p class="model-story-term">Delivery Dynamics · Whole-body ODE and spatial simulation</p>
