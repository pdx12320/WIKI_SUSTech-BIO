/* Generated from education-transfer-knowledge.json. Run tools/sync-knowledge.mjs after editing JSON. */
window.BIOSPHERE_KNOWLEDGE = {
  "schemaVersion": 1,
  "title": "Biology curriculum comparison · team evidence library",
  "status": "Preliminary team document analysis; not an independently validated curriculum audit.",
  "collaborators": [
    "SUSTech-BIO",
    "CUHK-HongKong-SBS",
    "HG-Tokyo"
  ],
  "limitations": [
    "Domain scores describe the depth reported in reviewed curriculum and examination materials. They do not measure student ability, predict transfer success, or establish equivalence between qualifications.",
    "No objective-by-objective curriculum mapping is available for the 76 framework outcomes. Outcome lists are learning references, not proven coverage checklists.",
    "Japan + AP is one combined study configuration. It must not be split into independent Japanese and AP scores.",
    "Score ranges and elective conditions are retained as reported. No averages, percentages or overall compatibility scores are calculated.",
    "Source documents reflect the team review. Current syllabus editions and assessment weightings have not been independently rechecked for this interface."
  ],
  "rubric": {
    "0": "Absent",
    "1": "Basic / Essential",
    "2": "Intermediate / Recommended",
    "3": "Advanced / Enrichment"
  },
  "sources": {
    "analysis": {
      "title": "Curriculum Comparison Analysis",
      "file": "sources/curriculum-comparison-analysis.pdf",
      "pages": 12,
      "sha256": "445fcdd7467abcb6fc5c7325a033cbba5634ab9b4968e3371fb07d360c51ea92",
      "description": "Team report: four configurations compared across six domains."
    },
    "framework": {
      "title": "Provisional Reference Framework for High School-Level Synthetic Biology Education",
      "file": "sources/curriculum-comparison-reference-framework.pdf",
      "pages": 62,
      "sha256": "917cff30c2afe2581368d125f498060aa04875eba7fa244304ce2183f0d3fd48",
      "description": "Provisional working reference; English outcomes on pages 7–12 and scoring rubric on page 13."
    }
  },
  "profiles": {
    "ial": {
      "name": "Pearson Edexcel iAL Biology",
      "short": "iAL",
      "location": "Hong Kong · international schools",
      "code": "IAL",
      "color": "#73ccb2",
      "contributors": "CUHK-HongKong-SBS",
      "scope": "Pearson Edexcel International Advanced Level Biology (IAS + IA2); practical skills Units 3 and 6 are included in the team report."
    },
    "hongkong": {
      "name": "HKDSE Biology",
      "short": "HKDSE",
      "location": "Hong Kong · local curriculum",
      "code": "DSE",
      "color": "#edbf69",
      "contributors": "CUHK-HongKong-SBS",
      "scope": "Compulsory biology and the optional Biotechnology elective. Coverage of tools and bioethics depends on elective selection."
    },
    "china": {
      "name": "Mainland China Biology & Gaokao",
      "short": "Mainland / Gaokao",
      "location": "Mainland China",
      "code": "CN",
      "color": "#e88991",
      "contributors": "SUSTech-BIO",
      "scope": "Senior secondary biology and national/provincial Gaokao biology materials reviewed by the team; regional and subject-selection differences remain relevant."
    },
    "japan": {
      "name": "Japanese High School Biology + AP Biology",
      "short": "Japan + AP",
      "location": "Japan · combined study configuration",
      "code": "JP+AP",
      "color": "#a8a1ed",
      "contributors": "HG-Tokyo",
      "scope": "A study-specific combination of Japanese high school biology and AP Biology. This is not a separate national system and does not represent every Japanese school."
    }
  },
  "domains": [
    {
      "id": "d1",
      "name": "Molecular Biology Foundations",
      "short": "Molecular foundations",
      "profiles": {
        "ial": {
          "curriculum": {
            "range": [
              3,
              3
            ],
            "reported": "3 (Advanced/Enrichment)"
          },
          "examination": {
            "range": [
              3,
              3
            ],
            "reported": "3"
          },
          "summary": "Extensive coverage of biological molecules (proteins, carbohydrates, lipids, enzymes), DNA/RNA structure, replication, transcription, translation, gene expression regulation, mutations (substitution, insertion, deletion), genotype-phenotype relationships, and examples like cystic fibrosis. Students explain how DNA sequence changes affect RNA/protein structure/function and phenotype, and apply concepts to medical/biotech contexts. Gene regulation and epigenetics are implied in development topics.",
          "evidence": "Units 1–2 (Molecules, Membranes, Proteins, DNA & Gene Expression); CGP bridge reinforces primary/secondary/tertiary protein structure, enzymes, and mutations. Exams require explanation, application, and data interpretation (e.g., sequence comparisons).",
          "comment": "Far exceeds essential/recommended levels. Strong foundation for synthetic biology designs (e.g., modifying gene expression or pathways).",
          "source": {
            "document": "analysis",
            "page": 2,
            "column": 1
          }
        },
        "hongkong": {
          "curriculum": {
            "range": [
              3,
              3
            ],
            "reported": "3 (Advanced/Enrichment)"
          },
          "examination": {
            "range": [
              3,
              3
            ],
            "reported": "3"
          },
          "summary": "Compulsory coverage of molecules of life (proteins, nucleic acids), cellular organisation, DNA structure, protein synthesis (transcription and translation), mutations, genotype–phenotype relationships, and basic recombinant DNA principles. Students explain how changes in DNA sequence can affect protein function and phenotype, and apply molecular concepts to biotechnology examples.",
          "evidence": "Compulsory Part II – Genetics and Evolution (Molecular genetics); recommended practical work such as DNA extraction. Public examinations frequently test explanation, application, and data interpretation in this area.",
          "comment": "Exceeds essential and recommended levels. Provides a robust foundation that supports later synthetic biology applications (e.g., gene modification and expression control).",
          "source": {
            "document": "analysis",
            "page": 2,
            "column": 2
          }
        },
        "china": {
          "curriculum": {
            "range": [
              3,
              3
            ],
            "reported": "3 (Advanced / Enrichment)"
          },
          "examination": {
            "range": [
              3,
              3
            ],
            "reported": "3"
          },
          "summary": "Extensive coverage of biological molecules, cells, DNA and RNA, DNA replication, transcription, translation, gene expression and regulation, mutations, heredity, genotype-phenotype relationships, and evolutionary mechanisms. Students explain how genetic information controls biological traits and how molecular-level changes affect proteins, functions, and phenotypes.",
          "evidence": "Compulsory modules cover molecules and cells, genetics, evolution, and regulation. Gaokao papers frequently test molecular mechanisms through diagrams, experimental data, and unfamiliar biological contexts.",
          "comment": "Very strong foundation for synthetic biology. Students have the molecular knowledge needed to understand how DNA sequences, regulatory mechanisms, proteins, and phenotypes can be deliberately modified.",
          "source": {
            "document": "analysis",
            "page": 2,
            "column": 3
          }
        },
        "japan": {
          "curriculum": {
            "range": [
              3,
              3
            ],
            "reported": "3 (Advanced / Enrichment)"
          },
          "examination": {
            "range": [
              3,
              3
            ],
            "reported": "3"
          },
          "summary": "Extensive coverage of biological molecules, cells, DNA and RNA, DNA replication, transcription, translation, gene expression and its regulation, mutations, heredity, genotype–phenotype relationships, and developmental gene expression. The Japanese curriculum explicitly requires students to understand regulation of gene expression and connect transcriptional regulation with proteins. AP Biology provides additional college-level treatment of heredity and gene expression/regulation.",
          "evidence": "MEXT biology includes gene expression, including gene expression regulation and the relationship between development and gene expression. AP Biology Units 5–6 cover Heredity and Gene Expression and Regulation, with gene regulation and molecular mechanisms assessed through application and analysis.",
          "comment": "Very strong foundation for synthetic biology. Students have the molecular knowledge necessary to understand how DNA sequences, regulatory mechanisms, proteins, and phenotypes can be deliberately modified.",
          "source": {
            "document": "analysis",
            "page": 2,
            "column": 4
          }
        }
      },
      "outcomes": [
        {
          "id": "D1-E01",
          "tier": "essential",
          "text": "describe the relationship among chromosomes, genes, nucleic acids, and proteins.",
          "source": {
            "document": "framework",
            "page": 7
          }
        },
        {
          "id": "D1-E02",
          "tier": "essential",
          "text": "outline gene expression, including transcription and translation.",
          "source": {
            "document": "framework",
            "page": 7
          }
        },
        {
          "id": "D1-E03",
          "tier": "essential",
          "text": "explain that mutation may change genetic information and affect phenotype.",
          "source": {
            "document": "framework",
            "page": 7
          }
        },
        {
          "id": "D1-E04",
          "tier": "essential",
          "text": "connect genotype, protein function, and observable traits in simple examples.",
          "source": {
            "document": "framework",
            "page": 7
          }
        },
        {
          "id": "D1-R01",
          "tier": "recommended",
          "text": "explain how changes in DNA sequence may affect RNA, protein structure, protein function, and phenotype.",
          "source": {
            "document": "framework",
            "page": 7
          }
        },
        {
          "id": "D1-R02",
          "tier": "recommended",
          "text": "explain gene expression as a regulated process rather than a simple one-way pathway.",
          "source": {
            "document": "framework",
            "page": 7
          }
        },
        {
          "id": "D1-R03",
          "tier": "recommended",
          "text": "interpret simple molecular biology data, such as DNA sequence comparison or gene expression patterns.",
          "source": {
            "document": "framework",
            "page": 7
          }
        },
        {
          "id": "D1-R04",
          "tier": "recommended",
          "text": "apply molecular biology concepts to biotechnology or medical examples.",
          "source": {
            "document": "framework",
            "page": 7
          }
        },
        {
          "id": "D1-A01",
          "tier": "advanced",
          "text": "use basic gene regulation concepts to explain changes in cell behaviour or simplified system-level outcomes.",
          "source": {
            "document": "framework",
            "page": 7
          }
        },
        {
          "id": "D1-A02",
          "tier": "advanced",
          "text": "interpret simplified gene regulatory diagrams.",
          "source": {
            "document": "framework",
            "page": 7
          }
        },
        {
          "id": "D1-A03",
          "tier": "advanced",
          "text": "connect molecular mechanisms with system-level outcomes.",
          "source": {
            "document": "framework",
            "page": 7
          }
        },
        {
          "id": "D1-A04",
          "tier": "advanced",
          "text": "apply molecular biology concepts to support a simple synthetic biology design or case study.",
          "source": {
            "document": "framework",
            "page": 7
          }
        }
      ]
    },
    {
      "id": "d2",
      "name": "Core Biotechnology Tools",
      "short": "Biotechnology tools",
      "profiles": {
        "ial": {
          "curriculum": {
            "range": [
              3,
              3
            ],
            "reported": "3"
          },
          "examination": {
            "range": [
              2,
              3
            ],
            "reported": "2–3"
          },
          "summary": "Recombinant DNA technology (restriction endonucleases, DNA ligase, plasmids as vectors, transformation), PCR (principles and uses), gel electrophoresis, DNA sequencing, genetic modification of microorganisms/plants/animals, cloning, and production of GM products (e.g., insulin, β-carotene in Golden Rice). Students explain steps, interpret results (e.g., gels), and compare techniques.",
          "evidence": "Unit 5 (Gene Technology); core practicals and practical skills units. CGP bridge covers foundational tools indirectly via molecules/DNA. Exams test interpretation and simple workflows.",
          "comment": "Principles and applications are well-covered. Advanced workflows and troubleshooting are more implicit (stronger in practical assessments).",
          "source": {
            "document": "analysis",
            "page": 3,
            "column": 1
          }
        },
        "hongkong": {
          "curriculum": {
            "range": [
              2,
              3
            ],
            "reported": "2–3 (3 for students taking the Biotechnology elective)"
          },
          "examination": {
            "range": [
              2,
              3
            ],
            "reported": "2–3"
          },
          "summary": "Compulsory: recombinant DNA technology, DNA fingerprinting, and the Human Genome Project. Elective (Biotechnology): detailed process of recombinant DNA technology (illustrated by insulin production), PCR and its applications, DNA fingerprinting, principles of producing genetically modified microorganisms/animals/plants, animal cloning (e.g., Dolly), and plant tissue culture. Students outline steps, recognise applications, and discuss benefits/hazards.",
          "evidence": "Compulsory applied genetics + Elective VIII.a (Techniques in modern biotechnology). Recommended practicals include gel electrophoresis and PCR. Examinations test description of processes, interpretation of results, and applications.",
          "comment": "Principles and major tools are well covered, especially for elective students. Advanced workflow design and troubleshooting are more limited.",
          "source": {
            "document": "analysis",
            "page": 3,
            "column": 2
          }
        },
        "china": {
          "curriculum": {
            "range": [
              2,
              3
            ],
            "reported": "2-3"
          },
          "examination": {
            "range": [
              2,
              3
            ],
            "reported": "2-3"
          },
          "summary": "Genetic engineering, recombinant DNA technology, restriction enzymes, DNA ligase, plasmid vectors, transformation, PCR, electrophoresis, gene expression, fermentation engineering, cell engineering, cloning-related techniques, and biotechnology applications in medicine, agriculture, food production, and environmental contexts. Students interpret experimental results and apply biotechnology concepts to novel scenarios.",
          "evidence": "Selective Compulsory 3, Biotechnology and Engineering, provides the clearest curriculum basis. Recent Gaokao papers include gene cloning, plasmid construction, PCR, electrophoresis, microbial engineering, fermentation, and plant or animal biotechnology.",
          "comment": "Principles and major applications are well covered. Advanced workflow design, troubleshooting, and construction of engineered biological systems are less consistently required.",
          "source": {
            "document": "analysis",
            "page": 3,
            "column": 3
          }
        },
        "japan": {
          "curriculum": {
            "range": [
              2,
              3
            ],
            "reported": "2–3"
          },
          "examination": {
            "range": [
              2,
              2
            ],
            "reported": "2"
          },
          "summary": "Genetic technologies, recombinant DNA / genetic modification concepts, DNA analysis, electrophoresis, and biotechnology applications. MEXT explicitly identifies technologies involving genes and gives genetic recombination and DNA analysis using electrophoresis as examples of possible learning activities. AP Biology provides conceptual understanding of biotechnology-related processes and experimental methods, although advanced laboratory protocols are not the central purpose of the course.",
          "evidence": "MEXT identifies techniques to work with genes, and gives genetic recombination technology and DNA analysis by electrophoresis as examples. AP Biology requires hands-on inquiry-based laboratories and scientific investigation skills.",
          "comment": "Good conceptual foundation, particularly when AP Biology and school-level laboratory work are combined. However, advanced workflows, troubleshooting, and actual construction of engineered biological systems are generally enrichment rather than core requirements.",
          "source": {
            "document": "analysis",
            "page": 3,
            "column": 4
          }
        }
      },
      "outcomes": [
        {
          "id": "D2-E01",
          "tier": "essential",
          "text": "recognise the purpose of recombinant DNA technology.",
          "source": {
            "document": "framework",
            "page": 8
          }
        },
        {
          "id": "D2-E02",
          "tier": "essential",
          "text": "explain the basic roles of restriction enzymes, ligase, plasmids, and host cells.",
          "source": {
            "document": "framework",
            "page": 8
          }
        },
        {
          "id": "D2-E03",
          "tier": "essential",
          "text": "outline the basic principle of polymerase chain reaction.",
          "source": {
            "document": "framework",
            "page": 8
          }
        },
        {
          "id": "D2-E04",
          "tier": "essential",
          "text": "explain the purpose of gel electrophoresis.",
          "source": {
            "document": "framework",
            "page": 8
          }
        },
        {
          "id": "D2-E05",
          "tier": "essential",
          "text": "recognise examples of genetically modified organisms and their uses.",
          "source": {
            "document": "framework",
            "page": 8
          }
        },
        {
          "id": "D2-R01",
          "tier": "recommended",
          "text": "explain the major steps in producing a genetically modified microorganism.",
          "source": {
            "document": "framework",
            "page": 8
          }
        },
        {
          "id": "D2-R02",
          "tier": "recommended",
          "text": "interpret simple gel electrophoresis results.",
          "source": {
            "document": "framework",
            "page": 8
          }
        },
        {
          "id": "D2-R03",
          "tier": "recommended",
          "text": "explain how polymerase chain reaction and DNA sequencing support biotechnology research.",
          "source": {
            "document": "framework",
            "page": 8
          }
        },
        {
          "id": "D2-R04",
          "tier": "recommended",
          "text": "compare different biotechnology techniques in terms of purpose and limitation.",
          "source": {
            "document": "framework",
            "page": 8
          }
        },
        {
          "id": "D2-A01",
          "tier": "advanced",
          "text": "design or evaluate a simplified biotechnology workflow.",
          "source": {
            "document": "framework",
            "page": 8
          }
        },
        {
          "id": "D2-A02",
          "tier": "advanced",
          "text": "identify appropriate experimental controls.",
          "source": {
            "document": "framework",
            "page": 8
          }
        },
        {
          "id": "D2-A03",
          "tier": "advanced",
          "text": "explain possible causes of basic experimental failure.",
          "source": {
            "document": "framework",
            "page": 8
          }
        },
        {
          "id": "D2-A04",
          "tier": "advanced",
          "text": "connect biotechnology tools to the construction or testing of synthetic biological systems.",
          "source": {
            "document": "framework",
            "page": 8
          }
        }
      ]
    },
    {
      "id": "d3",
      "name": "Synthetic Biology Concepts",
      "short": "Synthetic biology",
      "profiles": {
        "ial": {
          "curriculum": {
            "range": [
              1,
              1
            ],
            "reported": "1"
          },
          "examination": {
            "range": [
              1,
              1
            ],
            "reported": "1"
          },
          "summary": "Gene technology and GMOs are presented as designing organisms for specific functions (e.g., drug production, nutrient enhancement). Concepts like biological parts (promoters, genes), vectors, and transgenic organisms appear, but there is no explicit distinction of synthetic biology from genetic engineering. No coverage of biological parts/devices/systems, chassis organisms, modularity, standardization (e.g., BioBricks), genetic circuits, input-output logic, or biosensors as synbio-specific.",
          "evidence": "Unit 5 focuses on recombinant DNA, GM applications, and ethical implications. No mention of \"synthetic biology,\" circuits, or standardization in the specification.",
          "comment": "Treated as advanced biotechnology. Weak on core synbio conceptual framework—curriculum remains biotechnology-oriented.",
          "source": {
            "document": "analysis",
            "page": 4,
            "column": 1
          }
        },
        "hongkong": {
          "curriculum": {
            "range": [
              1,
              1
            ],
            "reported": "1"
          },
          "examination": {
            "range": [
              1,
              1
            ],
            "reported": "1"
          },
          "summary": "Gene technology and GMOs are presented as the design and construction of organisms for useful functions (e.g., pharmaceutical production, agricultural improvement). Biological components such as genes, vectors, and transgenic organisms appear, but there is no explicit distinction between synthetic biology and traditional genetic engineering. No coverage of biological parts/devices/systems, chassis organisms, modularity, standardisation, genetic circuits, input-output logic, or biosensors as synthetic-biology-specific concepts.",
          "evidence": "Biotechnology elective focuses on recombinant DNA, GMOs, cloning, and applications. The term “synthetic biology” and related system-level concepts are absent from the curriculum guide.",
          "comment": "Treated as advanced biotechnology. Weak on the core conceptual framework that distinguishes synthetic biology.",
          "source": {
            "document": "analysis",
            "page": 4,
            "column": 2
          }
        },
        "china": {
          "curriculum": {
            "range": [
              1,
              1
            ],
            "reported": "1"
          },
          "examination": {
            "range": [
              1,
              1
            ],
            "reported": "1"
          },
          "summary": "Students encounter prerequisite concepts for synthetic biology, including genes, gene expression, genetic modification, biotechnology applications, and engineered organisms. However, synthetic biology itself is not established as a distinct conceptual framework. There is little explicit treatment of biological parts, devices, chassis organisms, modularity, standardization, BioBricks, genetic circuits, input-output logic, or biosensors as synthetic-biology-specific concepts.",
          "evidence": "Curriculum and examinations focus mainly on molecular genetics, biotechnology, genetic engineering, fermentation, and biological applications. Synthetic biology-related ideas may appear indirectly, but the term and framework are not central.",
          "comment": "The curriculum is biotechnology-oriented rather than synthetic-biology-oriented. Students possess many prerequisites for synbio but are not systematically taught how biological components can be assembled into modular, designed systems.",
          "source": {
            "document": "analysis",
            "page": 4,
            "column": 3
          }
        },
        "japan": {
          "curriculum": {
            "range": [
              1,
              1
            ],
            "reported": "1"
          },
          "examination": {
            "range": [
              1,
              1
            ],
            "reported": "1"
          },
          "summary": "Students encounter concepts that form the foundation of synthetic biology, including genes, gene regulation, genetic technologies, genetic modification, and biotechnology applications. However, synthetic biology itself is not established as a distinct conceptual framework. There is little or no explicit treatment of biological parts, devices, chassis organisms, modularity, standardization / BioBricks, genetic circuits, input-output logic, or biosensors as synthetic biology concepts.",
          "evidence": "MEXT explicitly includes gene-related technologies and genetic recombination, but the curriculum materials do not establish a separate synthetic biology framework. AP Biology similarly covers gene expression, regulation, and biotechnology-related concepts but does not organize the course around synthetic biology systems or engineering concepts.",
          "comment": "The curriculum is biotechnology-oriented rather than synthetic-biology-oriented. Students possess many prerequisites for synbio but are not systematically taught how biological components can be assembled into modular, designed systems.",
          "source": {
            "document": "analysis",
            "page": 4,
            "column": 4
          }
        }
      },
      "outcomes": [
        {
          "id": "D3-E01",
          "tier": "essential",
          "text": "define synthetic biology as the design or construction of biological systems for specific functions.",
          "source": {
            "document": "framework",
            "page": 9
          }
        },
        {
          "id": "D3-E02",
          "tier": "essential",
          "text": "distinguish synthetic biology from ordinary molecular genetics and traditional biotechnology.",
          "source": {
            "document": "framework",
            "page": 9
          }
        },
        {
          "id": "D3-E03",
          "tier": "essential",
          "text": "recognise that biological components can be combined to produce a designed function.",
          "source": {
            "document": "framework",
            "page": 9
          }
        },
        {
          "id": "D3-E04",
          "tier": "essential",
          "text": "describe simple examples of synthetic biology applications, such as biosensors or engineered microorganisms.",
          "source": {
            "document": "framework",
            "page": 9
          }
        },
        {
          "id": "D3-R01",
          "tier": "recommended",
          "text": "explain the concepts of biological parts, devices, systems, and chassis organisms.",
          "source": {
            "document": "framework",
            "page": 9
          }
        },
        {
          "id": "D3-R02",
          "tier": "recommended",
          "text": "describe promoters, coding sequences, terminators, and regulatory elements in simplified terms.",
          "source": {
            "document": "framework",
            "page": 9
          }
        },
        {
          "id": "D3-R03",
          "tier": "recommended",
          "text": "explain how a simple genetic circuit produces an output in response to an input.",
          "source": {
            "document": "framework",
            "page": 9
          }
        },
        {
          "id": "D3-R04",
          "tier": "recommended",
          "text": "explain why modularity and standardisation are useful in synthetic biology.",
          "source": {
            "document": "framework",
            "page": 9
          }
        },
        {
          "id": "D3-A01",
          "tier": "advanced",
          "text": "interpret a simple synthetic gene circuit diagram.",
          "source": {
            "document": "framework",
            "page": 9
          }
        },
        {
          "id": "D3-A02",
          "tier": "advanced",
          "text": "propose a basic biological system for a defined function, such as detection, production, or regulation.",
          "source": {
            "document": "framework",
            "page": 9
          }
        },
        {
          "id": "D3-A03",
          "tier": "advanced",
          "text": "explain how pathway engineering can redirect cellular activity.",
          "source": {
            "document": "framework",
            "page": 9
          }
        },
        {
          "id": "D3-A04",
          "tier": "advanced",
          "text": "evaluate the feasibility and limitation of a proposed synthetic biology design.",
          "source": {
            "document": "framework",
            "page": 9
          }
        }
      ]
    },
    {
      "id": "d4",
      "name": "Design-Build-Test-Learn Thinking",
      "short": "DBTL thinking",
      "profiles": {
        "ial": {
          "curriculum": {
            "range": [
              1,
              2
            ],
            "reported": "1–2"
          },
          "examination": {
            "range": [
              1,
              2
            ],
            "reported": "1–2"
          },
          "summary": "Iterative elements appear in practical design, hypothesis testing, data evaluation, and troubleshooting (e.g., enzyme experiments, gene tech workflows). Students suggest improvements based on results in practical papers, but there is no explicit DBTL cycle, open-ended biological system design, or project-based iteration. Gene tech involves \"design\" via gene selection/insertion but follows standard protocols.",
          "evidence": "Practical Units 3 & 6; core practicals emphasize testing and controls. No iGEM-style or full engineering cycle in core content.",
          "comment": "Basic experimental logic and data-driven revision are present, but not framed as systematic engineering iteration.",
          "source": {
            "document": "analysis",
            "page": 5,
            "column": 1
          }
        },
        "hongkong": {
          "curriculum": {
            "range": [
              1,
              2
            ],
            "reported": "1–2"
          },
          "examination": {
            "range": [
              1,
              2
            ],
            "reported": "1–2"
          },
          "summary": "Scientific inquiry is emphasised throughout (hypothesis formulation, identification of variables and controls, experimental design, data evaluation). SBA requires practical investigations. Students may suggest improvements based on results, but there is no explicit Design-Build-Test-Learn cycle, open-ended biological system design, or iterative engineering process.",
          "evidence": "Scientific Inquiry strand across the curriculum; SBA practical-related tasks (20% of final grade). Written examinations include experimental design and evaluation questions, but these remain within traditional investigation formats.",
          "comment": "Basic experimental logic and data-driven revision are present, but the curriculum does not frame learning as systematic engineering iteration.",
          "source": {
            "document": "analysis",
            "page": 5,
            "column": 2
          }
        },
        "china": {
          "curriculum": {
            "range": [
              1,
              2
            ],
            "reported": "1-2"
          },
          "examination": {
            "range": [
              1,
              2
            ],
            "reported": "1-2"
          },
          "summary": "Scientific inquiry is strongly emphasised, including hypothesis testing, experimental design, variables and controls, data collection, result interpretation, and evaluation. Students often analyse procedures, identify errors, and suggest improvements. However, there is no explicit Design-Build-Test-Learn cycle, open-ended biological system design, or project-based engineering process.",
          "evidence": "Curriculum standards emphasise scientific inquiry and scientific thinking. Gaokao papers frequently include experimental design and evaluation questions, but these remain within traditional investigation formats.",
          "comment": "Basic experimental logic and data-driven revision are present, but the curriculum does not frame learning as systematic engineering iteration.",
          "source": {
            "document": "analysis",
            "page": 5,
            "column": 3
          }
        },
        "japan": {
          "curriculum": {
            "range": [
              2,
              2
            ],
            "reported": "2"
          },
          "examination": {
            "range": [
              2,
              2
            ],
            "reported": "2"
          },
          "summary": "Both systems include scientific inquiry, experimental design, hypothesis testing, data collection, interpretation, and evaluation. MEXT emphasizes observation, experimentation, inquiry, and development of students' ability to think, judge, and communicate scientifically. AP Biology explicitly requires scientific practices including Questions and Methods, data representation, statistical analysis, and argumentation. AP Biology also requires at least 25% of instructional time to involve hands-on, inquiry-based laboratory investigations.",
          "evidence": "MEXT includes inquiry activities within biology topics, while AP Biology requires inquiry-based laboratories and six science practices. AP Biology's science practices include determining scientific questions and methods, analyzing data, and developing evidence-based arguments.",
          "comment": "Stronger than a purely lecture-based curriculum, but the full DBTL engineering cycle is not explicit. Students test hypotheses and revise explanations or experiments, but they are not normally required to design, build, test, and iteratively improve a synthetic biological system in the iGEM sense.",
          "source": {
            "document": "analysis",
            "page": 5,
            "column": 4
          }
        }
      },
      "outcomes": [
        {
          "id": "D4-E01",
          "tier": "essential",
          "text": "recognise that scientific and engineering problems require clear problem definition.",
          "source": {
            "document": "framework",
            "page": 10
          }
        },
        {
          "id": "D4-E02",
          "tier": "essential",
          "text": "understand that experiments are used to test ideas and collect evidence.",
          "source": {
            "document": "framework",
            "page": 10
          }
        },
        {
          "id": "D4-E03",
          "tier": "essential",
          "text": "describe how results can support or reject a hypothesis.",
          "source": {
            "document": "framework",
            "page": 10
          }
        },
        {
          "id": "D4-E04",
          "tier": "essential",
          "text": "recognise that failed or unexpected results can guide improvement.",
          "source": {
            "document": "framework",
            "page": 10
          }
        },
        {
          "id": "D4-R01",
          "tier": "recommended",
          "text": "describe the Design-Build-Test-Learn cycle.",
          "source": {
            "document": "framework",
            "page": 10
          }
        },
        {
          "id": "D4-R02",
          "tier": "recommended",
          "text": "apply the cycle to a simple biotechnology or synthetic biology example.",
          "source": {
            "document": "framework",
            "page": 10
          }
        },
        {
          "id": "D4-R03",
          "tier": "recommended",
          "text": "identify what should be measured to test whether a biological design works.",
          "source": {
            "document": "framework",
            "page": 10
          }
        },
        {
          "id": "D4-R04",
          "tier": "recommended",
          "text": "suggest improvements based on experimental results.",
          "source": {
            "document": "framework",
            "page": 10
          }
        },
        {
          "id": "D4-A01",
          "tier": "advanced",
          "text": "formulate a design objective for a synthetic biology system.",
          "source": {
            "document": "framework",
            "page": 10
          }
        },
        {
          "id": "D4-A02",
          "tier": "advanced",
          "text": "propose a simple build strategy.",
          "source": {
            "document": "framework",
            "page": 10
          }
        },
        {
          "id": "D4-A03",
          "tier": "advanced",
          "text": "define measurable criteria for success.",
          "source": {
            "document": "framework",
            "page": 10
          }
        },
        {
          "id": "D4-A04",
          "tier": "advanced",
          "text": "use data to evaluate performance and revise the design.",
          "source": {
            "document": "framework",
            "page": 10
          }
        }
      ]
    },
    {
      "id": "d5",
      "name": "Data, Modelling, and Research Literacy",
      "short": "Data & research literacy",
      "profiles": {
        "ial": {
          "curriculum": {
            "range": [
              2,
              3
            ],
            "reported": "2–3"
          },
          "examination": {
            "range": [
              2,
              3
            ],
            "reported": "2–3"
          },
          "summary": "Excellent coverage of variables, controls (positive/negative), validity/reliability, graph/table interpretation, experimental design evaluation, repeatability, sample size, and evidence analysis. Bioinformatics, microarrays, and unfamiliar data (via pre-released articles) are included. Simple models (e.g., oxygen dissociation curves, Fick’s Law) are used.",
          "evidence": "Across all units, especially practical assessments and Unit 5. CGP bridge reinforces graphs, correlations, and planning experiments.",
          "comment": "Strong preparation for research; approaches recommended/advanced levels.",
          "source": {
            "document": "analysis",
            "page": 6,
            "column": 1
          }
        },
        "hongkong": {
          "curriculum": {
            "range": [
              2,
              3
            ],
            "reported": "2–3"
          },
          "examination": {
            "range": [
              2,
              3
            ],
            "reported": "2–3"
          },
          "summary": "Strong emphasis on experimental design, identification of variables and controls, reliability and validity, graph and table interpretation, data analysis, and drawing evidence-based conclusions. SBA further develops these skills through practical investigations. Simple models appear in other topics (e.g., ecology, physiology).",
          "evidence": "Compulsory scientific inquiry requirements; SBA assessment criteria; frequent data-interpretation questions in public examinations.",
          "comment": "Solid preparation for research literacy; approaches recommended/advanced levels, particularly through the combination of written papers and SBA.",
          "source": {
            "document": "analysis",
            "page": 6,
            "column": 2
          }
        },
        "china": {
          "curriculum": {
            "range": [
              3,
              3
            ],
            "reported": "3"
          },
          "examination": {
            "range": [
              3,
              3
            ],
            "reported": "3"
          },
          "summary": "Strong emphasis on graph and table interpretation, experimental design, variables and controls, model analysis, quantitative reasoning, evidence evaluation, prediction, explanation, and scientific argumentation. Students interpret unfamiliar biological information and connect data with mechanisms.",
          "evidence": "The China Gaokao Evaluation System emphasises key abilities, disciplinary literacy, application, and innovation. Recent Gaokao biology questions frequently use experimental data, genetic diagrams, flow charts, models, and authentic scientific contexts.",
          "comment": "One of the strongest areas of the curriculum. Students are well prepared to interpret unfamiliar biological data and evaluate experimental evidence.",
          "source": {
            "document": "analysis",
            "page": 6,
            "column": 3
          }
        },
        "japan": {
          "curriculum": {
            "range": [
              3,
              3
            ],
            "reported": "3"
          },
          "examination": {
            "range": [
              3,
              3
            ],
            "reported": "3"
          },
          "summary": "Experimental design, variables and controls, interpretation of tables and graphs, quantitative reasoning, evidence evaluation, model interpretation, statistical analysis, and scientific argumentation. AP Biology explicitly includes six science practices: concept explanation, visual representations, questions and methods, data representation, statistical tests / data analysis, and argumentation. MEXT also emphasizes scientific inquiry and the use of observations, experiments, and evidence to develop scientific reasoning.",
          "evidence": "AP Biology allocates significant assessment weight to data analysis, visual representations, questions / methods, and argumentation; the free-response section includes experimental-result interpretation, graphing, scientific investigation, model analysis, and data analysis.",
          "comment": "One of the strongest areas of the combined curriculum. Students are well prepared to interpret unfamiliar biological data and evaluate experimental evidence, approaching the advanced / research-literacy level required for synthetic biology.",
          "source": {
            "document": "analysis",
            "page": 6,
            "column": 4
          }
        }
      },
      "outcomes": [
        {
          "id": "D5-E01",
          "tier": "essential",
          "text": "identify independent, dependent, and controlled variables.",
          "source": {
            "document": "framework",
            "page": 11
          }
        },
        {
          "id": "D5-E02",
          "tier": "essential",
          "text": "understand the need for control experiments.",
          "source": {
            "document": "framework",
            "page": 11
          }
        },
        {
          "id": "D5-E03",
          "tier": "essential",
          "text": "interpret simple tables, graphs, and experimental results.",
          "source": {
            "document": "framework",
            "page": 11
          }
        },
        {
          "id": "D5-E04",
          "tier": "essential",
          "text": "distinguish observation, inference, and conclusion.",
          "source": {
            "document": "framework",
            "page": 11
          }
        },
        {
          "id": "D5-R01",
          "tier": "recommended",
          "text": "evaluate whether an experimental design is valid and reliable.",
          "source": {
            "document": "framework",
            "page": 11
          }
        },
        {
          "id": "D5-R02",
          "tier": "recommended",
          "text": "explain the roles of positive and negative controls.",
          "source": {
            "document": "framework",
            "page": 11
          }
        },
        {
          "id": "D5-R03",
          "tier": "recommended",
          "text": "identify limitations in experimental data.",
          "source": {
            "document": "framework",
            "page": 11
          }
        },
        {
          "id": "D5-R04",
          "tier": "recommended",
          "text": "interpret unfamiliar data in biotechnology or molecular biology contexts.",
          "source": {
            "document": "framework",
            "page": 11
          }
        },
        {
          "id": "D5-R05",
          "tier": "recommended",
          "text": "explain why repeatability, sample size, and uncertainty matter in biological research.",
          "source": {
            "document": "framework",
            "page": 11
          }
        },
        {
          "id": "D5-A01",
          "tier": "advanced",
          "text": "use simple models to represent biological systems.",
          "source": {
            "document": "framework",
            "page": 11
          }
        },
        {
          "id": "D5-A02",
          "tier": "advanced",
          "text": "explain the usefulness and limitations of biological models.",
          "source": {
            "document": "framework",
            "page": 11
          }
        },
        {
          "id": "D5-A03",
          "tier": "advanced",
          "text": "compare predicted and observed outcomes.",
          "source": {
            "document": "framework",
            "page": 11
          }
        },
        {
          "id": "D5-A04",
          "tier": "advanced",
          "text": "evaluate claims based on experimental evidence.",
          "source": {
            "document": "framework",
            "page": 11
          }
        },
        {
          "id": "D5-A05",
          "tier": "advanced",
          "text": "read and extract key information from simplified scientific or technical materials.",
          "source": {
            "document": "framework",
            "page": 11
          }
        }
      ]
    },
    {
      "id": "d6",
      "name": "Bioethics, Biosafety, and Society",
      "short": "Ethics & biosafety",
      "profiles": {
        "ial": {
          "curriculum": {
            "range": [
              2,
              2
            ],
            "reported": "2"
          },
          "examination": {
            "range": [
              2,
              2
            ],
            "reported": "2"
          },
          "summary": "Benefits/risks of GMOs, ethical/social issues (e.g., genetic screening, gene therapy, GM crops/animals), stakeholder considerations, environmental release concerns, and regulation. Students discuss advantages/disadvantages and implications (e.g., Golden Rice risks). Biosafety is basic (containment implied in GM work).",
          "evidence": "Unit 5 and genetic screening topics. Exams include evaluation from multiple viewpoints.",
          "comment": "Good balanced discussion at recommended level, but less structured advanced ethical analysis or dual-use concerns.",
          "source": {
            "document": "analysis",
            "page": 7,
            "column": 1
          }
        },
        "hongkong": {
          "curriculum": {
            "range": [
              2,
              2
            ],
            "reported": "2 (stronger for elective students)"
          },
          "examination": {
            "range": [
              2,
              2
            ],
            "reported": "2"
          },
          "summary": "Explicit bioethics component in the Biotechnology elective covering ethical, legal, social, economic, and environmental issues related to genetically modified food, animal and plant cloning, the Human Genome Project, gene therapy, and stem-cell therapy. Students discuss benefits, hazards, and societal implications. Biosafety considerations appear mainly as risk/benefit discussion rather than structured risk assessment or containment protocols.",
          "evidence": "Elective VIII.c (Bioethics); STSE connections throughout the curriculum. Examinations include evaluation and discussion-style questions on these issues.",
          "comment": "Good balanced treatment at the recommended level for elective students; less advanced structured ethical analysis or dual-use considerations.",
          "source": {
            "document": "analysis",
            "page": 7,
            "column": 2
          }
        },
        "china": {
          "curriculum": {
            "range": [
              2,
              2
            ],
            "reported": "2"
          },
          "examination": {
            "range": [
              1,
              2
            ],
            "reported": "1-2"
          },
          "summary": "Biotechnology is connected to food production, medicine, agriculture, environmental protection, biosafety, social responsibility, and ethical issues. Students may discuss benefits and risks of GMOs, cloning, gene editing, biological products, and biotechnology applications. However, formal synthetic-biology-specific risk assessment, containment design, dual-use concerns, and stakeholder analysis are limited.",
          "evidence": "Biotechnology and Engineering includes links between biotechnology, society, safety, and ethics. Gaokao questions may include application and evaluation contexts, but extended ethical or biosafety analysis is not a major repeated examination focus.",
          "comment": "Good basic foundation for responsible biotechnology, but advanced biosafety and synthetic-biology-specific ethical analysis could be strengthened.",
          "source": {
            "document": "analysis",
            "page": 7,
            "column": 3
          }
        },
        "japan": {
          "curriculum": {
            "range": [
              2,
              2
            ],
            "reported": "2"
          },
          "examination": {
            "range": [
              1,
              2
            ],
            "reported": "1–2"
          },
          "summary": "Biotechnology and genetic technologies can be considered in relation to their applications and social implications. Japanese education places biotechnology within real-world scientific contexts, while AP Biology requires students to apply biology to real-world questions and scenarios and become scientifically literate citizens. However, explicit synthetic-biology-specific treatment of containment, environmental release, dual-use concerns, stakeholder analysis, and formal risk assessment is limited.",
          "evidence": "AP Biology requires opportunities to apply biology to real-world questions and scenarios. Japanese biotechnology education includes genetic technologies and their applications, while broader Japanese regulation provides a real-world context for biosafety and containment of genetically modified organisms.",
          "comment": "The combined system provides a reasonable foundation for responsible biotechnology, but advanced structured ethical analysis and synthetic-biology-specific biosafety are not central assessment targets.",
          "source": {
            "document": "analysis",
            "page": 7,
            "column": 4
          }
        }
      },
      "outcomes": [
        {
          "id": "D6-E01",
          "tier": "essential",
          "text": "recognise that biotechnology and synthetic biology may bring benefits and risks.",
          "source": {
            "document": "framework",
            "page": 12
          }
        },
        {
          "id": "D6-E02",
          "tier": "essential",
          "text": "identify basic biosafety concerns related to genetically modified organisms.",
          "source": {
            "document": "framework",
            "page": 12
          }
        },
        {
          "id": "D6-E03",
          "tier": "essential",
          "text": "describe common applications in medicine, agriculture, industry, and the environment.",
          "source": {
            "document": "framework",
            "page": 12
          }
        },
        {
          "id": "D6-E04",
          "tier": "essential",
          "text": "discuss simple advantages and disadvantages of biotechnology applications.",
          "source": {
            "document": "framework",
            "page": 12
          }
        },
        {
          "id": "D6-R01",
          "tier": "recommended",
          "text": "evaluate biotechnology applications using scientific, ethical, social, and environmental considerations.",
          "source": {
            "document": "framework",
            "page": 12
          }
        },
        {
          "id": "D6-R02",
          "tier": "recommended",
          "text": "explain why biosafety, containment, and risk assessment are important.",
          "source": {
            "document": "framework",
            "page": 12
          }
        },
        {
          "id": "D6-R03",
          "tier": "recommended",
          "text": "discuss public concerns about genetically modified organisms, gene therapy, and synthetic organisms.",
          "source": {
            "document": "framework",
            "page": 12
          }
        },
        {
          "id": "D6-R04",
          "tier": "recommended",
          "text": "distinguish evidence-based concerns from unsupported claims.",
          "source": {
            "document": "framework",
            "page": 12
          }
        },
        {
          "id": "D6-A01",
          "tier": "advanced",
          "text": "conduct a structured ethical analysis of a synthetic biology case.",
          "source": {
            "document": "framework",
            "page": 12
          }
        },
        {
          "id": "D6-A02",
          "tier": "advanced",
          "text": "compare the interests of different stakeholders.",
          "source": {
            "document": "framework",
            "page": 12
          }
        },
        {
          "id": "D6-A03",
          "tier": "advanced",
          "text": "evaluate possible unintended consequences.",
          "source": {
            "document": "framework",
            "page": 12
          }
        },
        {
          "id": "D6-A04",
          "tier": "advanced",
          "text": "discuss dual-use concerns at a high-level conceptual level.",
          "source": {
            "document": "framework",
            "page": 12
          }
        },
        {
          "id": "D6-A05",
          "tier": "advanced",
          "text": "propose responsible conditions for developing or deploying a synthetic biology application.",
          "source": {
            "document": "framework",
            "page": 12
          }
        }
      ]
    }
  ]
};
