# WORLDPROOF Project Track Briefs and Constraint Cards

> **Build it. Break it. Fix it.**

## Instructions for Use

The following material is compiled from the WORLDPROOF Project Track Announcement. Each brief includes three Constraint Cards; organisers may issue one of them to each team at the event. Teams must record the card they receive and suggestions from other teams in their Change Log. During revision, they must explain which challenges they prioritised, why they made the corresponding design decisions, and which issues remain unresolved.

---

## Scenario 1: Riverlight | Living Pollution Sentinels for Urban Waters

### 1. News Motivation

In February 2023, a Norfolk Southern train carrying hazardous chemicals derailed in East Palestine, Ohio. To prevent an explosion, emergency responders carried out a controlled burn of vinyl chloride, releasing highly toxic phosgene and hydrogen chloride. Large quantities of chemicals entered tributaries of the Ohio River, contaminating approximately 270 miles of downstream waterways and causing fish deaths. During the incident, the state government repeatedly stressed that drinking water was safe, but water testing funded by the railway company was criticised by the public as “hasty and opaque.” Residents remained unable to obtain timely, credible, independent monitoring data for an extended period.

Although this incident did not involve living sensors, it sharply raised a general question: when a major environmental risk occurs, can the public access consistent, interpretable, traceable monitoring information in real time?

### 2. Background

A coastal city plans to deploy contained living biosensors at wastewater outlets to detect heavy metals and industrial pollutants. The sensors can produce readable signals. Residents are concerned about the presence of engineered organisms near public waters.

### 3. Core Conflict

The value of environmental early warning versus biocontainment, false alarms, public trust, and responsibility across jurisdictions.

### 4. Stakeholders

Environmental authorities, equipment operators, downstream residents, fishing communities, and ecologists.

### 5. Possible Demo Examples

A sensor status map, a pollution signal classification tool, a public warning system, sample transfer records, and an incident response platform.

### 6. Reality Check Examples

A natural disaster takes some equipment offline; positive signals near certain areas, such as schools, cannot be reproduced; media coverage claims that the sensors themselves have polluted the river.

### Constraint Cards

#### R1 | No Data Does Not Mean Safety

Heavy rain takes 40% of the sensors offline, including devices near two schools. The public page still displays green, leading residents to believe that the water is safe.

**The team must address:** How can the demo distinguish between “normal readings,” “missing data,” and “equipment failure”? Who receives offline alerts, and when should conclusions stop being published or manual sampling begin?

#### R2 | Test Results Conflict

A living sensor at one location triggers two consecutive alerts, but an independent laboratory's test result is negative. The laboratory result arrives six hours after the sensor result.

**The team must address:** How can the demo show the conflicting data, their sources, and the time difference together? Who has authority to issue or withdraw an alert, and how can the public see the uncertainty in the conclusions?

#### R3 | Pollution Crosses Administrative Boundaries

A pollution signal travels downstream into a neighbouring city, but the two cities use different warning thresholds and information release procedures. Neither party is willing to take final responsibility for a cross-jurisdictional alert.

**The team must address:** How can the demo support a handover across jurisdictions, preserve records of responsibility, and prevent the public from receiving contradictory information?

---

## Scenario 2: FieldShift | Engineered Microbes for Farmland

### 1. News Motivation

From 2024 to 2025, agricultural microbial companies such as Pivot Bio promoted nitrogen-fixing microbial products on a large scale in North America. However, continuing coverage by agricultural media found that the products' performance varied considerably across soil types, weather conditions, and individual plots. Some farmers reported that their investment had not delivered the expected benefits of reduced chemical fertiliser use, creating widespread uncertainty about “when and where deployment is worthwhile.” Meanwhile, nearby organic farms raised concerns about microbial dispersal beyond the trial plots.

This news points directly to a core issue that inevitably arises when engineered soil microbes move from trial fields into commercial use across multiple plots: who is responsible for explaining uncertainty in performance? If a product has unknown ecological effects on neighbouring, non-target plots, such as organic farmland, how should monitoring boundaries and the responsibilities of the parties involved be defined?

### 2. Background

An arid farming region is considering engineered soil microbes that could reduce chemical fertiliser inputs. Results differ significantly between trial fields, and nearby organic farms did not participate in the original decision.

### 3. Core Conflict

