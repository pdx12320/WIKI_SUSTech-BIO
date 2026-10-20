---
title: Results
subtitle: Progress, shared tools and the ORCA journey
eyebrow: Project
header_introduction: >-
  Our work on RNA editing for Alzheimer’s disease brought experiments, models
  and Human Practices into one shared effort. We improved editor candidates,
  investigated control and delivery, and built tools for measurement and reuse.
  Here, we bring together the progress we made, the limits our evidence revealed,
  and the experiences that shaped our next questions.
---

# Results

## Platform Achievements

<section class="results-achievements" aria-label="Six platform achievements">
  <article class="achievement-card edit" aria-labelledby="edit-title">
    <a class="card-figure" href="/assets/images/results-achievements/edit.png" data-enlarge aria-label="Enlarge Edit summary figure"><img src="/assets/images/results-achievements/edit.png" alt="POD recognition candidates and CETUS catalytic candidates combine into Integrated ORCA editors IO-02 and IO-03." width="3600" height="2000"></a>
    <div class="card-copy"><h3 id="edit-title">Keep the edit. Reduce the bystanders.</h3>
      <p class="card-description">IO-02 and IO-03 retained 61.31% and 69.78% C388 editing, respectively, while reducing C871 editing from 79.17% in the parental editor to 13.84% and 14.28%. Their broader bystander profiles offered complementary choices.</p>
      <p class="card-takeaway"><em>The complete editing profile guided candidate selection.</em></p>
    </div>
  </article>

  <article class="achievement-card control" aria-labelledby="control-title">
    <a class="card-figure" href="/assets/images/results-achievements/control.png" data-enlarge aria-label="Enlarge Control summary figure"><img src="/assets/images/results-achievements/control.png" alt="G.M.A.C. regulatory approaches: GFA and ASO tested, MRE constructed without confirmed specific regulation, Cre–loxP designed." width="3600" height="2800"></a>
    <div class="card-copy"><h3 id="control-title">Turn editing down on demand.</h3>
      <p class="card-description">ASO treatment reduced C388 editing in tagged ORCA from 57.13% to 28.54% at the 48-hour readout. The gfaABC1D promoter also showed cell-context-dependent expression, providing a second route to regulate ORCA.</p>
      <p class="card-takeaway"><em>ASO-dependent suppression was demonstrated; recovery after withdrawal remains untested.</em></p>
    </div>
  </article>

  <article class="achievement-card deliver" aria-labelledby="deliver-title">
    <a class="card-figure" href="/assets/images/engineering-conclusions/deliver.png" data-enlarge aria-label="Enlarge Deliver summary figure"><img src="/assets/images/engineering-conclusions/deliver.png" alt="AAV9 workflow progresses through reporter production, ORCA packaging and recipient-cell testing; ORCA expression remains unconfirmed." width="3600" height="2041"></a>
    <div class="card-copy"><h3 id="deliver-title">From vector to delivery testing.</h3>
      <p class="card-description">We constructed and packaged GFA–ORCA and CMV–ORCA AAV9 vectors, then tested the GFA–ORCA preparation in CCF-STTG1 cells. The recipient-cell assay did not detect a clear ORCA transcript band.</p>
      <p class="card-takeaway"><em>Production and testing workflows are in place; functional delivery remains unconfirmed.</em></p>
    </div>
  </article>

  <article class="achievement-card measure" aria-labelledby="measure-title">
    <a class="card-figure" href="/assets/images/engineering-conclusions/measure.png" data-enlarge aria-label="Enlarge Measure summary figure"><img src="/assets/images/engineering-conclusions/measure.png" alt="SONAR connects modular reporter engineering, relative calibration, SAP and real-editor tests; PER is not yet validated." width="3600" height="2000"></a>
    <div class="card-copy"><h3 id="measure-title">Read beyond the glow.</h3>
      <p class="card-description">SONAR connects a modular reporter with relative optical scores and the SAP analysis workflow. Real-editor tests showed that increasing the molecular editing signal did not produce a corresponding rise in normalized green fluorescence.</p>
      <p class="card-takeaway"><em>Reporter activity and RNA editing percentage require distinct evidence.</em></p>
    </div>
  </article>

  <article class="achievement-card model" aria-labelledby="model-title">
    <a class="card-figure" href="/assets/images/engineering-conclusions/model.png" data-enlarge aria-label="Enlarge Model summary figure"><img src="/assets/images/engineering-conclusions/model.png" alt="PUFFER connects RNA-seq analysis, PUF specificity ranking, catalytic design, LAMAR site prioritization and delivery simulations." width="3600" height="2840"></a>
    <div class="card-copy"><h3 id="model-title">Narrow the search. Guide the next test.</h3>
      <p class="card-description">The PUF specificity ranker recovered 20 of the measured Top30 candidates in a grouped evaluation of 66 constructs. Together with RNA-seq analysis, LAMAR and delivery simulations, this work helped prioritize candidates and questions for experimental testing.</p>
      <p class="card-takeaway"><em>Predictions guide validation; their performance is bounded by the evaluated data.</em></p>
    </div>
  </article>

  <article class="achievement-card fv" aria-labelledby="fv-title">
    <a class="card-figure" href="/assets/images/engineering-conclusions/functional-validation.png" data-enlarge aria-label="Enlarge Functional Validation summary figure"><img src="/assets/images/engineering-conclusions/functional-validation.png" alt="CCF-STTG1 studies establish provisional electroporation conditions and explore BODIPY imaging and Aβ42 ELISA, with limited phenotypic evidence." width="2880" height="1920"></a>
    <div class="card-copy"><h3 id="fv-title">Testing ORCA beyond the reporter.</h3>
      <p class="card-description">We established provisional electroporation conditions in CCF-STTG1 cells and explored lipid-associated imaging and extracellular Aβ42 measurement. Limited imaging replication and out-of-range ELISA samples defined the requirements for the next experiments.</p>
      <p class="card-takeaway"><em>These studies begin cellular evaluation; they do not yet establish causal functional rescue.</em></p>
    </div>
  </article>
