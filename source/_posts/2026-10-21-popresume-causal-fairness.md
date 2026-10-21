---
title: "三、PopResume：基于人口代表性数据的简历筛选因果公平性评估"
date: 2026-10-21 09:01:00
updated: 2026-10-21 09:01:00
slug: popresume-causal-fairness
permalink: /2026/10/21/popresume-causal-fairness/
categories:
  - 论文阅读
tags:
  - 论文
math: true
katex: true
draft: false
---

[论文原文](https://arxiv.org/abs/2603.22714v2)

### 1. 论文定位与核心贡献

**论文**：*PopResume: Causal Fairness Evaluation of LLM/VLM Resume Screeners with Population-Representative Dataset*，arXiv:2603.22714v2。

**研究问题**：当大语言模型（LLM）或视觉语言模型（VLM）用于简历筛选时，怎样判断不同受保护群体之间的评分差异是如何产生的？仅比较平均分、录用率等结果指标，通常只能发现差异，不能判断差异来自岗位相关资质，还是来自姓名、地址等人口统计代理变量。

**核心思路**：把公平性审计从“不同群体的结果是否不同”推进到“差异通过哪条因果路径产生”，即使用 **Path-Specific Effect（PSE，路径特定效应）** 分析受保护属性对简历得分的影响。

**主要贡献**

1. 提出面向 LLM/VLM 简历筛选的因果公平性审计框架，区分由岗位相关资质传递的影响与由人口统计代理变量传递的影响。
2. 构建 PopResume 数据集：依据美国人口统计与调查数据（图示包括 ACS PUMS、PSID、SSA、Census 等来源）构造合成简历，尽量保留现实中属性的分布与关联。
3. 在 **60.8K 份简历、5 类职业**上评估 **4 个 LLM 和 4 个 VLM**，展示仅靠汇总结果指标可能遗漏的歧视模式。

**与简单反事实简历的区别**

- 传统做法常直接替换姓名或性别标签，却不改变与该属性在现实中相关的其他信息，可能破坏变量之间原本的关系。
- PopResume 不是把真实个体的简历原样搬进数据集，也不是只改一个标签；它是依据人口统计规律生成的**合成简历**，目标是让群体比例及属性间的自然关联更接近现实。
- 因此，它为因果路径分析提供了更合适的受控数据基础，但不意味着数据中的每份简历都对应真实个人，也不保证完全复现真实招聘市场。

**图 1：现有评估方式与 PopResume 的区别**

![image.png](/images/papers/popresume-causal-fairness/figure-01.png)

### 2. 理论框架：法律背景、SFM 与因果效应

#### 2.1 为什么只看结果差异不够？

- **结果差异（Outcome Disparity）**：例如不同性别或种族群体的平均简历得分、通过率或录用率不同。
- **局限**：这类指标可以作为风险预警，却不能单独说明差异的来源。两个群体的平均分即使相同，也不能排除模型在不同因果路径上存在方向相反、彼此抵消的影响。
- **现有数据的难点**：真实简历数据往往缺少可用于审计的真实人口属性；而人工注入或替换人口属性又可能破坏姓名、教育、工作经历、居住地等变量之间的自然关系。PSE 分析需要能同时控制受保护属性、岗位资质和代理变量的数据。

#### 2.2 法律上的核心区分：Business Necessity 与 Redlining

美国《民权法案》第七章（Title VII）将种族、肤色、宗教、性别和原国籍等列为受保护属性。就业歧视审查中的 **Disparate Impact（差别影响）** 原则关注看似中立的做法是否对某些受保护群体造成不成比例的不利结果。

- **结果差异筛查**：例如 Four-Fifths Rule（五分之四规则）可用于初步识别群体间的差异，但它本身不能解释差异是由什么造成的。
- **Business Necessity（商业必要性路径）**：差异通过与岗位直接相关、且确有必要的条件传递，例如岗位所需的教育水平、技能或工作经验。在论文的框架中，这类路径可能构成可被正当化的差异来源。
- **Redlining（红线歧视路径）**：差异通过姓名、居住州等人口统计代理变量传递。这些变量可能暗示性别或种族，却不应被当作岗位能力的替代指标；论文将这类路径视为需要重点审计的不当影响来源。

> **关键区别**：观察到差异只是第一步；还需要分析差异由哪条路径产生。本文的法律解释是框架性的，具体判断仍取决于适用法律、岗位情境和司法辖区，不能把某个统计指标直接等同于违法结论。
> 

**图 2：标准公平性模型及后续的中介变量分解**

![image.png](/images/papers/popresume-causal-fairness/figure-02.png)

#### 2.3 Standard Fairness Model（SFM，标准公平性模型）

论文基于结构因果模型（Structural Causal Model, SCM）描述受保护属性如何影响招聘结果。SFM 不要求一开始就写出所有细节因果关系，而是把变量分成四类：

- **X：受保护属性（Protected Attribute）**，例如性别或种族。
- **Y：结果变量（Outcome）**，本文中是 LLM/VLM 对简历给出的评分。
- **Z：混杂因子（Confounders）**，不受 X 因果影响，但可能同时与 X 和其他变量有关，进而混杂对因果效应的估计。
- **W：中介变量（Mediators）**，可能受到 X 影响，并进一步影响 Y。在简历场景中，可包括姓名、居住地、教育程度、工作经验等变量。

图中的虚线双向箭头 **X ↔ Z** 表示可能存在未观测到的共同原因，使 X 与 Z 相关；**它不表示 X 导致 Z**。这与 SFM 对 Z 的定义一致：Z 不是由受保护属性 X 因果产生的。

右图进一步预告了本文后续的中介变量分解：将 W 区分为 **B**（Business Necessity components，岗位相关资质，如教育和工作经验）与 **R**（Redlining-related components，人口统计代理变量，如姓名和居住州）。后续会据此区分不同路径上的效应；这里先理解基础 SFM 与一般因果效应。

#### 2.4 基础因果效应：TE、NDE 与 NIE

**潜在结果记号**：Yₓ 表示通过干预将 X 设为 x 时的结果；Wₓ₀ 表示当 X=x₀ 时，W 会自然取到的状态。若 X 表示性别，可以把 x₀ 设为女性、x₁ 设为男性；若研究其他受保护属性，则按相应群体定义。

**（1）总效应（Total Effect, TE）**

$$
									\operatorname{TE}(x_1,x_0)
\triangleq
\mathbb{E}[Y_{x_1}]-\mathbb{E}[Y_{x_0}]
$$

- **含义**：将受保护属性从 x₀ 改为 x₁ 后，结果 Y 的平均变化。
- **覆盖范围**：包含所有因果路径——既包括不经过中介 W 的路径，也包括经过 W 的间接路径。

**（2）自然直接效应（Natural Direct Effect, NDE）**

$$
									\operatorname{NDE}(x_1,x_0)
\triangleq
\mathbb{E}[Y_{x_1,W_{x_0}}]-\mathbb{E}[Y_{x_0}]
$$

- **直观理解**：比较两种状态时，把中介变量固定在 X=x₀ 时的自然状态 Wₓ₀，只改变 X。
- **衡量什么**：在该定义下，不经由中介变量 W 传递的直接效应。

**（3）自然间接效应（Natural Indirect Effect, NIE）**

$$
									\operatorname{NIE}(x_1,x_0)
\triangleq
\mathbb{E}[Y_{x_1}]-\mathbb{E}[Y_{x_1,W_{x_0}}]
$$

- **直观理解**：把 X 固定在 x₁，比较中介变量处于 Wₓ₁ 与 Wₓ₀ 两种自然状态时的结果差异。
- **衡量什么**：由中介变量 W 传递的间接效应。

**三者关系**

$$
									\operatorname{TE}(x_1,x_0)
=
\operatorname{NDE}(x_1,x_0)
+
\operatorname{NIE}(x_1,x_0)
$$

这是由上述定义加减同一项得到的分解。要从观测数据中识别这些因果效应，仍需满足相应的因果建模与识别假设。

#### 2.5 从一般因果效应到路径特定效应（PSE）

- **PSE 的意思**：不是泛泛地给某个影响因素打一个分，而是量化受保护属性的影响沿着**指定的一组因果路径**传递了多少。
- **为什么需要 PSE**：TE、NDE、NIE 能区分总体影响、直接影响和经中介传递的影响，但一般的中介集合 W 仍可能混合了岗位相关资质和人口统计代理变量。
- **PopResume 的下一步**：将 W 拆分为 B 与 R，再分别量化通过商业必要性路径与红线歧视路径传递的效应。具体的路径特定效应定义与估计方法留待下一节展开。

### 3.1 中介变量分解（Mediator Decomposition）

**研究目的**：第 2.2 节将总效应分解为 $TE=NDE+NIE$，但 NIE 仍把所有中介路径混在一起，不能区分差异来自岗位相关资质，还是来自人口统计代理变量。因此，论文把中介集合 $\mathbf W$ 拆成两组：

- **B（Business Necessity）**：教育程度、工作经验等岗位相关资质。BIE（B-specific Indirect Effect）归集经过 B、但不经过 R 的路径，例如 $X\to B\to Y$。
- **R（Redlining）**：姓名、居住州等人口统计代理变量。RIE（R-specific Indirect Effect）归集所有经过 R 的路径，包括 $X\to R\to Y$ 和 $X\to R\to B\to Y$。

**为什么** $X\to R\to B\to Y$ **属于 RIE？** 这条路径的影响先经过 R，虽然之后又经过 B，但按照论文的路径归属规则，它仍然归入 RIE。

**嵌套反事实记号**：沿用论文实验的设定 $x_0=\mathrm{Female}$、$x_1=\mathrm{Male}$：

- $\mathbf R_{x_0}$：将 X 设为 $x_0$ 时，R 的自然状态。
- $\mathbf B_{x_1,\mathbf R_{x_0}}$：令 $X=x_1$，同时把 R 固定在 $\mathbf R_{x_0}$ 时，B 的反事实状态。
- $Y_{x_1,\mathbf B_{x_1,\mathbf R_{x_0}},\mathbf R_{x_0}}$：令结果方程中的 X、B、R 分别取上述状态时，Y 的潜在结果。

> **读下标的顺序**：先读最里面的 R，再读 B，最后读 Y。嵌套反事实是因果干预的定义，而不只是替换简历文本。
> 

#### 3.1.1 BIE：B-specific Indirect Effect（公式 4）

$$
								\begin{aligned}
\mathrm{BIE}(x_1,x_0)\triangleq\frac12\big[&
\underbrace{\mathbb E[Y_{x_1}]-\mathbb E[Y_{x_1,\mathbf B_{x_0,\mathbf R_{x_1}},\mathbf R_{x_1}}]}_{\text{(ii)}}\\
&+\underbrace{\mathbb E[Y_{x_1,\mathbf B_{x_1,\mathbf R_{x_0}},\mathbf R_{x_0}}]-\mathbb E[Y_{x_1,\mathbf B_{x_0},\mathbf R_{x_0}}]}_{\text{(i)}}
\big].
\end{aligned}
$$

**第 (i) 个减法：先固定 R，再改变 B。** 两项中 Y 的 X 均固定为 $x_1$，R 均为 $\mathbf R_{x_0}$；变化的只有 B 的反事实状态：$\mathbf B_{x_0}\to\mathbf B_{x_1,\mathbf R_{x_0}}$。由自然状态的一致性，$\mathbf B_{x_0}=\mathbf B_{x_0,\mathbf R_{x_0}}$。该差值衡量 **R 处于 x₀ 状态时，X 通过 B 传递的效应**。

**第 (ii) 个减法：先让 R 处于 x₁ 状态，再改变 B。** 将第一项展开为 $Y_{x_1}=Y_{x_1,\mathbf B_{x_1,\mathbf R_{x_1}},\mathbf R_{x_1}}$，可见 R 在两项中均为 $\mathbf R_{x_1}$，而 B 从 $\mathbf B_{x_0,\mathbf R_{x_1}}$ 变为 $\mathbf B_{x_1,\mathbf R_{x_1}}$。该差值衡量 **R 处于 x₁ 状态时，X 通过 B 传递的效应**。

**为什么需要两组减法？** R 可影响 B，因此改变 X 对 B 的边际效应可能随 R 的反事实状态而不同。只采用 (i) 或 (ii)，会使对 B 的贡献归属依赖人为选定的干预顺序。

**为什么乘** $\tfrac12$**？** 作者采用对称定义，对两种顺序下 B 的边际贡献取算术平均。这是一种消除干预顺序选择偏好的分解方式，而不是由数据估计出来的权重。

**为什么外层 Y 始终使用** $x_1$**？** 因为这里要分解的是 NIE：固定结果方程中 X 的取值，只比较中介在不同反事实状态下的效果，不混入直接效应 NDE。

#### 3.1.2 RIE：R-specific Indirect Effect（公式 5）

$$
								\begin{aligned}
\mathrm{RIE}(x_1,x_0)\triangleq\frac12\big[&
\mathbb E[Y_{x_1}]-\mathbb E[Y_{x_1,\mathbf B_{x_1,\mathbf R_{x_0}},\mathbf R_{x_0}}]\\
&+\mathbb E[Y_{x_1,\mathbf B_{x_0,\mathbf R_{x_1}},\mathbf R_{x_1}}]-\mathbb E[Y_{x_1,\mathbf B_{x_0},\mathbf R_{x_0}}]
\big].
\end{aligned}
$$

- **第一个减法**：把 R 从 $\mathbf R_{x_0}$ 改为 $\mathbf R_{x_1}$，保持 B 的 X 干预设定为 $x_1$。B 允许随 R 从 $\mathbf B_{x_1,\mathbf R_{x_0}}$ 变化到 $\mathbf B_{x_1,\mathbf R_{x_1}}$。
- **第二个减法**：同样改变 R，但保持 B 的 X 干预设定为 $x_0$；B 仍可以沿 $R\to B$ 发生变化。
- **与 BIE 的区别**：BIE 比较 B 时把 R 固定住；RIE 比较 R 时，允许其影响进一步传递到 B。因此 $X\to R\to B\to Y$ 归入 RIE。

RIE 对两种干预顺序下 R 的边际贡献取平均，方式与 BIE 对称。

#### 3.1.3 分解关系与复习重点

将公式 (4)、(5) 相加，包含 $\mathbf B_{x_0,\mathbf R_{x_1}}$ 和 $\mathbf B_{x_1,\mathbf R_{x_0}}$ 的交叉项分别正负抵消，因此：

$$
\mathrm{NIE}(x_1,x_0)=\mathrm{BIE}(x_1,x_0)+\mathrm{RIE}(x_1,x_0)
$$

结合 $TE=NDE+NIE$：

$$
\mathrm{TE}=\mathrm{NDE}+\mathrm{BIE}+\mathrm{RIE}
$$

**理解顺序**：先区分 B/R 路径 → 再读反事实下标 → 对照两种干预顺序 → 理解为何取平均 → 检查加总是否回到 NIE。

**解释边界**：B、R 的划分是本文选取的公平性审计框架；具体路径在法律和规范意义上是否可接受，仍取决于招聘岗位及适用的社会、法律语境。

#### 3.2 路径特定效应估计（PSE Estimation）

**本节问题**：3.1 已定义 TE、NDE、NIE、BIE、RIE，但同一个求职者不可能同时在多个反事实世界中被观测到，怎样根据实际采样数据估计这些效应？

**3.2.1 要估计的五个反事实期望**

根据公式 (1)–(5)，只需分别估计下面五个量，再通过加减运算获得全部效应：

$$
							\begin{aligned}
&\mathbb E[Y_{x_0}],\quad \mathbb E[Y_{x_1}],\quad \mathbb E[Y_{x_1,\mathbf W_{x_0}}],\\
&\mathbb E[Y_{x_1,\mathbf B_{x_0,\mathbf R_{x_1}},\mathbf R_{x_1}}],\\
&\mathbb E[Y_{x_1,\mathbf B_{x_1,\mathbf R_{x_0}},\mathbf R_{x_0}}].
\end{aligned}
$$

前四项的估计已有相关研究；本文重点给出**最后一项**的 DML-UCA 双重稳健估计器。这个反事实要求：评分方程中的 X 取 x₁、R 处于 x₀ 的自然状态、B 则按 x₁ 及该 R 状态作出响应。

**从反事实到观测分布（Appendix C.1，公式 10）**

$$
							\begin{aligned}
&\mathbb E[Y_{x_1,\mathbf B_{x_1,\mathbf R_{x_0}},\mathbf R_{x_0}}]\\
&=\sum_{b,r,z}\mathbb E[Y\mid x_1,b,r,z]\,
P(b\mid x_1,r,z)\,P(r\mid x_0,z)\,P(z).
\end{aligned}
$$

**按顺序读**：先按照 P(z) 考虑背景条件 → 按 x₀ 群体的分布 P(r|x₀,z) 得到 R → 按 x₁ 条件的分布 P(b|x₁,r,z) 得到 B → 用 E[Y|x₁,b,r,z] 预测评分 → 加权平均。这是把反事实量转换成可用观测数据估计的表达式，依赖论文的因果识别假设，并不是直接观察到了反事实世界。

**论文截图：五个估计目标与 Lemma 1**

![image.png](/images/papers/popresume-causal-fairness/figure-03.png)

**3.2.2 Table 1：辅助参数（Nuisance Parameters）**

论文引入两组三层辅助函数：μ 表示**逐层条件结果回归**，π 表示**校正观测分布的概率权重**。它们是用于估计 PSE 的中间量，不是最后要报告的效应。

**结果回归函数 μ（Table 1 原定义）**

$$
							\begin{aligned}
\mu^3&=\mathbb E[Y\mid\mathbf B,\mathbf R,X,Z],\\
\mu^2&=\mathbb E[\mu^3(\mathbf B,\mathbf R,x_1,Z)\mid\mathbf R,X,Z],\\
\mu^1&=\mathbb E[\mu^2(\mathbf R,x_1,Z)\mid X,Z].
\end{aligned}
$$

- **μ³**：给定 B、R、X、Z，预测评分 Y。
- **μ²**：将评分方程的 X 设为 x₁，并在给定 R、X、Z 条件下对 B 的分布求平均。
- **μ¹**：进一步对 R 的分布求平均，得到仅依赖 X、Z 的结果函数。
- 最后对 μ¹(x₀,Z) 取期望，就得到目标反事实期望；这正是 Appendix C.2 的参数化证明。

**概率权重 π（Table 1 原定义）**

$$
							\begin{aligned}
\pi^3&=\frac{P(X=x_0\mid\mathbf R,Z)}{P(X\mid\mathbf R,Z)}
\frac{\mathbf1[X=x_1]}{P(X=x_0\mid Z)},\\
\pi^2&=\frac{P(X=x_0\mid\mathbf R,Z)}{P(X\mid\mathbf R,Z)}
\frac{\mathbf1[X=x_1]}{P(X=x_0\mid Z)},\\
\pi^1&=\frac{\mathbf1[X=x_0]}{P(X\mid Z)}.
\end{aligned}
$$

**注意**：原文 Table 1 的 π² 和 π³ 采用相同表达式。1[·] 是示性函数；P(X|·) 表示观测到的 X 取值对应的条件概率。权重用于将不同观测群体的条件分布校正到目标反事实分布，不是“模型预测得分”。

**论文截图：Table 1 与估计公式**

![image.png](/images/papers/popresume-causal-fairness/figure-04.png)

**3.2.3 Lemma 1：DML-UCA 的交叉拟合与双重稳健估计**

1. 将数据集 D 随机分成 L 折，D=∪Dℓ，每折约含 n/L 条样本。
2. 对第 ℓ 折，使用其他 L−1 折（DDℓ）训练辅助函数 μ̂、π̂；只在未参与训练的 Dℓ 上计算估计值，避免直接在训练样本上评价。
3. 将各折估计值平均。论文实验（Section 5.1）取 L=5。

**Lemma 1 的核心公式（保留原式）**

$$
							\begin{aligned}
\phi(V;\hat\mu,\hat\pi)\triangleq{}&
\hat\pi^3\{Y-\hat\mu^3(\mathbf B,\mathbf R,X,Z)\}\\
&+\hat\pi^2\{\hat\mu^3(\mathbf B,\mathbf R,x_1,Z)-\hat\mu^2(\mathbf R,X,Z)\}\\
&+\hat\pi^1\{\hat\mu^2(\mathbf R,x_1,Z)-\hat\mu^1(X,Z)\}\\
&+\hat\mu^1(x_0,Z).
\end{aligned}
$$

**从最后一项往前读**：

- **μ̂¹(x₀,Z)**：基础反事实结果回归估计。
- **π̂¹{μ̂²−μ̂¹}**：对 R 层的条件平均误差进行加权修正。
- **π̂²{μ̂³−μ̂²}**：对 B 层的条件平均误差进行加权修正。
- **π̂³{Y−μ̂³}**：真实评分与预测评分之间的残差修正。**注意：π³ 是权重，不是残差本身**。

最终估计器：

$$
							\hat\psi_\ell=\mathbb E_{\mathcal D_\ell}[\phi(V;\hat\mu,\hat\pi)],
\qquad
\hat\psi=\frac1L\sum_{\ell=1}^{L}\hat\psi_\ell.
$$

**为什么叫双重稳健（Doubly Robust）？** 同时利用结果模型 μ 与概率权重模型 π。Appendix C.3 给出估计偏差受各层辅助函数估计误差乘积控制的结果；当相关假设及收敛条件满足时，比单纯代入一个结果回归模型更稳健，但并非任意模型都能估准因果效应。

**实现细节**：论文用 XGBoost 拟合辅助函数；对姓名、地区等类别很多、稀有类别样本不足的变量先分组合并，以提高条件期望和条件概率估计稳定性（Appendix C.4–C.5）。

**一句话总结 3.2**：先把反事实量识别为观测数据中的条件分布，再用 μ 做逐层预测、π 做加权误差修正，并通过交叉拟合获得 PSE 的估计值。

### 4. PopResume：人口代表性简历数据集

**核心问题**：估计 3.2 的因果效应需要 X、Z、B、R 等所有变量，而真实简历往往没有受保护属性标注；简单替换性别或姓名也可能破坏真实的属性关联。因此作者构建了来自美国人口统计资料的**合成简历数据集**，共 60,884 份，涉及五种职业。

**4.1 联合分布建模**

目标是按职业 J 近似 P(X,Z,B,R|J)，论文将其分解为：

$$
							\begin{aligned}
P(V\setminus\{Y\}\mid J)
={}&P(X,Z,\mathrm{state},\mathrm{edu\_level}\mid J)\\
&\cdot P(\mathrm{exp\_year}\mid X,Z,\mathrm{state},\mathrm{edu\_level},J)\\
&\cdot P(\mathrm{first\_name}\mid\mathrm{gender},\mathrm{age})\\
&\cdot P(\mathrm{surname}\mid\mathrm{race}).
\end{aligned}
$$

数据来源与作用：

- **ACS PUMS**：性别、种族、年龄、居住州、教育程度及职业的联合分布；样本限制为有职业编码的在业人口，年龄范围 18–44 岁。
- **PSID**：工作经历年限；通过密度比重加权调整与 ACS 之间的分布差异，再用 XGBoost 与截断正态分布近似条件分布（Assumption 2）。
- **SSA / Census**：分别提供随性别、年龄变化的名字频率，以及按种族区分的姓氏频率。

**假设边界**：Assumption 1 假设名字只依赖性别和年龄、姓氏只依赖种族，并假设多份统计资料在使用上相容。这些都是为了实现联合分布近似作出的模型假设。

**4.2 简历生成流程**：结构化画像 → 按规则生成求职简历 → 输入模型评分 → 用 3.2 方法估计 TE、NDE、NIE、BIE、RIE。为了减少无关的文本随机性，简历由结构化属性驱动、基于规则实例化。输出三种格式：文本简历、无照片的图像简历、有合成头像的图像简历。头像由 Face-MoGLE 根据性别、种族、年龄生成，可能引入未控制的外貌差异。

### 5. Experiments：实验与主要发现

**5.1 实验设置**

- **4 个 LLM**：Llama-3.1-8B-Instruct、Mistral-7B-Instruct-v0.2、GPT-4o-mini、Gemini-2.5-Flash-Lite；**4 个 VLM**：Qwen2.5-VL-7B-Instruct、InternVL2-8B、GPT-4o、Gemini-2.5-Flash-Lite。
- 输入为目标岗位描述和简历，模型输出 0–100 分的适配度评分；正文主要分析性别（x₀=Female，x₁=Male），种族结果见 Appendix E。**效应为正表示该路径相对有利于男性；为负则相反**。
- 5 种职业 × 3 种简历格式 × 2 种受保护属性 × 每配置 4 个模型，共 **120 个评估 case**；采用 5 折 DML-UCA 与 500 次 bootstrap 的 95% 置信区间。区间不包含 0 视为统计显著。

**5.2 Figure 4：五种代表性情形**

1. **Case 1：无显式人口属性，仍有直接效应**。NDE ≠ 0；在 80 个不显式包含受保护属性的评估 case 中，49 个呈现该现象。
2. **Case 2：总效应掩盖歧视**。TE ≈ 0，但 NDE、NIE 非零且方向相反，彼此抵消；120 个中有 6 个。
3. **Case 3：岗位资质路径主导**。NDE ≈ 0、RIE ≈ 0、BIE ≠ 0；120 个中有 6 个。这类差异是否可被正当化还需论证商业必要性。
4. **Case 4：人口统计代理路径主导**。NDE ≈ 0、BIE ≈ 0、RIE ≠ 0；120 个中有 6 个。
5. **Case 5：BIE、RIE 同时显著**。两条路径可能相互抵消或放大；120 个中有 53 个。

**注意**：上述 Case 是按效应特征挑出的代表性模式，统计的样本范围可能不同，不能直接把各 Case 数量相加当作互斥且穷尽的分组。

**5.3 Figure 5：头像对 VLM 的影响**

比较相同画像的图像简历有无合成头像：论文在 20 对配置中观察到 **8 对加入照片后 NDE 的绝对值明显增大**。这表明照片可能增强模型从外貌中利用受保护属性信息的机会；但并不意味着所有 VLM 或所有岗位都会出现同样变化。

**结论与局限**：仅看群体平均分、通过率或 TE，可能忽略彼此抵消的路径效应；PSE 将差异拆解为更可解释的来源。但数据主要来自美国人口统计，简历是规则生成的合成文本，B/R 划分有情境依赖，因果识别和估计还依赖假设，不能直接等同于真实招聘中的违法判定。