---
title: 数学公式展示
date: 2024-01-04 10:00:00
categories:
  - [学习笔记]
tags:
  - 数学
  - KaTeX
  - 公式
math: true
cover: /images/math-cover.jpg
---

# 数学公式展示

本文展示了 KaTeX 数学公式的各种用法。

## 基础公式

### 行内公式
这是一个行内公式：$E = mc^2$，爱因斯坦的质能方程。

勾股定理：$a^2 + b^2 = c^2$

二次方程求根公式：$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$

### 块级公式

欧拉公式：
$$e^{i\pi} + 1 = 0$$

麦克斯韦方程组：
$$
\begin{align}
\nabla \times \vec{\mathbf{B}} -\, \frac1c\, \frac{\partial\vec{\mathbf{E}}}{\partial t} &= \frac{4\pi}{c}\vec{\mathbf{j}} \\
\nabla \cdot \vec{\mathbf{E}} &= 4 \pi \rho \\
\nabla \times \vec{\mathbf{E}}\, +\, \frac1c\, \frac{\partial\vec{\mathbf{B}}}{\partial t} &= \vec{\mathbf{0}} \\
\nabla \cdot \vec{\mathbf{B}} &= 0
\end{align}
$$

<!-- more -->

## 高级公式

### 矩阵
$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
\begin{pmatrix}
x \\
y
\end{pmatrix}
=
\begin{pmatrix}
ax + by \\
cx + dy
\end{pmatrix}
$$

### 积分
$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$

### 求和
$$\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}$$

### 极限
$$\lim_{x \to 0} \frac{\sin x}{x} = 1$$

### 分数
$$\frac{d}{dx}\left( \int_{0}^{x} f(u)\,du\right)=f(x)$$

## 特殊符号

### 希腊字母
$\alpha, \beta, \gamma, \delta, \epsilon, \zeta, \eta, \theta$

$\Alpha, \Beta, \Gamma, \Delta, \Epsilon, \Zeta, \Eta, \Theta$

### 运算符
$\pm, \mp, \times, \div, \cdot, \ast, \star, \circ, \bullet$

### 关系符
$=, \neq, <, >, \leq, \geq, \equiv, \approx, \sim, \propto$

### 集合符号
$\in, \notin, \subset, \supset, \subseteq, \supseteq, \cap, \cup, \emptyset$

## 复杂公式示例

### 傅里叶变换
$$\mathcal{F}(f)(x) = \int_{-\infty}^{\infty} f(t) e^{-2\pi i x t} dt$$

### 薛定谔方程
$$i\hbar\frac{\partial}{\partial t}\Psi(\mathbf{r},t) = \hat{H}\Psi(\mathbf{r},t)$$

### 贝叶斯定理
$$P(A|B) = \frac{P(B|A)P(A)}{P(B)}$$

### 泰勒级数
$$f(x) = \sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!}(x-a)^n$$

## 化学公式

化学反应方程式：
$$\ce{2H2 + O2 -> 2H2O}$$

分子式：
$$\ce{C6H12O6 + 6O2 -> 6CO2 + 6H2O}$$

## 总结

KaTeX 提供了强大的数学公式渲染能力，支持：

- 基础数学符号和运算
- 复杂的公式排版
- 矩阵和向量表示
- 积分、求和、极限等高级数学概念
- 化学公式支持

这使得在博客中展示数学内容变得非常方便！