</section>

## SONAR Spotlight

<p class="sonar-introduction">SONAR connects <strong>reporter Engineering, a Measurement framework, and reusable resources shared through Contribution</strong>. Together, they turn an experimental reporter into a workflow that other teams can understand, adapt and test.</p>

<figure class="sonar-system" aria-labelledby="sonar-system-title">
  <div class="sonar-ring">
    <strong class="sonar-ring-title" id="sonar-system-title">SONAR</strong>
    <svg class="sonar-ring-arrows" viewBox="0 0 1000 850" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs><marker id="sonar-cycle-arrow" markerUnits="userSpaceOnUse" markerWidth="16" markerHeight="16" viewBox="0 0 16 16" refX="12" refY="8" orient="auto"><path d="M2 2 L14 8 L2 14 Z"/></marker></defs>
      <path class="sonar-ring-path" d="M670 162 A300 300 0 0 1 800 400" marker-end="url(#sonar-cycle-arrow)"/>
      <path class="sonar-ring-path" d="M590 696 A300 300 0 0 1 410 696" marker-end="url(#sonar-cycle-arrow)"/>
      <path class="sonar-ring-path" d="M200 400 A300 300 0 0 1 330 162" marker-end="url(#sonar-cycle-arrow)"/>
    </svg>
    <section class="sonar-cycle-card sonar-ring-engineering" aria-labelledby="sonar-engineering-title">
      <h3 id="sonar-engineering-title"><a href="/engineering#measure">Engineering</a></h3>
      <p class="sonar-cycle-role">Build and test the reporter:</p>
      <p>Reporter construction and controlled editor tests provide modeling benchmarks, experimental data and independent molecular evidence.</p>
      <a class="sonar-chapter-link" href="/engineering#measure">Explore Engineering</a>
    </section>
    <section class="sonar-cycle-card sonar-ring-measurement" aria-labelledby="sonar-measurement-title">
      <h3 id="sonar-measurement-title"><a href="/measurement">Measurement</a></h3>
      <p class="sonar-cycle-role">Define how to interpret the signal:</p>
      <p>Data define cell selection, normalization and reference calibration, and test how optical signals relate to molecular evidence.</p>
      <a class="sonar-chapter-link" href="/measurement">Explore Measurement</a>
    </section>
    <section class="sonar-cycle-card sonar-ring-contribution" aria-labelledby="sonar-contribution-title">
      <h3 id="sonar-contribution-title"><a href="/contribution#sonar">Contribution</a></h3>
      <p class="sonar-cycle-role">Make the workflow usable by others:</p>
      <p>Reporter designs, protocols and <strong>SAP (SONAR Analysis Program)</strong> help other teams adapt reporters and use the measurement framework.</p>
      <a class="sonar-chapter-link" href="/contribution#sonar">Explore Contribution</a>
    </section>
    <div class="sonar-ring-label sonar-ring-data"><span class="sonar-stack-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3 V20 M6 14 L12 20 L18 14"/></svg></span><span class="sonar-label-text">Provides modeling benchmarks and experimental data</span></div>
    <div class="sonar-ring-label sonar-ring-framework"><span class="sonar-stack-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3 V20 M6 14 L12 20 L18 14"/></svg></span><span class="sonar-label-text">Serves as<br>the software core</span></div>
    <div class="sonar-ring-label sonar-ring-reuse"><span class="sonar-stack-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M19 8 A8 8 0 1 0 19 17 M19 3 V8 H14"/></svg></span><span class="sonar-label-text">Tools, parts and guidance for other teams</span></div>
  </div>