Agricultural benefits versus ecological uncertainty, effects across plot boundaries, farmers' autonomy, and long-term monitoring.

### 4. Stakeholders

Smallholder farmers, agricultural cooperatives, neighbouring organic farms, local regulators, and ecologists.

### 5. Possible Demo Examples

A deployment eligibility checker, a geofenced monitoring map, a farmer consent process, seasonal risk estimates, and a complaints and compensation platform.

### 6. Reality Check Examples

Extreme weather expands the expected area of impact; monitoring costs cannot be covered after the pilot ends; unexplained changes in yield occur on neighbouring farms.

### Constraint Cards

#### F1 | A Neighbouring Farm Withdraws Consent

The trial has already started, but a neighbouring organic farm fears losing its certification. It formally requests to leave the monitoring programme and prohibits staff from entering its land to take samples.

**The team must address:** How can the demo record changes in consent, adjust deployment boundaries, and continue to identify and address effects across plot boundaries when neighbouring land cannot be accessed?

#### F2 | The Area of Impact Extends Beyond the Geofence

An extreme wind and rain event expands the originally estimated area of impact, but the pilot budget can fund only 30 days of monitoring.

**The team must address:** How can the demo redefine the monitoring area, prioritise sampling, and explain arrangements for withdrawal, suspension, or long-term responsibility after the pilot ends?

#### F3 | Different Plots Lead to Opposing Conclusions

Crop yields rise and chemical fertiliser use falls in one soil type, while yields fall in another. The cooperative still wants to issue one deployment recommendation to all farmers.

**The team must address:** How can the demo avoid one-size-fits-all recommendations, explain the conditions for use and the uncertainty to farmers, and support them in deciding for themselves whether to deploy?

---

## Scenario 3: FermentOS | Distributed Biomanufacturing

### 1. News Motivation

From 2024 to 2025, the precision fermentation industry underwent severe upheaval. On one hand, companies such as Liberation Labs announced investments of more than US$115 million to build new, large-scale fermentation plants. On the other, industry pioneer Perfect Day was sued by its Italian contract manufacturer, Olon, for as much as US$112 million in unpaid processing fees, exposing uncontrolled costs during process scale-up. Industry analysis noted that the accumulation of strain mutations, contamination risks, and raw-material supply bottlenecks, especially sugar sources, were much more severe than expected when moving from laboratory batch production to continuous industrial production at multiple locations.

The news revealed an underestimated “valley of death” between being “able to produce” in the laboratory and achieving continuous, stable, traceable production at multiple sites. When standardised engineered strains are deployed across distributed factories with uneven equipment, staff training, and network conditions, how can issues such as batch consistency, data integrity, and supply-chain responsibility be addressed?

### 2. Background

Small fermentation facilities in several cities use standardised engineered strains to produce high-value food ingredients, but equipment, staff training, and network conditions vary between sites.

### 3. Core Conflict

Manufacturing at scale versus batch consistency, human error, data integrity, cybersecurity, and supply-chain responsibility.

### 4. Stakeholders

Factory operators, quality managers, raw-material purchasers, software platform providers, and food regulators.

### 5. Possible Demo Examples

A batch anomaly dashboard, digital batch passports, an operational checking system, an offline alert system, a supply-chain tracking system, and a recall coordination platform.

### 6. Reality Check Examples

A software update changes thresholds without clear notification; two factories submit conflicting batch records; the cloud platform goes down during a contamination investigation.

### Constraint Cards

#### FM1 | A Factory Is Offline for 18 Hours

A factory loses its internet connection for 18 hours and can only record data locally. After the connection is restored, timestamps and batch statuses in local records do not match those in the cloud.

**The team must address:** How can the demo support safe offline operations, mark unsynchronised data, and resolve conflicts after reconnection without compromising the audit trail?

#### FM2 | Products Have Already Left the Factory After a Threshold Update

A software update changes anomaly thresholds without notifying the quality manager. Three factories are affected, and one batch has already been shipped.

**The team must address:** How can the demo track rule versions, identify affected batches, and support decisions about rollback, quarantine, or recall?

#### FM3 | An Employee Is Afraid to Report a Near Miss

An operator notices that they may have entered the wrong raw-material batch number but does not report it immediately for fear of punishment. Similar near misses may recur at other factories.

**The team must address:** How can the demo make reporting easier, protect the reporter, trigger review, and turn one incident into improvements that other factories can learn from?

