# Rep-gib WT 纯同义 StemBreak 设计

版本：2026-09-01  
状态：有条件可执行；已完成序列、读框、RNAplfold 和引物计算复核。PCR 体系、延伸时间、DpnI 处理及重组反应条件按实际高保真酶和同源重组试剂盒说明书设置。

## 目标与边界

保持实际 Sanger 确认的 PUF12 reporter 中以下 DNA 序列完全不变：

```text
ACATGGAGGACG | TG | CGA
PUF12 位点      spacer  靶C密码子
```

只对靶密码子之后的 13 个密码子区段做同义改写。WT 和两个候选均翻译为：

```text
Gly-Ser-Met-Ile-Ser-Leu-Ile-Ala-Ala-Leu-Ala-Val-Asp
```

本设计是“纯同义版”，不是同目录中另一套增加 GSGS 氨基酸的 `RepOpen_HR` 方案。

## 入选序列（5′→3′）

| 版本 | transcript 1522–1560 局部 DNA | 变化 | 用途 |
|---|---|---:|---|
| WT | `GGCAGCATGATCAGCCTGATCGCCGCCCTGGCCGTGGAC` | — | 原始对照 |
| StemBreak-A | `GGGTCAATGATTTCCCTCATTGCAGCGCTCGCGGTGGAT` | 14 nt，11个密码子 | 优先提高 PUF12 结合区开放 |
| StemBreak-B | `GGTTCAATGATCTCACTGATCGCAGCGCTCGCGGTGGAT` | 12 nt，8个密码子 | 兼顾 PUF12 和“位点＋spacer＋靶C” |

## RNAplfold 结果

ViennaRNA 2.7.2，37°C，`u=15`。表中为整段同时不配对的概率，已换算成百分比。

| 版本 | W70 P12 | W70 P15 | W120 P12 | W120 P15 | W150 P12 | W150 P15 |
|---|---:|---:|---:|---:|---:|---:|
| WT | 0.646% | 0.0457% | 0.236% | 0.00234% | 0.00110% | 0.0000166% |
| StemBreak-A | 5.209% | 0.0569% | 1.914% | 0.0219% | 1.382% | 0.0157% |
| StemBreak-B | 2.778% | 0.1018% | 1.069% | 0.0293% | 0.5426% | 0.0316% |

相对 WT：

- StemBreak-A：W70 的 P12 提高 8.06×，但 W70 P15 只提高 1.24×；更像“结合区解锁”版。
- StemBreak-B：W70 的 P12 提高 4.30×，P15 提高 2.23×；更适合作为结合与编辑几何的平衡版。

W70 结果已在 ProteinIQ RNAplfold 作为一个多 FASTA 任务交叉验证，原始 `_lunp` 数值与本地计算一致：

https://proteiniq.io/app/rnaplfold?jobId=fd0gx9pl5aif51ungo01qfhq

## 同源重组引物（5′→3′）

| 引物 | 序列 | 长度 | 纯化建议 |
|---|---|---:|---|
| StemBreak-A-HR-F | `GACATGGAGGACGTGCGAGGGTCAATGATTTCCCTCATTGCAGCGCTCGCGGTGGATCGCGTGATCGGCATGGAAAC` | 77 nt | PAGE 或 HPLC |
| StemBreak-B-HR-F | `GACATGGAGGACGTGCGAGGTTCAATGATCTCACTGATCGCAGCGCTCGCGGTGGATCGCGTGATCGGCATGGAAAC` | 77 nt | PAGE 或 HPLC |
| StemBreak-HR-R-common | `TCGCACGTCCTCCATGTCG` | 19 nt | 标准脱盐 |

Forward 结构：

```text
[18-bp 末端同源区] + [39-bp 同义替换区] + [20-bp 3′退火区]
```

- 20-bp Forward 退火区：`CGCGTGATCGGCATGGAAAC`，Primer3-py 2.3.0 估算 Tm 62.6°C。
- Reverse 引物 Tm 估算 62.3°C。
- 两端有 18 bp 预期同源重叠；若实际试剂盒要求 ≥20 bp，需在下单前加长同源区。
- 不需要 5′ 磷酸化或荧光修饰。
- 引物中 Forward 5′同源区与 Reverse 存在预期互补；该互补用于重组环化。建议严格使用试剂盒推荐的引物浓度和退火条件。

## 实验台简流程

1. 分别使用 `A-HR-F + R-common` 和 `B-HR-F + R-common`，以 Sanger 确认的 Rep-gib WT PUF12 质粒为模板做整质粒反向 PCR。
2. 按实际高保真酶说明书设置体系、退火、延伸和循环数；模板约 7.48 kb，延伸时间必须按酶速度计算。
3. 若模板为常规大肠杆菌提取的甲基化质粒，按实验室 SOP/试剂说明进行 DpnI 消化以降低 WT 背景。
4. 检查近全长线性 PCR 产物，纯化后按同源重组试剂盒进行单片段环化。
5. 转化克隆菌株，挑取多个独立菌落做菌落 PCR/小提。
6. Sanger 双向覆盖 PUF12、`TG`、靶 `CGA`、全部同义改写区和两侧接头。
7. 每个版本至少保留 2 个序列完全正确的独立克隆，再进入等摩尔量转染比较。

## 质控与待确认

- 必须使用实际 PUF12 WT 克隆，不能使用旧 PUF10 GenBank 参考或 universal stuffer 质粒。
- 两个候选均保持读框和氨基酸序列，未在改写区新增 BsaI/BsmBI 正反向识别位点。
- 变体与 WT 的最终质粒长度相同；不能仅凭凝胶大小区分，必须测序。
- `[P0 待确认]`：你使用的同源重组试剂盒是否接受 18-bp 末端同源区。
- `[P1 待确认]`：转染前应同时确认 WT/A/B 的浓度、纯度、质粒构象和无编辑器时的 reporter 基线。

## 计算依据

- 序列源：`Reporter/序列/reporter_apoe4_assembled.fasta`，结合 Rep-gib WT Sanger 确认的 3-bp `GAC` 插入恢复 PUF12 实际序列。
- 枚举区域：transcript 1522–1560，固定随机种子 `20260901`，筛选 12,000 个常用同义密码子组合；该筛选不是数学上的穷尽枚举。
- 最终 A/B 已放回完整 2007-nt reporter RNA，分别在 W70/L70、W120/L120、W150/L150 复核。
- 引物退火 Tm 使用 Primer3-py 2.3.0 默认盐参数估算；实际应再用所选高保真酶厂家计算器复核。