</figure>

<p class="sonar-explanation"><strong>SONAR is the overall system; SAP is the software within it.</strong> The reporter supplies experimental signals, Measurement defines how to analyze them, and SAP helps users apply the workflow—from reporter sequence adaptation to flow-data analysis and export.</p>

## Guided by Real-World Questions {#guided-by-real-world-questions}

<section class="results-questions" aria-labelledby="guided-by-real-world-questions">
  <p class="questions-eyebrow">Human Practices × Project</p>
  <p class="questions-introduction">Building ORCA was never only about changing a nucleotide. Conversations with clinicians and researchers helped us reconsider what a useful RNA-editing system would need to achieve—and what our current results could actually demonstrate.</p>
  <div class="questions-grid">
    <article class="question-card question-card--deliver" aria-labelledby="question-deliver">
      <header class="question-header">
        <p class="question-category">Deliver</p>
        <h3 id="question-deliver">Can it reach the brain without becoming a burden?</h3>
        <p class="question-source"><a href="/human-practices#dr-zhifan-zhou-from-editing-in-the-laboratory-to-treatment-arrangements-patients-can-accept">Dr. Zhifan Zhou</a> · Neurology</p>
        <img class="question-mascot" src="https://static.igem.wiki/teams/6085/wiki/description/cell-v1.avif" alt="" aria-hidden="true" width="1254" height="1254" loading="lazy" decoding="async">
      </header>
      <div class="question-stage"><p class="question-label">We heard <span aria-hidden="true">↓</span></p><p>Brain delivery, repeated dosing and invasive procedures are critical considerations for future treatment.</p></div>
      <div class="question-stage"><p class="question-label">We explored <span aria-hidden="true">↓</span></p><p>Her feedback reinforced the priority of delivery research. We developed and tested AAV9-based ORCA vectors.</p></div>
      <div class="question-stage question-progress"><p class="question-label">Where we stand</p><p>AAV9 packaging was achieved, while functional delivery to target cells remains unconfirmed.</p></div>
    </article>
    <article class="question-card question-card--validate" aria-labelledby="question-validate">
      <header class="question-header">
        <p class="question-category">Edit &amp; Validate</p>
        <h3 id="question-validate">When does successful editing become meaningful?</h3>
        <p class="question-source"><a href="/human-practices#professor-keqiang-ye-how-should-we-judge-whether-an-edit-warrants-further-development">Prof. Keqiang Ye</a> · Neurodegeneration</p>
        <img class="question-mascot" src="https://static.igem.wiki/teams/6085/wiki/description/percent-left-v2.avif" alt="" aria-hidden="true" width="1254" height="1254" loading="lazy" decoding="async">
      </header>
      <div class="question-stage"><p class="question-label">We heard <span aria-hidden="true">↓</span></p><p>Editing efficiency alone cannot establish specificity, biological benefit or therapeutic safety.</p></div>
      <div class="question-stage"><p class="question-label">We explored <span aria-hidden="true">↓</span></p><p>His advice informed our attention to bystander editing, cell context and disease-relevant functional evaluation.</p></div>
      <div class="question-stage question-progress"><p class="question-label">Where we stand</p><p>Improved editing profiles were obtained, but functional rescue has not yet been demonstrated.</p></div>
    </article>
    <article class="question-card question-card--control" aria-labelledby="question-control">
      <header class="question-header">
        <p class="question-category">Control &amp; Choice</p>
        <h3 id="question-control">Can editing be controlled—and would patients choose it?</h3>
        <p class="question-source"><a href="/human-practices#dr-ziwei-dai-how-do-people-make-choices-after-learning-about-a-technology">Dr. Ziwei Dai</a> · Systems Biology</p>
        <img class="question-mascot" src="https://static.igem.wiki/teams/6085/wiki/description/choice-paddle-fist-v4.avif" alt="" aria-hidden="true" width="1254" height="1254" loading="lazy" decoding="async">
      </header>
      <div class="question-stage"><p class="question-label">We heard <span aria-hidden="true">↓</span></p><p>Invasiveness, risks, costs and uncertainty influence whether a future intervention would be acceptable.</p></div>
      <div class="question-stage"><p class="question-label">We explored <span aria-hidden="true">↓</span></p><p>These concerns aligned with our controllability goals and strengthened our approach to communicating risks and patient choice.</p></div>
      <div class="question-stage question-progress"><p class="question-label">Where we stand</p><p>ASO-mediated suppression was demonstrated; reversible control and clinical acceptability remain unvalidated.</p></div>
    </article>
  </div>
  <p class="questions-footer"><a href="/human-practices">Explore Our Human Practices <span aria-hidden="true">↗</span></a></p>
