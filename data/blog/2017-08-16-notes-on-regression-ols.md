---
title: Notes on Regression - OLS
author: Timothy Lin
date: '2017-08-16'
tags: ['regression', 'ols', 'notes']
summary: This post is the first in a series of my study notes on regression techniques. It covers regression as a solution to the least squares minimisation problem
---

This post is the first in a series of my study notes on regression techniques. I first learnt about regression as a way of fitting a line through a series of points. Invoke some assumptions and one obtains the relationship between two variables. Simple...or so I thought. Through the course of my study, I developed a deeper appreciation of its nuances which I hope to elucidate in these set of notes.

Aside: The advancements in regression analysis, since it was introduced by Gauss in the early 19th century, is an interesting case study of the development of applied mathematics. The method remains roughly the same, but advances in other related fields (linear algebra, statistics) and applied econometrics helped clarify the assumptions used and elevate its status in modern applied research.

In this review, I shall focus on the ordinary linear regression (OLS) and omit treatment of its many descendants.^[The popularity and limitations of the simple OLS regression has spawn many related techniques that are the subject of numerous research papers by themselves.] Let's start at the source and cover regression as a solution to the least squares minimisation problem, before going to deeper waters!

## Preliminaries / Notation

Using matrix notation, let $n$ denote the number of observations and $k$ denote the number of regressors.

The vector of outcome variables $\mathbf{Y}$ is a $n \times 1$ matrix,

$$
\mathbf{Y} = \left[\begin{array}
{c}
y_1 \\
. \\
. \\
. \\
y_n
\end{array}\right]
$$

The matrix of regressors $\mathbf{X}$ is a $n \times k$ matrix (or each row is a $k \times 1$ vector),

$$
\mathbf{X} = \left[\begin{array}
{ccccc}
x_{11} & . & . & . & x_{1k} \\
. & . & . & . & .  \\
. & . & . & . & .  \\
. & . & . & . & .  \\
x_{n1} & . & . & . & x_{nn}
\end{array}\right] =
\left[\begin{array}
{c}
\mathbf{x}'_1 \\
. \\
. \\
. \\
\mathbf{x}'_n
\end{array}\right]
$$

The vector of error terms $\mathbf{U}$ is also a $n \times 1$ matrix.

At times it might be easier to use vector notation. For consistency I will use the bold small x to denote a vector and capital letters to denote a matrix. Single observations are denoted by the subscript.

## Least Squares

**Start**:  
$$y_i = \mathbf{x}'_i \beta + u_i$$

**Assumptions**:

1. Linearity (given above)
2. $E(\mathbf{U}|\mathbf{X}) = 0$ (conditional independence)
3. rank($\mathbf{X}$) = $k$ (no multi-collinearity i.e. full rank)
4. $Var(\mathbf{U}|\mathbf{X}) = \sigma^2 I_n$ (Homoskedascity)

**Aim**:  
Find $\beta$ that minimises sum of squared errors:

$$
Q = \sum_{i=1}^{n}{u_i^2} = \sum_{i=1}^{n}{(y_i - \mathbf{x}'_i\beta)^2} = (Y-X\beta)'(Y-X\beta)
$$

**Solution**:  
Hints: $Q$ is a $1 \times 1$ scalar, by symmetry $\frac{\partial b'Ab}{\partial b} = 2Ab$.

Take matrix derivative w.r.t $\beta$:

$$
\begin{aligned}
\min Q &= \min_{\beta} \mathbf{Y}'\mathbf{Y} - 2\beta'\mathbf{X}'\mathbf{Y} +
\beta'\mathbf{X}'\mathbf{X}\beta \\
&= \min_{\beta} - 2\beta'\mathbf{X}'\mathbf{Y} + \beta'\mathbf{X}'\mathbf{X}\beta \\
\text{[FOC]}~~~0 &=  - 2\mathbf{X}'\mathbf{Y} + 2\mathbf{X}'\mathbf{X}\hat{\beta} \\
\hat{\beta} &= (\mathbf{X}'\mathbf{X})^{-1}\mathbf{X}'\mathbf{Y} \\
&= (\sum^{n} \mathbf{x}_i \mathbf{x}'_i)^{-1} \sum^{n} \mathbf{x}_i y_i
\end{aligned}
$$

**Notes**:

1. $\hat{\beta}$ is a linear estimator i.e. it can be written in the form $b=AY$ where $A$ only depends on $X$ but not $Y$.
2. Under assumptions 1-3, the estimator is unbiased. Substituting $y_{i}$:

$$
\begin{aligned}
E(\hat{\beta}|\mathbf{X}) &= \beta + E((\mathbf{X}'\mathbf{X})^{-1}\mathbf{X}'U|X) \\
&= \beta + (\mathbf{X}'\mathbf{X})^{-1}\mathbf{X}'E(U|X) \\
&= \beta
\end{aligned}
$$

By law of iterated expectation $E(\hat{\beta}) = EE(\hat{\beta}|\mathbf{X}) = \beta$  
3. Adding in the homoskedascity assumption, the OLS estimator is the Best Linear Unbiased Estimator (BLUE) i.e. smallest variance among other linear and unbiased estimators or $Var(b|\mathbf{X}) - Var(\hat{\beta}|\mathbf{X})$ is p.s.d.  
4. If the errors are normally distributed then conditional on $\mathbf{X}$, $\hat{\beta}$ is also normally distributed.

## Large Sample Properties

It is almost impossible for any real life data to satisfy the above assumptions, an exception is when $Y$ and $X$ are jointly normal but that is a stretch to belief. To get around this issue, one can replace assumption 2 (conditional independence) with a weaker assumption: $E(u_{i}\mathbf{x_{i}}) = 0$ (weak exogeneity). Under this weaker assumption, the estimator is no longer unbiased.^[Recall that unbiasedness requires conditional independence to hold but uncorrelatedness does not imply conditional independence.] One must appeal to large sample theory to draw any meaningful results. More specifically, we use the idea of convergence in probability and weak law of large numbers to show that the estimator is consistent.^[Similarly, the central limit theorem is used to establish convergence in distribution which is needed for statistical inference.]

**Assumptions**:

1. Linearity
2. $E(u_{i}\mathbf{x_{i}}) = 0$ (weak exogeneity)
3. $(y_{i},\mathbf{x}_{i})$ are i.i.d
4. $E(\mathbf{x}_{i}\mathbf{x}_{i}')$ is p.s.d
5. $Ex^{4}_{i,j} < \infty$
6. $Eu^{4}_{i} < \infty$
7. $Eu^{2}_{i}\mathbf{x}_{i}\mathbf{x}_{i}'$ is p.s.d

**Notes**:

1. $\hat{\beta}_{n}$ is consistent since $\hat{\beta}_{n} \rightarrow_{p} \beta$ as $n \rightarrow \infty$.^[$\beta$ is denoted with a subscript n to signify that it is a function of the sample size.]
2. Large sample assumptions 3 and 4 are needed to establish convergence in probability:
   $$
   \hat{\beta}_{n} = \beta +(\frac{1}{n} \sum^{n} \mathbf{x}_i \mathbf{x}'_i)^{-1} \frac{1}{n}\sum^{n} \mathbf{x}_i u_i
   $$
   Use the fact that $\frac{1}{n} \sum^{n} \mathbf{x}_i \mathbf{x}'_i \rightarrow_{p} E(\mathbf{x}_{i}\mathbf{x}_{i}')$ while $\frac{1}{n} \sum^{n} \mathbf{x}_i u_i \rightarrow_{p} E(u_{i}\mathbf{x_{i}}) = 0$ to prove consistency.
3. Large sample assumptions 1-7 are used to prove asymptotic normality of the estimator.