---

## Scenario 4: ClinicNow | Cell-Free Diagnostics in Low-Resource Settings

### 1. News Motivation

In 2024, the World Health Organization (WHO) added an mpox in vitro diagnostic product to its Emergency Use Listing for the first time and urgently invited manufacturers worldwide to submit tests for use in low-resource settings. However, alongside news of prequalification approval, the international community also stressed the severe shortage of supporting cold chains, stable networks, and trained frontline staff in regions such as Africa. Many test results lost their value because they could not be correctly interpreted or connected to follow-up care.

This news moves a technical issue into a more complex real-world context: once a diagnostic result is available, who is responsible for explaining its uncertainty? Can the result be correctly understood and connected to the next stage of care?

### 2. Background

A cell-free diagnostic kit is being piloted in rural clinics. Network access, cold chains, languages, and staffing often differ between regions, and tests can produce indeterminate results and false positives.

### 3. Core Conflict

Rapid access to testing versus misinterpretation of results, unequal access to follow-up healthcare, privacy, and reliance on automated recommendations.

### 4. Stakeholders

Community healthcare workers, people being tested, regional hospitals, kit distributors, and public health authorities.

### 5. Possible Demo Examples

A result interpretation system, offline decision support, a referral coordination platform, an uncertainty visualisation system, a multilingual process for informing participants, and an inventory and quality-control system.

### 6. Reality Check Examples

Referral services suddenly become overloaded because of an unexpected event; a translated version changes the meaning of some indeterminate results; clinics begin using the product in populations for which it has not been validated.

### Constraint Cards

#### C1 | Translation Turns “Indeterminate” into “Negative”

The local-language version mistranslates “indeterminate result” as “negative,” and 60 people who were tested have already received incorrect information.

**The team must address:** How can the demo correct the translation, identify and contact affected people, retain version records, and prevent the old version from remaining in use on offline devices?

#### C2 | The Referral System Suddenly Reaches Capacity

The regional hospital informs clinics that it cannot accept new routine referrals for the next 72 hours, but the pilot continues to produce positive and indeterminate results.

**The team must address:** How can the demo prioritise cases without making dangerous automated diagnoses, explain the risks of waiting, and provide next steps for frontline staff and people being tested?

#### C3 | People Being Tested Have No Private Devices

Many people being tested can only share a family phone, and network access is unstable. Sending test results directly could expose private information, but relying entirely on an online system would delay follow-up.

**The team must address:** How can the demo obtain consent for communication, support offline work, and let people choose safe ways to receive results and arrange referrals?

---

## Scenario 5: ProBio Home | Consumer-Grade Programmable Probiotics

### 1. News Motivation

In October 2023, the US FDA issued a strong safety warning after a premature infant developed invasive sepsis and died following the use of a probiotic product in a neonatal intensive care unit (NICU). The probiotic product had not been approved as a drug, yet the hospital used it as a dietary supplement in vulnerable patients in violation of regulations. The FDA explicitly warned that such products pose life-threatening risks to premature infants and people with weakened immune systems.

This news exposes major hazards in real-world use of consumer-grade live microbial products: defining who they are suitable for and monitoring adverse events after marketing. When programmable probiotics are sold directly to consumers through pharmacies and online channels, how can correct consumer use be ensured?

### 2. Background

A company plans to sell programmable probiotics through pharmacies and online. Consumers may combine them with medicines, exchange products, or misunderstand how long the engineered microbes remain active in the body.

### 3. Core Conflict

Consumer access versus improper use, exaggerated claims, duration of effects, privacy, and post-market monitoring.

### 4. Stakeholders

Consumers, pharmacists, doctors, the product company, and consumer rights organisations.

### 5. Possible Demo Examples

A suitability and contraindication checking process, an adverse-event reporting system, evidence labels, usage records, a promotional claims verification tool, and a product recall system.

### 6. Reality Check Examples

An online influencer markets unapproved benefits; users begin exchanging personalised products; adverse-event reports contain contradictory information.

### Constraint Cards

#### P1 | A High-Risk User Bypasses the Pharmacist

An immunocompromised consumer buys the product online without consulting a pharmacist or doctor and plans to use it alongside prescription medicines.

**The team must address:** How can the demo identify high-risk use, explain contraindications clearly, and guide the user to pause use and seek professional help?