</section>

<section class="orca-journey" aria-labelledby="integrated-conclusion" markdown="1">

## Beyond One Base {#integrated-conclusion}

<p class="journey-subtitle"><em>The ORCA Journey</em></p>

Most pages of this Wiki are devoted to explaining what we designed, built, tested, and learned. Here, at the end of our project, we would like to put aside the data and figures for a moment and share something more personal.

Looking back on this year, we realize that some of the most meaningful parts of our journey are also the hardest to capture in a scientific report.

When we first started ORCA, we had a clear and exciting idea: to convert APOE4 into an APOE3-equivalent form through precise RNA editing, exploring a new possibility for Alzheimer's disease intervention. We were full of enthusiasm, and perhaps a little naive about how straightforward the path ahead might be.

It did not take long for reality to challenge that expectation.

In our early attempts at mutation design, we sometimes found ourselves facing countless possibilities without a clear sense of which direction to take. We knew what we wanted to improve, but figuring out how to get there was another matter. Conversations with our dry-lab teammates gradually brought new perspectives and more systematic ways of approaching these problems. What had seemed like an overwhelming search began to take shape.

That experience changed how we understood collaboration. Interdisciplinary research was no longer just a matter of assigning different tasks to people with different expertise. We discovered how much progress could come from listening to someone who approached the same problem in an entirely different way. When one person's knowledge reached its limits, another person's perspective could open a new path.

We carried that lesson with us throughout the project.

We also learned that the value of an idea sometimes becomes clearer when things do not go according to plan.

Our SONAR reporter was originally designed for our own experiments. We wanted a convenient way to observe RNA editing and guide the development of ORCA. But as the project progressed and time became increasingly limited, we realized that we might not be able to complete everything we had envisioned.

It was frustrating to face that possibility after investing so much effort.

Then we began asking ourselves a different question. Even if we could not fully realize our original plans within this iGEM season, could the work still be useful to someone else?

We started thinking beyond APOE4, exploring how the reporter could be designed to accommodate different RNA-editing targets and how our experience could help future teams avoid some of the difficulties we had encountered. Gradually, something created to support our own research became something we hoped to share with a much wider community.

We do not know who might use these tools in the future. But there is something deeply satisfying about imagining that a team we have never met might one day find our work useful.

In many ways, this is also what iGEM itself came to mean to us.

Hosting iGBA was one of the most demanding experiences of our year. Between preparations, coordination, and all the details that come with bringing people together, we spent considerable time and energy on work that had little to do with our experiments. There were moments when organizing an event seemed no easier than running a laboratory.

Yet we are grateful that we did it.

Through iGBA, we met students from different universities, listened to their projects, exchanged ideas, and shared the excitement and frustrations of doing research. It was wonderful to discover how many people our age were working just as passionately on questions completely different from our own.

What stayed with us most was the openness of these exchanges. People were willing to share their experiences, discuss problems they had not yet solved, and appreciate one another's ideas. We had entered iGEM thinking primarily about a competition. Somewhere along the way, we found ourselves becoming part of a community.

**We came together because of synthetic biology, but what made the experience memorable was the people.**

Our Human Practices work brought us into conversations we might never have had otherwise.