#### P2 | A Personalised Product Is Passed On to Someone Else

An online influencer encourages followers to exchange “personalised” products and promotes unapproved benefits. The original purchasers and batch numbers of some products can no longer be identified.

**The team must address:** How can the demo verify promotional claims, prevent or warn against passing products on to others, and support notification or recall when traceability information is incomplete?

#### P3 | Adverse-Event Reports Contradict One Another

The platform receives several anonymous adverse-event reports in one day, but the symptoms, batches, and times of use are inconsistent. The company wants to collect more identifying information, while consumer rights organisations are concerned about privacy violations.

**The team must address:** How can the demo validate signals and merge duplicate reports while protecting privacy, and make clear when an investigation should be escalated or sales suspended?

---

## Scenario 6: Mossback | Urban Engineered Photosynthetic Carbon-Capture Facilities

### 1. News Motivation

In 2022, London startup Brilliant Planet announced plans for large-scale carbon capture using algae, claiming costs of only one-tenth those of direct air capture. The announcement received widespread coverage in global technology and environmental media.

However, the coverage also brought intense debate: algae cultivation requires vast areas of land or sea, large amounts of freshwater, and energy inputs. A US Department of Energy report indicated that actual production costs could exceed US$1,300 per tonne. Full life-cycle benefits cannot be captured by a single figure for “how much carbon was captured.”

The news motivation is to ask whether a visible climate innovation could become a tool for “greenwashing.” Does the innovation process focus only on the single metric of “how much carbon was captured,” while overlooking full life-cycle costs and the boundaries of public claims?

### 2. Background

A city installs contained facilities using engineered photosynthetic organisms in public spaces for carbon capture and environmental data display. Maintenance is outsourced, and the actual climate benefits of individual installations are difficult to explain accurately.

### 3. Core Conflict

Visible climate innovation versus greenwashing, maintenance failure, full life-cycle impacts, consent for use of public space, and misleading metrics.

### 4. Stakeholders

The city's sustainability department, maintenance contractors, local residents, climate scientists, and public-interest journalists.

### 5. Possible Demo Examples

A full life-cycle impact dashboard, maintenance and containment records, a public claims verification tool, a community feedback map, a procurement audit system, and a performance comparison tool.

### 6. Reality Check Examples

The facilities' energy use offsets most of their benefits; maintenance records are incomplete; the city promotes predicted performance as observed results.

### Constraint Cards

#### M1 | Energy Use Offsets the Carbon Benefit

Sustained high temperatures sharply increase electricity use for cooling the facilities. Estimates show that energy use offsets 80% of the carbon-capture benefit, but public displays still show only “total capture.”

**The team must address:** How can the demo present net benefits, data assumptions, and uncertainty? Under what conditions should operating intensity be reduced, the facilities paused, or claims of climate benefit stopped?

#### M2 | Six Weeks of Maintenance Records Are Missing

The contractor has not submitted maintenance records for six weeks, but the sensors still show that the facilities are operating normally. The city cannot confirm whether the data are reliable.

**The team must address:** How can the demo mark data credibility, track maintenance responsibility, and limit public display or trigger inspections when evidence is insufficient?

#### M3 | Predictions Are Presented as Measurements

The city's publicity department describes model predictions of annual emissions reductions as achievements already realised and asks for uncertainty notices to be removed from the public page.

**The team must address:** How can the demo distinguish predictions from measurements, retain records of publicity versions, and support corrections and transparent explanations to the public?

---

## Scenario 7: ClearCoast | Coastal Pollution Bioremediation

### 1. News Motivation

In July 2020, the Japanese cargo ship Wakashio ran aground on a reef in Mauritius, spilling approximately 1,000 tonnes of fuel oil and causing devastating damage to local coral reef and mangrove ecosystems. More than 5,000 volunteers responded spontaneously, filling net bags with sugarcane straw and donating hair to make oil-absorbing booms. Community participation became the most moving part of the international news coverage.

However, the accident also exposed a governance vacuum: slow official response, opaque information, and no coordination of ecological impacts across jurisdictions. Taking this fictional competition brief a step further—“what if the emergency response included an engineered bioremediation system?”—raises a new question: how should decisions about use, suspension, or long-term monitoring be made when evidence is incomplete?

### 2. Background

After a coastal spill, the authorities consider using a contained engineered bioremediation system. Pressure for a rapid response conflicts with incomplete ecological evidence and the livelihoods of fishing communities.

### 3. Core Conflict

The speed of emergency response versus environmental uncertainty, evidence transparency, community participation, and long-term responsibility.

### 4. Stakeholders

Emergency commanders, fishing cooperatives, environmental organisations, remediation service providers, and marine scientists.

### 5. Possible Demo Examples

An emergency response simulator, an evidence and uncertainty map, a sampling dashboard, community reporting channels, a Go/Pause/Stop decision tool, and a long-term monitoring registry.

### 6. Reality Check Examples

The service provider's data conflict with those of an independent laboratory; the polluted area crosses administrative boundaries; pollutant levels fall in the short term, but other ecological indicators deteriorate.

### Constraint Cards

#### CC1 | A Decision Must Be Made Within Two Hours

The remediation service provider reports that pollutant concentrations are rising, while an independent laboratory considers the change insignificant. In two hours, the tide will carry the pollution into another bay.

**The team must address:** How can the demo support Go/Pause/Stop decisions under conflicting data and time pressure, make clear who has decision-making authority, and record which evidence was used?

#### CC2 | Pollution Crosses Jurisdictions, and Fishing Bans Affect Livelihoods

The polluted area spans two administrative jurisdictions. One is preparing to ban fishing, while the other refuses to take the same measure. Fishing communities demand to know who will bear the losses.

**The team must address:** How can the demo coordinate information across jurisdictions, explain different decisions to communities, and record responsibilities for notification, appeals, and compensation?

#### CC3 | Pollutants Decline While Ecological Indicators Worsen

After remediation begins, the concentration of the target pollutant falls, but dissolved oxygen and one biodiversity indicator continue to deteriorate.

**The team must address:** How can the demo avoid relying on a single success metric and trigger reassessment, suspension, or long-term monitoring?

---

## Scenario 8: OpenBench | Public and Community Biology Laboratories

### 1. News Motivation

In October 2017, former NASA biochemist Josiah Zayner livestreamed himself injecting CRISPR-edited DNA into his arm in San Francisco. The act quickly attracted global attention. Reporting brought the tensions between DIY biology, autonomous personal experimentation, and biosafety governance into public view, triggering an international debate about “who has the right to conduct biological experiments” and “whether personal enthusiasm can replace safety training.”

This incident is not presented as encouragement for self-experimentation. It does, however, raise a core challenge for the community laboratory model: while maintaining “open participation” to engage public interest, how can laboratories avoid stigmatising public involvement and still establish tiered training, project review, and mechanisms for learning from incidents?

### 2. Background

A city-funded community laboratory offers synthetic biology courses, shared equipment, and project mentoring. It wants to remain open without allowing safety procedures to become barriers that exclude beginners.

### 3. Core Conflict

Open participation versus training quality, project review, dual-use risks, privacy, and fair access.

### 4. Stakeholders

First-time participants, experienced community biology enthusiasts, laboratory managers, funders, and biosafety reviewers.

### 5. Possible Demo Examples

A tiered onboarding system, preliminary project risk screening, equipment access management, an incident learning platform, a mentor matching tool, and an accessible safety training game.

### 6. Reality Check Examples

A participant omits important project information; a punitive incident reporting system discourages others from reporting near misses; automated risk scoring disproportionately blocks beginners.

### Constraint Cards

#### O1 | Project Submission Information Is Incomplete

A new participant omits information important to risk assessment from a project submission. The system has already automatically approved their access to some shared equipment.

**The team must address:** How can the demo detect information gaps, suspend inappropriate permissions, and use tiered mentoring to help the participant complete the submission rather than exclude them outright?

#### O2 | Punitive Rules Suppress Reporting

A participant anonymously reports a near miss, but the current rules could result in suspension of their membership. Others consequently become unwilling to report similar problems voluntarily.

**The team must address:** How can the demo protect good-faith reporters, distinguish learning from accountability, and turn incidents into safety improvements that can be shared?

#### O3 | Automated Scoring Is Unfair to Beginners

Review data show that automated risk scoring blocks beginners and non-native speakers more often, even when their submitted projects are similar to those of other participants.

**The team must address:** How can the demo detect these differences, provide human review and appeals, and maintain fair access while protecting safety?