During our visit to a nursing home, we organized an educational session on fraud prevention for older adults. We initially focused on making the information accessible and practical. But the conversations that followed left a much deeper impression on us.

We heard concerns about health, uncertainty about unfamiliar technologies, and curiosity about new medical treatments. We began to appreciate how difficult it can be to navigate a world where information changes rapidly, especially when the consequences of trusting the wrong information can be so personal.

For us, scientific advances often represented exciting possibilities. For some of the older adults we met, they also raised more immediate questions: Could these developments really help people like them? How could they know what was trustworthy?

We had come hoping to share knowledge. We left having learned a great deal ourselves.

Our conversations with Alzheimer's disease specialists brought another perspective. In the laboratory, we were accustomed to discussing APOE4, editing efficiency, molecular specificity, and delivery strategies. Clinical conversations reminded us of the realities behind those terms: the gradual changes in patients' lives, the responsibilities carried by caregivers, and the difficult decisions families must make.

They also challenged us to think about what a future treatment would actually require. Even if precise RNA editing became possible, would it be safe enough? Could it reach the right cells? What burdens might treatment place on patients?

These questions made our original ambition feel both more distant and more meaningful.

We began to understand that Alzheimer's disease is not simply a biological problem waiting for a molecular solution. It affects the ordinary moments through which people recognize one another, care for one another, and build their lives together. Behind every discussion of therapeutic potential are people hoping for more time, more independence, and more moments with those they love.

We cannot claim to fully understand what those families experience. But meeting people outside the laboratory helped us approach our research with greater humility and a stronger sense of responsibility.

There were, of course, many quieter moments throughout this year.

We debated experimental designs, struggled with unexpected results, and spent far longer than anticipated on things that had once seemed simple. While some of us were working with cells and plasmids, others were developing models, writing code, preparing events, or trying to turn months of work into something understandable on this Wiki.

We were not always patient, and we did not always agree. There were times when everyone was tired and the next step was far from obvious.

But we kept going together.

Along the way, we learned much more than experimental techniques or computational methods. We learned to ask for help, to trust one another's expertise, to take responsibility when things went wrong, and to accept that an idea we had worked hard on might not be the right one.

We also learned to appreciate forms of contribution that are easy to overlook. A thoughtful question, an honest disagreement, or someone taking the time to help a teammate through a difficult problem could matter just as much as a successful experiment.

Years from now, we may no longer remember the exact parameters of an experiment or how many times we revised a particular construct. But we hope we will remember the conversations, the shared excitement, the unexpected friendships, and the people who made this year what it was.

That is what we will carry with us from iGEM.

As this chapter of ORCA comes to an end, we know that our original scientific goal remains far from complete. We have not developed a treatment for Alzheimer's disease, and many questions still need to be answered. There is much more work to be done before the therapeutic possibilities we imagined can become reality.

We hope that the data, tools, methods, and experiences we leave behind will give future researchers something useful to build upon. Perhaps another team will adapt our reporter, improve an approach we explored, or find inspiration in a question we were unable to answer.

We would be happy to see them go further than we could.

And beyond the scientific community, we think of the older adults we met, the patients and families we learned about, and the many people waiting for better ways to confront Alzheimer's disease. We hope that one day, the collective efforts of researchers around the world will lead to treatments that make a genuine difference in their lives.

We cannot know how long that will take, or what role our own work might eventually play.

What we do know is that this year has changed how we think about science, about working with others, and about the responsibilities that come with trying to make something useful for the world.

We began with the ambition of changing a single base in an RNA molecule.

**We never expected how much that little base would change us.**

To every teammate who walked this journey with us, to everyone who guided and supported us, and to all those who welcomed us, shared their stories, and challenged us to think differently: thank you.

ORCA is far from a perfect answer. There are things we wish we had done better, questions we wish we had answered, and ideas we wish we had more time to explore.

But we are proud of what we have built, of what we have learned, and, above all, of having done it together.

*— The SUSTech-BIO 2026 iGEM Team*
{: .journey-signature }

</section>

<div class="results-thank-you" id="thank-you" role="group" aria-label="A thank-you from the ORCA team">
  <img src="/assets/images/results-ending/orca-thank-you.png" alt="The ORCA mascot smiling and bowing in thanks." width="1093" height="1439" loading="lazy" decoding="async">
  <p>Thank you for exploring ORCA with us.</p>
</div>
